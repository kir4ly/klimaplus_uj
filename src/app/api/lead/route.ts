import { Resend } from "resend";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { buildQuote, type Quote } from "@/lib/klimaPrices";

export const runtime = "nodejs";

// --- Meta Conversions API (szerveroldali) -----------------------------------
// Separate pixels per landing page:
// - /ajanlatkero (new) → new pixel + "Érdeklődő" event
// - /urlap (old) + others → old pixel + "Lead" event
const OLD_PIXEL_ID = process.env.OLD_META_PIXEL_ID || "1452932669308796";
const NEW_PIXEL_ID = process.env.NEW_META_PIXEL_ID || "4526635934216768";
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

  const isNewPage = d.source === "ajanlatkero";
  const pixelId = isNewPage ? NEW_PIXEL_ID : OLD_PIXEL_ID;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ua = req.headers.get("user-agent") || undefined;

  // Jobb dedup: használjuk az ügyfél által küldött pontos URL-t, ha van (www is)
  const fallback = isNewPage ? "https://www.klimapluscell.hu/ajanlatkero" : "https://www.klimapluscell.hu/urlap";
  const eventSourceUrl = d.pageUrl || req.headers.get("referer") || fallback;

  const user_data: Record<string, unknown> = {};
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;
  // Hashelt azonosító (jobb párosítás) CSAK ha a user az űrlapon
  // hozzájárult a marketinghez. Ennélkül de-identifikált a konverzió.
  if (d.marketingConsent) {
    if (d.email) user_data.em = [sha256(d.email)];
    if (d.phone) user_data.ph = [sha256(normPhone(d.phone))];
  }

  // Dedup ID shared between browser pixel and CAPI
  const eventId = d.eventId;

  let events: Record<string, unknown>[];

  if (isNewPage) {
    // New /ajanlatkero landing page → new pixel + Érdeklődő conversion
    events = [
      {
        event_name: "Érdeklődő",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data,
        custom_data: { source: "ajanlatkero" },
        ...(eventId ? { event_id: eventId } : {}),
      },
    ];
  } else {
    // Old /urlap and other sources → old pixel + standard Lead
    events = [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data,
        ...(eventId ? { event_id: eventId } : {}),
      },
    ];
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: events }),
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

// Az adatbázisban szereplő összegek kizárólag készülékárak. A szerelés díját
// nem ismerjük, ezért az emailben nem adjuk hozzá a kalkulált összeghez.
const INSTALL_FEE_PER_UNIT = 0;
const DEVICE_PRICE_NOTE =
  "A feltüntetett árak kizárólag a klímaberendezések árát tartalmazzák. A szerelés díja nincs benne; arra a helyszíni felmérés után külön ajánlatot adunk.";
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
  siteSurvey?: "callback" | "information_only" | null;
  // Átadjuk a pontos oldalcímet a jobb CAPI deduplikációhoz (event_source_url)
  pageUrl?: string;
  // Ajánlatkérő kalkulátor (/ajanlatkero) extra mezői – opcionálisak
  source?: string; city?: string; consent?: boolean;
  rooms?: number; roomSizes?: string[]; priceRange?: string;
  sizes?: (string | null)[]; // nyers méret-címkék a vásárlói árajánlat számításához
  priceCategory?: string; brands?: string[]; urgency?: string;
  turnstileToken?: string;
};

function quoteCriteriaHtml(d: Lead, title: string) {
  const sizes = (d.roomSizes ?? []).map((x) => esc(x)).join("<br>") || "—";
  const brands = (d.brands ?? []).map((x) => esc(x)).join(", ") || "Mindegy";
  const price = `${esc(d.priceRange) || "—"}${d.priceCategory ? ` (${esc(d.priceCategory)})` : ""}`;
  return `
  <div style="margin:18px 0;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:bold;color:#c2630f;">${title}</p>
    <strong>Helyiségek:</strong> ${esc(d.rooms) || "—"} db<br>
    <strong>Méretek:</strong><br>${sizes}<br>
    <strong>Ár-tartomány:</strong> ${price}<br>
    <strong>Márka:</strong> ${brands}<br>
    <strong>Sürgősség:</strong> ${esc(d.urgency) || "—"}
  </div>`;
}

function quoteCriteriaText(d: Lead) {
  return `Helyiségek: ${d.rooms ?? "—"} db
Méretek:
${(d.roomSizes ?? []).join("\n") || "—"}
Ár-tartomány: ${d.priceRange ?? "—"}${d.priceCategory ? ` (${d.priceCategory})` : ""}
Márka: ${(d.brands ?? []).join(", ") || "Mindegy"}
Sürgősség: ${d.urgency ?? "—"}`;
}

// --- Közös árajánlatblokk ----------------------------------------------------
// Ugyanezek a segédfüggvények építik fel az ügyfél és a belső címzettek
// ajánlatblokkját, így mindkét fél pontosan ugyanazokat a modelleket és árakat látja.
function quoteForLead(d: Lead) {
  return buildQuote(d.sizes ?? [], d.priceCategory ?? "", d.brands ?? [], INSTALL_FEE_PER_UNIT);
}

function quoteRoomsHtml(q: Quote) {
  return q.rooms
    .map((r, i) => {
      const n = i + 1;
      if (!r.options.length) {
        return `
    <div style="margin:16px 0;">
      <p style="margin:0 0 8px;font-weight:bold;font-size:16px;color:#111;">${n}. helyiség <span style="color:#888;font-weight:normal;">– ${esc(r.size)}</span></p>
      <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;color:#555;font-size:14px;">
        Erre a helyiségre egyedi árajánlatot készítünk – kollégánk hamarosan keresi.
      </div>
    </div>`;
      }
      const cards = r.options
        .map((o, idx) => {
          const best = idx === 0;
          return `
      <div style="margin:0 0 10px;padding:14px 16px;background:#ffffff;border:1px solid ${best ? "#bfdbfe" : "#e5e7eb"};border-radius:10px;">
        <div style="font-size:15px;font-weight:bold;color:#111;">${esc(o.brand)} ${esc(o.model)} – ${esc(o.kw)} kW${
          best
            ? ` <span style="display:inline-block;margin-left:6px;padding:2px 9px;font-size:11px;font-weight:bold;color:#fff;background:#2563eb;border-radius:999px;">Legjobb ár</span>`
            : ""
        }</div>
        <div style="margin-top:6px;font-size:17px;font-weight:bold;color:#2563eb;">${ft(o.price)} <span style="font-size:13px;font-weight:normal;color:#888;">készülékár · szerelés nélkül</span></div>
      </div>`;
        })
        .join("");
      return `
    <div style="margin:18px 0;">
      <p style="margin:0 0 10px;font-weight:bold;font-size:16px;color:#111;">${n}. helyiség <span style="color:#888;font-weight:normal;">– ${esc(r.size)} (${r.options.length} ajánlat)</span></p>
      ${cards}
    </div>`;
    })
    .join("");
}

function quoteSummaryHtml(q: Quote) {
  return `
    <div style="margin:22px 0 8px;padding:18px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
      <p style="margin:0 0 12px;font-weight:bold;font-size:16px;color:#1d4ed8;">💰 Készülékárak összesítése (legolcsóbb opcióval)</p>
      <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;">
        <tr><td style="padding:4px 0;">Klímák száma:</td><td style="padding:4px 0;text-align:right;font-weight:600;">${esc(q.unitCount)} db</td></tr>
      </table>
      <div style="border-top:1px solid #bfdbfe;margin:10px 0;"></div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:2px 0;font-size:17px;font-weight:bold;color:#111;">Becsült készülékösszeg:</td><td style="padding:2px 0;text-align:right;font-size:19px;font-weight:800;color:#2563eb;">${ft(q.productsTotal)}</td></tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;color:#888;">* ${esc(DEVICE_PRICE_NOTE)}</p>
    </div>`;
}

function quoteRoomsText(q: Quote) {
  return q.rooms
    .map((r, i) => {
      const n = i + 1;
      if (!r.options.length) return `${n}. helyiség (${r.size}): egyedi árajánlatot készítünk.`;
      const lines = r.options
        .map(
          (o, idx) =>
            `  ${idx === 0 ? "★" : "-"} ${o.brand} ${o.model} ${o.kw} kW – ${ft(o.price)} (készülékár, szerelés nélkül)`,
        )
        .join("\n");
      return `${n}. helyiség (${r.size}):\n${lines}`;
    })
    .join("\n\n");
}

function quoteSummaryText(q: Quote) {
  return `--- Készülékárak összesítése (legolcsóbb opcióval) ---
Klímák száma: ${q.unitCount} db
Becsült készülékösszeg: ${ft(q.productsTotal)}

* ${DEVICE_PRICE_NOTE}`;
}

function internalQuoteHtml(d: Lead) {
  if (d.source !== "ajanlatkero") return "";
  const q = quoteForLead(d);
  return `
  <div style="margin:24px 0 0;border-top:2px solid #bfdbfe;padding-top:18px;">
    <p style="margin:0 0 4px;font-weight:bold;font-size:17px;color:#1d4ed8;">📧 Az ügyfélnek kiküldött ajánlat</p>
    <p style="margin:0 0 8px;color:#555;">Az alábbi készülékopciókat és árakat az ügyfél is pontosan így kapta meg:</p>
    ${quoteRoomsHtml(q)}
    ${quoteSummaryHtml(q)}
  </div>`;
}

function internalQuoteText(d: Lead) {
  if (d.source !== "ajanlatkero") return "";
  const q = quoteForLead(d);
  return `

--- Az ügyfélnek kiküldött ajánlat ---
Az alábbi készülékopciókat és árakat az ügyfél is pontosan így kapta meg:

${quoteRoomsText(q)}

${quoteSummaryText(q)}`;
}

function quoteHtml(d: Lead) {
  const q = quoteForLead(d);
  const first = (d.firstName ?? "").trim() || "Érdeklődő";
  const roomCount = d.rooms ?? q.rooms.length;
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f1f5f9;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.6;">
  <div style="background:#0a0a0a;padding:22px 24px;text-align:center;">
    <img src="https://klimapluscell.hu/logo-email.png" alt="Klíma Plus" width="210" style="display:inline-block;width:210px;max-width:70%;height:auto;">
  </div>
  <div style="padding:28px 24px;">
    <h1 style="margin:0 0 6px;font-size:22px;color:#2563eb;text-align:center;">Személyre szabott klíma ajánlat</h1>
    <p style="margin:18px 0 6px;font-size:16px;">Kedves ${esc(first)}!</p>
    <p style="margin:0 0 18px;font-size:15px;color:#444;">Az Ön ${esc(roomCount)} helyiségére az alábbi klímaberendezéseket ajánljuk:</p>

    ${quoteCriteriaHtml(d, "Az Ön igényei")}

    ${quoteRoomsHtml(q)}
    ${quoteSummaryHtml(q)}

    <p style="margin:26px 0 12px;text-align:center;font-size:15px;color:#444;">Kérdése van? Hívjon minket bizalommal!</p>
    <p style="margin:0;text-align:center;">
      <a href="tel:${PHONE_TEL}" style="display:inline-block;padding:13px 30px;background:#2563eb;color:#fff;font-weight:bold;font-size:16px;text-decoration:none;border-radius:999px;">${PHONE_DISPLAY}</a>
    </p>
  </div>
  <div style="padding:20px 24px;border-top:1px solid #eee;text-align:center;font-size:12px;color:#999;">
    <p style="margin:0 0 4px;font-weight:bold;color:#555;">Klima Plus Cell Kft.</p>
    <p style="margin:0 0 4px;">Koptik Odó utca 20., 9500 Celldömölk &middot; Adószám: 32621880-2-18</p>
    <p style="margin:0;">Ez az email automatikusan lett létrehozva az Ön ajánlatkérése alapján.</p>
  </div>
</div>
</body></html>`;
}

function quoteText(d: Lead) {
  const q = quoteForLead(d);
  const first = (d.firstName ?? "").trim() || "Érdeklődő";
  return `Személyre szabott klíma ajánlat

Kedves ${first}!

Az Ön ${d.rooms ?? q.rooms.length} helyiségére az alábbi klímaberendezéseket ajánljuk:

--- Az Ön igényei ---
${quoteCriteriaText(d)}

${quoteRoomsText(q)}

${quoteSummaryText(q)}

Kérdése van? Hívjon minket: ${PHONE_DISPLAY}

Klima Plus Cell Kft. · Koptik Odó utca 20., 9500 Celldömölk
Ez az email automatikusan lett létrehozva az Ön ajánlatkérése alapján.`;
}

function notifyHtml(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  const telHref = (d.phone ?? "").replace(/[^\d+]/g, "");
  const when = new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
  const location = esc(d.city) || esc(d.zip) || "—";
  const surveyStatus =
    d.siteSurvey === "callback"
      ? `<p style="margin:0 0 18px;font-size:17px;"><strong>Visszahívást kér és érdekli ingyenes helyszíni felmérés:</strong> <a href="tel:${telHref}" style="color:#1f9fd6;text-decoration:none;font-weight:bold;">${esc(d.phone)}</a></p>`
      : d.siteSurvey === "information_only"
        ? `<p style="margin:0 0 18px;font-size:17px;"><strong style="color:#c2630f;">Egyelőre csak tájékozódik – nem kér visszahívást.</strong></p>`
        : d.source !== "ajanlatkero"
          ? `<p style="margin:0 0 18px;font-size:17px;"><strong>Hívd fel mielőbb:</strong> <a href="tel:${telHref}" style="color:#1f9fd6;text-decoration:none;font-weight:bold;">${esc(d.phone)}</a></p>`
          : "";
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#ffffff;">
<div style="max-width:560px;margin:0 auto;padding:28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222222;">
  <h1 style="margin:0 0 14px;font-size:19px;">Új jelentkezés – Klima Plus${d.source === "ajanlatkero" ? " (Ajánlatkérő)" : ""}</h1>
  ${surveyStatus}
  <p style="margin:0;">
    <strong>Név:</strong> ${esc(fullName)}<br>
    <strong>E-mail:</strong> <a href="mailto:${esc(d.email)}" style="color:#1f9fd6;text-decoration:none;">${esc(d.email)}</a><br>
    <strong>Telefonszám:</strong> <a href="tel:${telHref}" style="color:#1f9fd6;text-decoration:none;">${esc(d.phone) || "—"}</a><br>
    <strong>Település / ISZ:</strong> ${location}<br>
    <strong>Háztípus:</strong> ${esc(d.houseType) || "—"}<br>
    ${d.source === "ajanlatkero" && d.siteSurvey ? `<strong>Helyszíni felmérés:</strong> ${d.siteSurvey === "callback" ? "Igen, érdekli – visszahívást kér" : "Nem, egyelőre csak tájékozódik"}<br>` : ""}
    <strong>Marketing hozzájárulás:</strong> ${d.marketingConsent ? "igen" : "nem"}<br>
    <strong>Beérkezett:</strong> ${esc(when)}
  </p>
  ${d.source === "ajanlatkero" ? quoteCriteriaHtml(d, "🧮 Ajánlatkérő kalkulátor") : ""}
  ${internalQuoteHtml(d)}
</div>
</body></html>`;
}

function notifyText(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  const surveyStatus =
    d.siteSurvey === "callback"
      ? `Visszahívást kér és érdekli ingyenes helyszíni felmérés: ${d.phone ?? "—"}\n\n`
      : d.siteSurvey === "information_only"
        ? "Egyelőre csak tájékozódik – nem kér visszahívást.\n\n"
        : d.source !== "ajanlatkero"
          ? `Hívd fel mielőbb: ${d.phone ?? "—"}\n\n`
          : "";
  const calc =
    d.source === "ajanlatkero"
      ? `
--- Ajánlatkérő kalkulátor ---
${quoteCriteriaText(d)}`
      : "";
  return `Új jelentkezés – Klima Plus

${surveyStatus}Név: ${fullName}
E-mail: ${d.email ?? "—"}
Telefonszám: ${d.phone ?? "—"}
Település / ISZ: ${d.city ?? d.zip ?? "—"}
Háztípus: ${d.houseType ?? "—"}
${d.source === "ajanlatkero" && d.siteSurvey ? `Helyszíni felmérés: ${d.siteSurvey === "callback" ? "Igen, érdekli – visszahívást kér" : "Nem, egyelőre csak tájékozódik"}\n` : ""}Marketing hozzájárulás: ${d.marketingConsent ? "igen" : "nem"}${calc}${internalQuoteText(d)}`;
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

  if (
    d.source === "ajanlatkero" &&
    d.siteSurvey !== "callback" &&
    d.siteSurvey !== "information_only"
  ) {
    return NextResponse.json({ error: "Hiányzó helyszíni felmérés választás" }, { status: 400 });
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

  // 2) Visszaigazolás a leadnek (best-effort; a hibája nem blokkolja a fentit).
  // Ajánlatkérő kalkulátorból: a részletes, személyre szabott árajánlat megy.
  // Egyéb űrlapból: az általános "sikeres jelentkezés" visszaigazolás.
  const isQuote = d.source === "ajanlatkero";
  try {
    await resend.emails.send({
      from: FROM,
      to: d.email,
      subject: isQuote
        ? `Személyre szabott klíma ajánlat (${d.rooms ?? "?"} helyiség) – Klíma Plus`
        : "Sikeres jelentkezés – Klima Plus",
      html: isQuote ? quoteHtml(d) : confirmationHtml(d.firstName),
      text: isQuote ? quoteText(d) : confirmationText(d.firstName),
    });
  } catch (e) {
    console.error("[lead] confirmation send failed", e);
  }

  return NextResponse.json({ ok: true });
}
