import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FROM = process.env.LEAD_FROM_EMAIL || "Klima Plus <onboarding@resend.dev>";
const NOTIFY = (process.env.LEAD_NOTIFY_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function esc(s: unknown) {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));
}

const PHONE_DISPLAY = "+36 70 256 6448";
const PHONE_TEL = "+36702566448";

function confirmationHtml(firstName: string) {
  const name = esc(firstName);
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f0f0f0;">Köszönjük a jelentkezését! 24 órán belül telefonon keressük.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:6px 0 18px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:800;letter-spacing:2px;color:#1f9fd6;">KLIMA&nbsp;PLUS</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#16a34a;font-size:6px;line-height:6px;height:6px;">&nbsp;</td></tr>
            <tr><td align="center" style="padding:36px 36px 4px;font-family:Arial,Helvetica,sans-serif;">
              <div style="font-size:46px;line-height:1;">✅</div>
              <h1 style="font-size:24px;color:#16a34a;margin:14px 0 0;">Sikeres jelentkezés!</h1>
            </td></tr>
            <tr><td style="padding:18px 36px 0;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:16px;line-height:1.6;">
              <p style="margin:0 0 16px;font-weight:bold;">Kedves ${name}!</p>
              <p style="margin:0 0 16px;">Köszönjük a jelentkezését a klíma telepítés kapcsán! Megkaptuk az adatait, és kollégánk hamarosan keresi Önt.</p>
              <p style="margin:0;"><strong>24 órán belül telefonon felvesszük Önnel a kapcsolatot</strong>, hogy egyeztessük a részleteket.</p>
            </td></tr>
            <tr><td style="padding:22px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;">
                <tr><td align="center" style="padding:16px 20px;font-family:Arial,Helvetica,sans-serif;">
                  <div style="font-size:13px;color:#9a3412;margin-bottom:4px;">Nem szeretne várni? Hívjon most:</div>
                  <a href="tel:${PHONE_TEL}" style="font-size:22px;font-weight:bold;color:#ED8B3A;text-decoration:none;">${PHONE_DISPLAY}</a>
                </td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:24px 36px 34px;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:16px;line-height:1.6;">
              <p style="margin:0;">Üdvözlettel,<br><strong>Takács Tamás</strong><br><span style="color:#666;">Klima Plus Cell Kft.</span></p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:18px 24px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888;line-height:1.6;">
          Klima Plus Cell Kft. · Koptik Odó utca 20., 9500 Celldömölk · Adószám: 32621880-2-18<br>
          Ezt a visszaigazolást a klímatelepítési jelentkezése miatt küldtük.
        </td></tr>
      </table>
    </td></tr>
  </table>
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
  const row = (k: string, v: string) =>
    `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;">${k}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#111;font-size:15px;font-weight:600;">${v}</td>
    </tr>`;
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f0f0f0;">Új lead: ${esc(fullName)} – ${esc(d.phone)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
        <tr><td style="background:#dc2626;border-radius:14px 14px 0 0;padding:20px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
          <span style="font-size:22px;font-weight:800;color:#ffffff;">🔥 Új lead érkezett!</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:0 0 14px 14px;padding:26px 28px;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 0 22px;">
            <a href="tel:${telHref}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:18px;font-weight:bold;text-decoration:none;padding:14px 30px;border-radius:10px;">📞 Hívd fel MOST: ${esc(d.phone)}</a>
            <div style="font-size:13px;color:#dc2626;font-weight:bold;padding-top:10px;">⚡ A gyors hívás = a telepítés. Lehetőleg 5 percen belül!</div>
          </td></tr></table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;">
            ${row("Név", esc(fullName))}
            ${row("Telefon", `<a href="tel:${telHref}" style="color:#2563eb;text-decoration:none;">${esc(d.phone)}</a>`)}
            ${row("E-mail", `<a href="mailto:${esc(d.email)}" style="color:#2563eb;text-decoration:none;">${esc(d.email)}</a>`)}
            ${row("Háztípus", esc(d.houseType) || "—")}
            ${row("Irányítószám", esc(d.zip) || "—")}
            ${row("Marketing hozzájárulás", d.marketingConsent ? "✅ IGEN" : "— nem")}
            ${row("Beérkezett", esc(when))}
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function notifyText(d: Lead) {
  const fullName = `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim() || "—";
  return `🔥 ÚJ LEAD – Klima Plus

Név: ${fullName}
Telefon: ${d.phone ?? "—"}
E-mail: ${d.email ?? "—"}
Háztípus: ${d.houseType ?? "—"}
Irányítószám: ${d.zip ?? "—"}
Marketing hozzájárulás: ${d.marketingConsent ? "IGEN" : "nem"}

⚡ Hívd fel minél hamarabb (lehetőleg 5 percen belül)!`;
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
        subject: `Új lead: ${d.firstName} ${d.lastName ?? ""} – ${d.phone}`,
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
      subject: "Sikeres jelentkezés! :)",
      html: confirmationHtml(d.firstName),
      text: confirmationText(d.firstName),
    });
  } catch (e) {
    console.error("[lead] confirmation send failed", e);
  }

  return NextResponse.json({ ok: true });
}
