"use client";

import { useEffect, useState } from "react";

export const CONSENT_KEY = "klima-cookie-consent";
export type Consent = "all" | "essential";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false); // drives the slide-in animation

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {}
    if (process.env.NODE_ENV !== 'development' && (stored === "all" || stored === "essential")) return;
    // In development we always show the banner so you can easily test the popup + pixel consent.
    // Defer into a frame so we don't call setState synchronously in the effect
    // body; the second frame flips `shown` to trigger the slide-in transition.
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      requestAnimationFrame(() => setShown(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const choose = (value: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: value }));
    setShown(false);
    setTimeout(() => setVisible(false), 250);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Sütikezelési tájékoztató"
      className={`fixed bottom-4 right-4 z-[999] max-w-[min(440px,calc(100vw-2rem))] rounded-xl bg-[#fbecc8] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] ring-1 ring-black/5 transition-all duration-300 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <p className="text-[15px] leading-relaxed text-neutral-800">
        Oldalunk működéséhez sütiket használunk. A marketing sütik csak az Ön hozzájárulásával működnek.{" "}
        <a href="/sutik" className="font-bold underline underline-offset-2 hover:text-black">
          Részletek
        </a>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => choose("essential")}
          className="flex-1 rounded-lg bg-black px-3 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Csak a kötelezőket
        </button>
        <button
          onClick={() => choose("all")}
          className="flex-1 rounded-lg bg-black px-3 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Elfogadom
        </button>
      </div>
    </div>
  );
}
