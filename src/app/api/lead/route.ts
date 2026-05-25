import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
};

function notifyHtml(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  const telHref = (d.phone ?? "").replace(/[^\d+]/g, "");
  const when = new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#ffffff;">
<div style="max-width:560px;margin:0 auto;padding:28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222222;">
  <h1 style="margin:0 0 14px;font-size:19px;">Új jelentkezés – Klima Plus</h1>
  <p style="margin:0 0 18px;font-size:17px;"><strong>Hívd fel mielőbb:</strong> <a href="tel:${telHref}" style="color:#1f9fd6;text-decoration:none;font-weight:bold;">${esc(d.phone)}</a></p>
  <p style="margin:0;">
    <strong>Név:</strong> ${esc(fullName)}<br>
    <strong>E-mail:</strong> <a href="mailto:${esc(d.email)}" style="color:#1f9fd6;text-decoration:none;">${esc(d.email)}</a><br>
    <strong>Háztípus:</strong> ${esc(d.houseType) || "—"}<br>
    <strong>Irányítószám:</strong> ${esc(d.zip) || "—"}<br>
    <strong>Marketing hozzájárulás:</strong> ${d.marketingConsent ? "igen" : "nem"}<br>
    <strong>Beérkezett:</strong> ${esc(when)}
  </p>
</div>
</body></html>`;
}

function notifyText(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  return `Új jelentkezés – Klima Plus

Hívd fel mielőbb: ${d.phone ?? "—"}

Név: ${fullName}
E-mail: ${d.email ?? "—"}
Háztípus: ${d.houseType ?? "—"}
Irányítószám: ${d.zip ?? "—"}
Marketing hozzájárulás: ${d.marketingConsent ? "igen" : "nem"}`;
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
