"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import ExitIntentPopup from "@/components/exit-intent-popup";
import GoogleReviews from "@/components/google-reviews";
import Testimonials from "@/components/testimonials";
import { Phone, User, FileText } from "lucide-react";

const PIXEL_ID = "1452932669308796";
const HOUSE_TYPES = ["Családi", "Társas", "Egyéb"];

// Irányítószámok kb. 10 km-re Celldömölktől → INGYENES helyszíni felmérésre jogosult.
// ⚠️ Best-effort lista — ELLENŐRIZD/igazítsd a tényleges szolgáltatási területhez!
const ELIGIBLE_ZIPS = new Set([
  "9500", // Celldömölk
  "9509", // Celldömölk – Alsóság
  "9511", // Kemenesmihályfa
  "9512", // Ostffyasszonyfa
  "9513", // Csönge
  "9521", // Kemenesszentpéter
  "9522", // Kemenesmagasi
  "9523", // Vönöck
  "9531", // Mersevát
  "9542", // Boba
  "9551", // Mesteri
  "9553", // Köcsk
  "9554", // Egyházashetye
  "9555", // Kissomlyó
  "9561", // Nagysimonyi
]);

type FormData = {
  houseType: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  marketingConsent: boolean;
  zip: string;
};

export default function UrlapPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    houseType: "", lastName: "", firstName: "", email: "", phone: "", marketingConsent: false, zip: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: keyof FormData, v: string | boolean) => setData((d) => ({ ...d, [k]: v }));

  // Grant the Meta pixel consent if the visitor accepts marketing cookies
  // (the pixel boots in "revoke" state, so nothing fires until then).
  useEffect(() => {
    const grant = () => (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("consent", "grant");
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === "all") grant();
    };
    window.addEventListener("cookie-consent-changed", onChange);
    return () => window.removeEventListener("cookie-consent-changed", onChange);
  }, []);

  // Dark page root so elastic overscroll past the photo doesn't flash white.
  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    html.style.backgroundColor = "#2b2b2b";
    document.body.style.backgroundColor = "#2b2b2b";
    return () => {
      html.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);

  const validateStep = (): string => {
    if (step === 0 && !data.houseType) return "Kérlek válassz egy lehetőséget.";
    if (step === 1 && !data.firstName.trim()) return "A keresztnév megadása kötelező.";
    if (step === 2) {
      if (!/^\S+@\S+\.\S+$/.test(data.email)) return "Adj meg egy érvényes e-mail címet.";
      if (data.phone.trim().length < 6) return "Adj meg egy érvényes telefonszámot.";
    }
    return "";
  };

  const next = async () => {
    const err = validateStep();
    if (err) return setError(err);
    setError("");
    if (step < 3) return setStep(step + 1);

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead");
      setDone(true);
    } catch {
      setError("Hiba történt a küldés során. Kérlek próbáld újra.");
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => {
    setError("");
    if (step > 0) setStep(step - 1);
  };

  const inputCls =
    "mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30";

  // Free on-site assessment eligibility based on the entered zip (≈10 km of Celldömölk)
  const eligible = ELIGIBLE_ZIPS.has(data.zip.trim());

  return (
    <main className="relative isolate flex min-h-screen flex-col font-body">
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        var c=null;try{c=localStorage.getItem('klima-cookie-consent')}catch(e){}
        fbq('consent', c==='all' ? 'grant' : 'revoke');
        fbq('init','${PIXEL_ID}');fbq('track','PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>

      {/* Optimized background photo (Next serves WebP/AVIF, sized + priority-loaded) */}
      <Image
        src="/urlap-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden />

      <ContactBar className="hidden md:flex" />

      <div className="flex flex-1 items-center justify-center px-4 py-6 md:py-10">
        <div className="w-full max-w-2xl rounded-3xl bg-[#3c3c3c]/85 px-7 py-10 shadow-xl backdrop-blur-sm md:px-14 md:py-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/klima-plus-white.svg" alt="Klima Plus" className="mx-auto block h-auto w-[80%] max-w-[460px]" />

          <h1 className="mt-6 text-center text-2xl font-semibold leading-snug text-[#ED8B3A] md:mt-7 md:text-3xl">
            Töltse ki űrlapunkat, és tudja meg,<br />jogosult-e ingyenes felmérésre!
          </h1>

          <div className="mx-auto my-6 h-px w-[440px] max-w-full bg-white/20" aria-hidden="true" />

          <ul className="space-y-3 text-center text-xl text-white md:text-2xl">
            <li>✅ Rejtett költségek nélkül</li>
            <li>✅ Nem kell utánunk takarítani</li>
            <li>✅ Akár 10 év garancia</li>
          </ul>

          <div className="mx-auto my-6 h-px w-[440px] max-w-full bg-white/20" aria-hidden="true" />

          <p className="text-center text-lg leading-relaxed text-white/90 md:text-xl">
            <span className="font-black text-red-500">FIGYELEM!</span><br />
            A nyár közeledtével gyorsan fogynak szabad időpontjaink.<br />
            Ha ezt látja, még van szabad hely.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-lg md:mt-10">
            {done ? (
              <div className="px-6 py-10 text-center">
                {eligible ? (
                  <>
                    <h2 className="text-2xl font-bold text-green-600">🎉 Gratulálunk!</h2>
                    <p className="mt-4 text-neutral-700">
                      Az Ön irányítószáma a szolgáltatási területünkön belül van, így{" "}
                      <strong>jogosult egy INGYENES helyszíni felmérésre!</strong><br />
                      <strong>24 órán belül</strong> felhívjuk az időpont egyeztetéséhez.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-green-600">Sikeres jelentkezés! :)</h2>
                    <p className="mt-4 text-neutral-700">
                      Köszönjük a jelentkezését!<br />
                      <strong>24 órán belül</strong> felhívjuk, és tájékoztatjuk az ingyenes felmérés lehetőségéről.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="min-h-[210px] px-6 py-7">
                  {step === 0 && (
                    <fieldset>
                      <legend className="mb-4 text-lg font-bold text-neutral-900">Milyen típusú házról van szó?</legend>
                      <div className="space-y-3">
                        {HOUSE_TYPES.map((t) => (
                          <label key={t} className="flex cursor-pointer items-center gap-3 text-lg font-semibold text-neutral-900">
                            <input type="radio" name="houseType" checked={data.houseType === t} onChange={() => update("houseType", t)} className="h-5 w-5 accent-[#2563eb]" />
                            {t}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="mb-4 font-bold text-neutral-900">Utolsó lépések…</h2>
                      <label className="block font-bold text-neutral-900">
                        Családnév
                        <input value={data.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Családnév" className={inputCls} />
                      </label>
                      <label className="mt-4 block font-bold text-neutral-900">
                        Keresztnév *
                        <input value={data.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Keresztnév" className={inputCls} />
                      </label>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="mb-4 font-bold text-neutral-900">Utolsó lépések…</h2>
                      <label className="block font-bold text-neutral-900">
                        E-mail *
                        <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="E-mail" className={inputCls} />
                      </label>
                      <label className="mt-4 block font-bold text-neutral-900">
                        Telefonszám *
                        <input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Telefon" className={inputCls} />
                      </label>
                      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm font-semibold text-neutral-900">
                        <input type="checkbox" checked={data.marketingConsent} onChange={(e) => update("marketingConsent", e.target.checked)} className="mt-1 h-4 w-4 accent-[#2563eb]" />
                        Nem szeretnék lemaradni az akciókról – kérek email értesítéseket. (Bármikor visszavonható)
                      </label>
                      <p className="mt-4 text-sm text-neutral-600">
                        Az űrlap kitöltésével tudomásul veszem az{" "}
                        <a href="/adatkezeles" className="text-[#2563eb] underline">Adatkezelési Tájékoztatót.</a>
                      </p>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <label className="block font-bold text-neutral-900">
                        Irányítószám <span className="font-normal text-neutral-500">(Utolsó lépés)</span>
                        <input inputMode="numeric" value={data.zip} onChange={(e) => update("zip", e.target.value)} placeholder="9500" className={inputCls} />
                      </label>
                    </div>
                  )}

                  {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
                </div>

                <div className="flex items-stretch bg-[#2563eb] text-white">
                  {step > 0 && (
                    <button onClick={back} className="flex items-center gap-2 bg-[#1e50c7] px-5 py-4 font-semibold transition hover:bg-[#1a47b0]">
                      ← VISSZA
                    </button>
                  )}
                  <div className="flex flex-1 items-center justify-center text-sm text-white/80">{step + 1} / 4</div>
                  <button onClick={next} disabled={submitting} className={`flex items-center gap-2 px-6 py-4 font-semibold transition disabled:opacity-70 ${step === 3 ? "bg-green-500 hover:bg-green-600" : "bg-[#1e50c7] hover:bg-[#1a47b0]"}`}>
                    {step === 3 ? (submitting ? "Küldés…" : "KÉSZ!") : "TOVÁBB →"}
                  </button>
                </div>
              </>
            )}
          </div>

          <GoogleReviews />

          <Testimonials />

          <p className="mt-6 text-center text-sm font-medium italic text-white/70">
            <a href="/adatkezeles" className="hover:underline">Adatkezelési tájékoztató</a> •{" "}
            <a href="/sutik" className="hover:underline">Sütikezelési tájékoztató</a>
          </p>
        </div>
      </div>

      <ContactBar className="flex md:hidden" />
      <ExitIntentPopup />
    </main>
  );
}

function ContactBar({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} w-full flex-col items-center justify-center gap-3 bg-[#2b2b2b] px-4 py-3 text-center text-sm font-medium text-white md:flex-row md:gap-12 md:text-base`}>
      <a href="tel:+36702566448" className="flex items-center gap-2"><Phone className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2.5} /> +36 70 256 6448</a>
      <span className="flex items-center gap-2"><User className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2.5} /> Klima Plus Cell Kft.</span>
      <span className="flex items-center gap-2"><FileText className="h-[1.15em] w-[1.15em] shrink-0" strokeWidth={2.5} /> Adószám: 32621880-2-18</span>
    </div>
  );
}
