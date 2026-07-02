import { Resend } from "resend";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

// --- Meta Conversions API (szerveroldali Lead esemény) ----------------------
// A böngészős pixel csak akkor sül el, ha a látogató elfogadja a marketing
// cookie-kat — magyar usereknél a többség nem. Ezért a Lead eseményt
// szerverről IS elküldjük a Metának, cookie-tól és ad blockertől függetlenül.
// Így minden jelentkezést lát a Meta és tud rá optimalizálni.
const META_PIXEL_ID = process.env.META_PIXEL_ID || "1452932669308796";
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN;

function sha256(v: string) {
  return crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

// Telefonszám E.164 jegyekre (országkód +-jel nélkül), hash előtt.
function normPhone(p: string) {
  let d = p.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("06")) d = "36" + d.slice(2);
  else if (!d.startsWith("36")) d = "36" + d;
  return d;
}

async function sendMetaLead(d: Lead, req: Request) {
  if (!META_CAPI_TOKEN) {
    console.warn("[lead] META_CAPI_TOKEN hiányzik – Meta Conversions API kihagyva");
    return;
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ua = req.headers.get("user-agent") || undefined;
  const referer = req.headers.get("referer") || "https://klimapluscell.hu/urlap";

  const user_data: Record<string, unknown> = {};
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;
  // Hashelt azonosító (jobb párosítás) CSAK ha a user az űrlapon
  // hozzájárult a marketinghez. Enélkül de-identifikált a konverzió.
  if (d.marketingConsent) {
    if (d.email) user_data.em = [sha256(d.email)];
    if (d.phone) user_data.ph = [sha256(normPhone(d.phone))];
  }

  const event: Record<string, unknown> = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: referer,
    user_data,
  };
  // Dedup a böngészős pixellel: ugyanaz az event_id → a Meta nem számol kétszer.
  if (d.eventId) event.event_id = d.eventId;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v23.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event] }),
      },
    );
    if (!res.ok) {
      console.error("[lead] Meta CAPI hiba", res.status, await res.text());
    }
  } catch (e) {
    console.error("[lead] Meta CAPI kivétel", e);
  }
}

// Verified Resend sending domain (klimapluscell.hu). Hardcoded since it's
// stable — the old LEAD_FROM_EMAIL env var on Vercel is now unused.
const FROM = "Klima Plus <noreply@klimapluscell.hu>";
const NOTIFY = (process.env.LEAD_NOTIFY_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// E-mail kill-switch. ALAPÉRTELMEZÉS: KIKAPCSOLVA (teszt alatt) — a form működik,
// a lead logba kerül, de NEM megy e-mail. ÉLESÍTÉSKOR: állítsd a LEAD_EMAIL_ENABLED
// env-változót "true"-ra (Vercel → Environment Variables) + redeploy.
const EMAILS_ENABLED = process.env.LEAD_EMAIL_ENABLED === "true";

function esc(s: unknown) {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));
}

const ft = (n: unknown) => (Number(n) || 0).toLocaleString("hu-HU") + " Ft";

const PHONE_DISPLAY = "+36 70 256 6448";
const PHONE_TEL = "+36702566448";

function confirmationHtml(firstName: string) {
  const name = esc(firstName);
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#ffffff;">
<div style="max-width:560px;margin:0 auto;padding:28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#222222;">
  <p style="margin:0 0 22px;font-size:22px;font-weight:bold;letter-spacing:1px;color:#1f9fd6;">KLIMA PLUS</p>
  <h1 style="margin:0 0 16px;font-size:20px;color:#16a34a;">Sikeres jelentkezés</h1>
  <p style="margin:0 0 14px;">Kedves ${name}!</p>
  <p style="margin:0 0 14px;">Köszönjük a jelentkezését a klíma telepítés kapcsán. Megkaptuk az adatait.</p>
  <p style="margin:0 0 14px;"><strong>24 órán belül telefonon felvesszük Önnel a kapcsolatot.</strong></p>
  <p style="margin:0 0 22px;">Ha nem szeretne várni, hívjon minket: <a href="tel:${PHONE_TEL}" style="color:#1f9fd6;text-decoration:none;">${PHONE_DISPLAY}</a></p>
  <p style="margin:0 0 24px;">Üdvözlettel,<br>Takács Tamás &middot; Klima Plus Cell Kft.</p>
  <p style="margin:0;border-top:1px solid #eeeeee;padding-top:14px;font-size:12px;color:#999999;">Klima Plus Cell Kft. &middot; Koptik Odó utca 20., 9500 Celldömölk &middot; Adószám: 32621880-2-18</p>
</div>
</body></html>`;
}

function confirmationText(firstName: string) {
  return `Kedves ${firstName}!

Köszönjük a jelentkezését a klíma telepítés kapcsán! Megkaptuk az adatait, és 24 órán belül telefonon felvesszük Önnel a kapcsolatot.

Nem szeretne várni? Hívjon most: ${PHONE_DISPLAY}

Üdvözlettel,
Takács Tamás
Klima Plus Cell Kft.`;
}

type Lead = {
  houseType?: string; lastName?: string; firstName?: string;
  email?: string; phone?: string; marketingConsent?: boolean; zip?: string;
  eventId?: string;
  // Ajánlatkérő kalkulátor (/ajanlatkero) extra mezői – opcionálisak
  source?: string; city?: string; consent?: boolean;
  rooms?: number; roomSizes?: string[]; priceRange?: string;
  priceCategory?: string; brands?: string[]; urgency?: string;
  // Belső ajánlás: helyiségenként a méret + kategória + márka szerinti modell + ár.
  recommended?: { room: number; size: string; picks: RecPick[] }[];
  recTotals?: { brand: string; total: number }[];
  turnstileToken?: string;
};

type RecPick = { brand: string; model: string; kw: number; price: number };

// Az ajánlatkérő kalkulátorból (/ajanlatkero) érkező extra adatok blokkja.
function calcBlockHtml(d: Lead) {
  if (d.source !== "ajanlatkero") return "";
  const sizes = (d.roomSizes ?? []).map((x) => esc(x)).join("<br>") || "—";
  const brands = (d.brands ?? []).map((x) => esc(x)).join(", ") || "Mindegy";
  return `
  <div style="margin:18px 0;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:bold;color:#c2630f;">🧮 Ajánlatkérő kalkulátor</p>
    <strong>Helyiségek:</strong> ${esc(d.rooms) || "—"} db<br>
    <strong>Méretek:</strong><br>${sizes}<br>
    <strong>Ár-tartomány:</strong> ${esc(d.priceRange) || "—"} ${d.priceCategory ? `(${esc(d.priceCategory)})` : ""}<br>
    <strong>Márka:</strong> ${brands}<br>
    <strong>Sürgősség:</strong> ${esc(d.urgency) || "—"}
  </div>`;
}

// Belső ajánlás blokk – konkrét modellek + készülék-listaárak a szerelőnek.
// A látogató ezt NEM látja, csak a szerelői értesítő emailbe kerül.
function recBlockHtml(d: Lead) {
  if (d.source !== "ajanlatkero" || !d.recommended?.length) return "";
  const rooms = d.recommended
    .map((r) => {
      const items =
        (r.picks ?? [])
          .map(
            (p) =>
              `<li>${esc(p.brand)} ${esc(p.model)} – ${esc(p.kw)} kW – <strong>${ft(p.price)}</strong></li>`,
          )
          .join("") || `<li style="color:#999;">nincs illő modell</li>`;
      return `<p style="margin:10px 0 2px;font-weight:bold;">${esc(r.room)}. helyiség (${esc(r.size)}):</p>
      <ul style="margin:0 0 6px;padding-left:18px;">${items}</ul>`;
    })
    .join("");
  const totals = (d.recTotals ?? [])
    .map((t) => `${esc(t.brand)}: <strong>${ft(t.total)}</strong>`)
    .join(" · ");
  return `
  <div style="margin:18px 0;padding:14px 16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
    <p style="margin:0 0 4px;font-weight:bold;color:#1d4ed8;">🛠️ Javasolt modellek (belső – készülék-listaár, szerelés nélkül)</p>
    ${rooms}
    ${totals ? `<p style="margin:8px 0 0;">Becsült készülék-összeg: ${totals}</p>` : ""}
  </div>`;
}

function recText(d: Lead) {
  if (d.source !== "ajanlatkero" || !d.recommended?.length) return "";
  const rooms = d.recommended
    .map((r) => {
      const lines =
        (r.picks ?? []).map((p) => `  - ${p.brand} ${p.model} – ${p.kw} kW – ${ft(p.price)}`).join("\n") ||
        "  - nincs illő modell";
      return `${r.room}. helyiség (${r.size}):\n${lines}`;
    })
    .join("\n");
  const totals = (d.recTotals ?? []).map((t) => `${t.brand}: ${ft(t.total)}`).join(" · ");
  return `

--- Javasolt modellek (belső, készülék-listaár szerelés nélkül) ---
${rooms}${totals ? `\nBecsült készülék-összeg: ${totals}` : ""}`;
}

function notifyHtml(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  const telHref = (d.phone ?? "").replace(/[^\d+]/g, "");
  const when = new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
  const location = esc(d.city) || esc(d.zip) || "—";
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#ffffff;">
<div style="max-width:560px;margin:0 auto;padding:28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222222;">
  <h1 style="margin:0 0 14px;font-size:19px;">Új jelentkezés – Klima Plus${d.source === "ajanlatkero" ? " (Ajánlatkérő)" : ""}</h1>
  <p style="margin:0 0 18px;font-size:17px;"><strong>Hívd fel mielőbb:</strong> <a href="tel:${telHref}" style="color:#1f9fd6;text-decoration:none;font-weight:bold;">${esc(d.phone)}</a></p>
  <p style="margin:0;">
    <strong>Név:</strong> ${esc(fullName)}<br>
    <strong>E-mail:</strong> <a href="mailto:${esc(d.email)}" style="color:#1f9fd6;text-decoration:none;">${esc(d.email)}</a><br>
    <strong>Település / ISZ:</strong> ${location}<br>
    <strong>Háztípus:</strong> ${esc(d.houseType) || "—"}<br>
    <strong>Marketing hozzájárulás:</strong> ${d.marketingConsent ? "igen" : "nem"}<br>
    <strong>Beérkezett:</strong> ${esc(when)}
  </p>
  ${calcBlockHtml(d)}
  ${recBlockHtml(d)}
</div>
</body></html>`;
}

function notifyText(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  const calc =
    d.source === "ajanlatkero"
      ? `
--- Ajánlatkérő kalkulátor ---
Helyiségek: ${d.rooms ?? "—"} db
Méretek:
${(d.roomSizes ?? []).join("\n") || "—"}
Ár-tartomány: ${d.priceRange ?? "—"}${d.priceCategory ? ` (${d.priceCategory})` : ""}
Márka: ${(d.brands ?? []).join(", ") || "Mindegy"}
Sürgősség: ${d.urgency ?? "—"}`
      : "";
  return `Új jelentkezés – Klima Plus

Hívd fel mielőbb: ${d.phone ?? "—"}

Név: ${fullName}
E-mail: ${d.email ?? "—"}
Település / ISZ: ${d.city ?? d.zip ?? "—"}
Háztípus: ${d.houseType ?? "—"}
Marketing hozzájárulás: ${d.marketingConsent ? "igen" : "nem"}${calc}${recText(d)}`;
}

export async function POST(req: Request) {
  let d: Lead;
  try {
    d = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (!d?.firstName || !d?.email || !d?.phone) {
    return NextResponse.json({ error: "Hiányzó kötelező mező" }, { status: 400 });
  }

  // Cloudflare Turnstile ellenőrzés – CSAK ha be van állítva a secret kulcs.
  // Enélkül kihagyjuk (a form ekkor token nélkül is működik, pl. fejlesztésben).
  const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
  if (TURNSTILE_SECRET) {
    if (!d.turnstileToken) {
      return NextResponse.json({ error: "Hiányzó biztonsági ellenőrzés" }, { status: 400 });
    }
    try {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const form = new URLSearchParams({ secret: TURNSTILE_SECRET, response: d.turnstileToken });
      if (ip) form.set("remoteip", ip);
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      });
      const result = (await verify.json()) as { success?: boolean };
      if (!result.success) {
        return NextResponse.json({ error: "Sikertelen biztonsági ellenőrzés" }, { status: 400 });
      }
    } catch (e) {
      console.error("[lead] Turnstile verify exception", e);
      return NextResponse.json({ error: "Biztonsági ellenőrzés hiba" }, { status: 502 });
    }
  }

  // Meta Conversions API – MINDIG, az e-mail kill-switchtől függetlenül, hogy
  // a Meta minden jelentkezést lásson (cookie-tól és böngészőtől függetlenül).
  await sendMetaLead(d, req);

  // Teszt alatt kikapcsolva (LEAD_EMAIL_ENABLED=false) — nem küldünk e-mailt
  if (!EMAILS_ENABLED) {
    console.warn("[lead] e-mail KIKAPCSOLVA (teszt) – lead csak logba:", d);
    return NextResponse.json({ ok: true, warning: "emails-disabled" });
  }

  // Don't lose the lead even if email isn't configured yet
  if (!process.env.RESEND_API_KEY) {
    console.warn("[lead] RESEND_API_KEY missing – lead captured in logs only:", d);
    return NextResponse.json({ ok: true, warning: "email-not-configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1) Internal notification FIRST and independently — speed-to-lead is the
  // critical path, so it must fire even if the lead's confirmation fails (e.g.
  // before the sending domain is verified in Resend, only the account owner's
  // address is deliverable).
  if (NOTIFY.length) {
    try {
      await resend.emails.send({
        from: FROM,
        to: NOTIFY,
        replyTo: d.email,
        subject: `Új jelentkezés: ${d.firstName} ${d.lastName ?? ""} – ${d.phone}`,
        html: notifyHtml(d),
        text: notifyText(d),
      });
    } catch (e) {
      console.error("[lead] notify send failed", e, d);
    }
  }

  // 2) Confirmation to the lead (best-effort; failure must not block the above)
  try {
    await resend.emails.send({
      from: FROM,
      to: d.email,
      subject: "Sikeres jelentkezés – Klima Plus",
      html: confirmationHtml(d.firstName),
      text: confirmationText(d.firstName),
    });
  } catch (e) {
    console.error("[lead] confirmation send failed", e);
  }

  return NextResponse.json({ ok: true });
}
