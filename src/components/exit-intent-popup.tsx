"use client";

import { useEffect, useState } from "react";

/**
 * Desktop exit-intent popup: fires once per session when the cursor leaves the
 * top of the viewport (toward the browser chrome / close button). Mobile has no
 * cursor, so this is a desktop-only nudge by design.
 */
export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("exit-intent-shown")) return;
    } catch {}

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        try {
          sessionStorage.setItem("exit-intent-shown", "1");
        } catch {}
        document.removeEventListener("mouseout", onLeave);
      }
    };

    // Arm after a short delay so stray pointer moves on load don't trigger it.
    const t = setTimeout(() => document.addEventListener("mouseout", onLeave), 3000);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl rounded-md border-[6px] border-[#c9d2dc] bg-[#e05650] px-8 py-14 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Bezárás"
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#3c3c3c] text-base font-bold text-white shadow-md ring-2 ring-white transition hover:bg-black"
        >
          ✕
        </button>
        <p className="text-center text-3xl font-extrabold leading-tight text-black md:text-4xl">
          !!VÁRJON!!
          <br />
          NE maradjon le akciónkról!
        </p>
      </div>
    </div>
  );
}
