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

function confirmationHtml(firstName: string) {
  return `
  <div style="background:#f0f0f0;padding:24px;font-family:Arial,Helvetica,sans-serif">
    <div style="text-align:center;margin-bottom:16px">
      <span style="color:#1f9fd6;font-size:30px;font-weight:800;letter-spacing:2px">KLIMA PLUS</span>
    </div>
    <div style="background:#fff;border-radius:16px;padding:32px;max-width:520px;margin:0 auto">
      <h1 style="text-align:center;color:#16a34a;font-size:24px;margin:0 0 24px">
        <span style="background:#fde68a;padding:0 4px">Sikeres</span> jelentkezés! :)
      </h1>
      <p style="font-weight:bold;color:#111;margin:0 0 16px">Kedves ${esc(firstName)}!</p>
      <p style="color:#111;margin:0 0 16px">Köszönjük a jelentkezését a klíma telepítés kapcsán!</p>
      <p style="color:#111;margin:0 0 24px"><strong>24 órán belül hívni fogjuk.</strong></p>
      <p style="color:#111;margin:0">Üdvözlettel,<br/>Takács Tamás</p>
    </div>
    <p style="text-align:center;color:#666;font-size:12px;margin-top:16px">
      Nem szeretne több emailt kapni tőlünk? <a href="#" style="color:#2563eb">Leiratkozás</a>.
    </p>
  </div>`;
}

type Lead = {
  houseType?: string; lastName?: string; firstName?: string;
  email?: string; phone?: string; marketingConsent?: boolean; zip?: string;
};

function notifyHtml(d: Lead) {
  const row = (k: string, v: unknown) =>
    `<tr><td style="padding:6px 12px;border:1px solid #eee"><b>${k}</b></td><td style="padding:6px 12px;border:1px solid #eee">${esc(v)}</td></tr>`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif">
    <h2 style="color:#111">🔥 Új lead – Klima Plus</h2>
    <table style="border-collapse:collapse">
      ${row("Név", `${d.lastName ?? ""} ${d.firstName ?? ""}`.trim())}
      ${row("Telefon", d.phone)}
      ${row("E-mail", d.email)}
      ${row("Háztípus", d.houseType)}
      ${row("Irányítószám", d.zip)}
      ${row("Marketing hozzájárulás", d.marketingConsent ? "IGEN" : "nem")}
    </table>
    <p style="font-size:16px;color:#16a34a"><b>⚡ Hívd fel minél hamarabb!</b></p>
  </div>`;
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

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // 1) confirmation to the lead
    await resend.emails.send({
      from: FROM,
      to: d.email,
      subject: "Sikeres jelentkezés! :)",
      html: confirmationHtml(d.firstName),
    });

    // 2) instant internal notification to Ruben + client (speed-to-lead)
    if (NOTIFY.length) {
      await resend.emails.send({
        from: FROM,
        to: NOTIFY,
        replyTo: d.email,
        subject: `Új lead: ${d.firstName} ${d.lastName ?? ""} – ${d.phone}`,
        html: notifyHtml(d),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[lead] send failed", e);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}
