"use client";

import { useMemo, useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { recommend } from "@/lib/klimaPrices";
import {
  ArrowLeft,
  ArrowRight,
  DoorOpen,
  Home,
  Building,
  Building2,
  AlarmClock,
  CalendarClock,
  CalendarDays,
  Search,
  HelpCircle,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Mail,
  Loader2,
  Check,
} from "lucide-react";

const PIXEL_ID = "1452932669308796";
// Cloudflare Turnstile – csak akkor jelenik meg, ha be van állítva a site key.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

const ROOM_OPTIONS = [
  { n: 1, title: "1 helyiség", sub: "Egy szoba", Icon: DoorOpen },
  { n: 2, title: "2 helyiség", sub: "Pl. nappali + háló", Icon: Home },
  { n: 3, title: "3 helyiség", sub: "Több szobás lakás", Icon: Building },
  { n: 4, title: "4 helyiség", sub: "Nagy ház/iroda", Icon: Building2 },
];

const SIZE_OPTIONS = [
  { label: "15-25 m²", desc: "Hálószoba, kis iroda" },
  { label: "25-35 m²", desc: "Átlagos nappali" },
  { label: "35-50 m²", desc: "Nagy nappali, amerikai konyha" },
  { label: "50+ m²", desc: "Extra nagy légtér" },
];

const PRICE_CATEGORIES = [
  { label: "Olcsó", min: 180000, max: 250000 },
  { label: "Közép", min: 250000, max: 350000 },
  { label: "Prémium", min: 350000, max: 500000 },
  { label: "Luxus", min: 500000, max: 900000 },
];
const PRICE_FLOOR = 180000;

type Brand = { label: string; logo?: string; Icon?: React.ComponentType<{ className?: string }>; exclusive?: boolean };
const BRANDS: Brand[] = [
  { label: "Gree", logo: "/brands/gree.svg" },
  { label: "Syen", logo: "/brands/syen.png" },
  { label: "Aux" }, // nincs még logó – szöveges jelvény
  { label: "Nem tudom", Icon: HelpCircle, exclusive: true },
];

const URGENCY = [
  { label: "Nagyon sürgős", sub: "1 héten belül", Icon: AlarmClock },
  { label: "Hamarosan", sub: "2-4 héten belül", Icon: CalendarClock },
  { label: "Tervezem", sub: "1-2 hónapon belül", Icon: CalendarDays },
  { label: "Tájékozódom", sub: "Nincs időpont", Icon: Search },
];

const huf = (n: number) => n.toLocaleString("hu-HU") + " Ft";

type State = {
  rooms: number | null;
  sizes: (string | null)[];
  priceCategory: string | null;
  priceMin: number;
  priceMax: number;
  brands: string[];
  urgency: string | null;
  name: string;
  phone: string;
  zip: string;
  email: string;
  marketing: boolean;
};

export default function AjanlatkeroPage() {
  const [s, setS] = useState<State>({
    rooms: null,
    sizes: [],
    priceCategory: null,
    priceMin: PRICE_FLOOR,
    priceMax: 400000,
    brands: [],
    urgency: null,
    name: "",
    phone: "",
    zip: "",
    email: "",
    marketing: false,
  });
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));

  // Dinamikus lépéslista: a helyiségek száma szerint nő.
  const steps = useMemo<string[]>(() => {
    const sizeSteps = Array.from({ length: s.rooms ?? 0 }, (_, i) => `size-${i}`);
    return ["rooms", ...sizeSteps, "price", "brand", "urgency", "contact"];
  }, [s.rooms]);

  const total = steps.length;
  const stepKey = steps[Math.min(current, total - 1)];
  const progress = total > 1 ? Math.round((current / (total - 1)) * 100) : 0;

  // Sötét háttér, hogy a túlgörgetés ne villantson fehéret.
  useEffect(() => {
    const html = document.documentElement;
    const prevH = html.style.backgroundColor;
    const prevB = document.body.style.backgroundColor;
    html.style.backgroundColor = "#0a0a0a";
    document.body.style.backgroundColor = "#0a0a0a";
    return () => {
      html.style.backgroundColor = prevH;
      document.body.style.backgroundColor = prevB;
    };
  }, []);

  const goNext = (delay = 0) => {
    setDir(1);
    setError("");
    const advance = () => setCurrent((c) => Math.min(c + 1, total - 1));
    if (delay) setTimeout(advance, delay);
    else advance();
  };
  const goBack = () => {
    setDir(-1);
    setError("");
    setCurrent((c) => Math.max(c - 1, 0));
  };
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const selectRooms = (n: number) => {
    setS((p) => {
      const sizes = Array.from({ length: n }, (_, i) => p.sizes[i] ?? null);
      return { ...p, rooms: n, sizes };
    });
    goNext(220);
    scrollTop();
  };

  const selectSize = (roomIdx: number, label: string) => {
    setS((p) => {
      const sizes = [...p.sizes];
      sizes[roomIdx] = label;
      return { ...p, sizes };
    });
    goNext(220);
    scrollTop();
  };

  const selectPriceCategory = (c: (typeof PRICE_CATEGORIES)[number]) => {
    setS((p) => ({ ...p, priceCategory: c.label, priceMin: c.min, priceMax: c.max }));
    goNext(220);
    scrollTop();
  };

  const toggleBrand = (label: string) =>
    setS((p) => {
      if (p.brands.includes(label)) return { ...p, brands: p.brands.filter((b) => b !== label) };
      const isExclusive = !!BRANDS.find((b) => b.label === label)?.exclusive;
      // "Nem tudom": exkluzív – csak ez maradjon kiválasztva
      if (isExclusive) return { ...p, brands: [label] };
      // Valódi márka: az exkluzív opciókat elvetjük, és max 3 márka jelölhető
      const brandsOnly = p.brands.filter((b) => !BRANDS.find((x) => x.label === b)?.exclusive);
      if (brandsOnly.length >= 3) return p;
      return { ...p, brands: [...brandsOnly, label] };
    });

  const selectUrgency = (label: string) => {
    set("urgency", label);
    goNext(220);
    scrollTop();
  };

  const contactValid =
    s.name.trim().length > 1 &&
    s.phone.replace(/\D/g, "").length >= 7 &&
    /^\S+@\S+\.\S+$/.test(s.email) &&
    /^\d{4}$/.test(s.zip.trim()) &&
    (!TURNSTILE_SITE_KEY || turnstileToken);

  const submit = async () => {
    if (!contactValid) {
      setError("Kérjük töltse ki az összes kötelező mezőt.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const eventId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const rooms = s.rooms ?? 1;
      const roomSizes = s.sizes.slice(0, rooms).map((sz, i) => `${i + 1}. helyiség: ${sz ?? "n/a"}`);

      // Belső (szerelői) ajánlás: helyiségenként a méret + kategória + márka
      // szerinti konkrét modell + ár. A látogató NEM látja, csak az emailbe kerül.
      const rec = recommend(s.sizes.slice(0, rooms), s.priceCategory ?? "", s.brands);

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: s.name.trim(),
          email: s.email.trim(),
          phone: s.phone.trim(),
          zip: s.zip.trim(),
          consent: true,
          marketingConsent: s.marketing,
          source: "ajanlatkero",
          rooms,
          roomSizes,
          sizes: s.sizes.slice(0, rooms), // nyers méret-címkék a szerveroldali árajánlathoz
          priceRange: `${huf(s.priceMin)} – ${huf(s.priceMax)}`,
          priceCategory: s.priceCategory ?? "Egyéni",
          brands: s.brands.length ? s.brands : ["Mindegy"],
          urgency: s.urgency ?? "Nincs megadva",
          recommended: rec.rooms.map((r, i) => ({ room: i + 1, size: r.size, picks: r.picks })),
          recTotals: rec.totals,
          turnstileToken,
          eventId,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead", {}, { eventID: eventId });
      setDone(true);
      scrollTop();
    } catch {
      setError("Hiba történt a küldés során. Kérjük próbálja újra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white font-body">
      {/* Meta pixel */}
      <Script id="meta-pixel-kalk" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        var c=null;try{c=localStorage.getItem('klima-cookie-consent')}catch(e){}
        fbq('consent', c==='all' ? 'grant' : 'revoke');
        fbq('init','${PIXEL_ID}');fbq('track','PageView');
      `}</Script>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}

      {/* Háttér fények – diszkrét kék, az arculathoz illően. Mobilon kikapcsolva: a nagy blur a telefon GPU-t megfekteti. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden sm:block">
        <div className="absolute -left-40 top-10 h-[420px] w-[520px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-[-160px] top-1/3 h-[460px] w-[520px] rounded-full bg-blue-500/[0.07] blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[460px] rounded-full bg-sky-700/[0.06] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        {/* Fejléc: logó mindig középen (abszolút), a vissza gomb balra. Mobilon csak nyíl, sm-től "Vissza" is. */}
        <div className="relative flex min-h-[44px] items-center justify-center">
          <button
            onClick={goBack}
            disabled={current === 0}
            aria-hidden={current === 0}
            aria-label="Vissza"
            className={`absolute left-0 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white/70 transition hover:border-white/25 hover:text-white ${
              current === 0 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Vissza</span>
          </button>
          <img src="/logo-white.svg" alt="Klíma Plus" className="h-4 w-auto opacity-90" />
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={stepKey + (done ? "-done" : "")}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-6 flex flex-1 flex-col"
          >
            {done ? (
              <ThankYou name={s.name} email={s.email} />
            ) : (
              <>
                {/* Progress fejléc minden lépésnél */}
                <ProgressHeader step={current + 1} total={total} progress={progress} />

                <div className="mt-6 flex flex-col max-sm:flex-1">
                  {stepKey === "rooms" && (
                    <Step title="Hány helyiséget szeretne klimatizálni?">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-sm:flex max-sm:flex-1 max-sm:flex-col">
                        {ROOM_OPTIONS.map((o) => (
                          <OptionCard
                            key={o.n}
                            selected={s.rooms === o.n}
                            onClick={() => selectRooms(o.n)}
                            icon={<o.Icon className="h-6 w-6 text-blue-400" />}
                            title={o.title}
                            sub={o.sub}
                          />
                        ))}
                      </div>
                    </Step>
                  )}

                  {stepKey?.startsWith("size-") &&
                    (() => {
                      const roomIdx = Number(stepKey.split("-")[1]);
                      return (
                        <Step
                          title="Mekkora ez a helyiség?"
                          subtitle={(s.rooms ?? 1) > 1 ? `${roomIdx + 1}. helyiség` : undefined}
                        >
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-sm:flex max-sm:flex-1 max-sm:flex-col">
                            {SIZE_OPTIONS.map((o) => (
                              <OptionCard
                                key={o.label}
                                selected={s.sizes[roomIdx] === o.label}
                                onClick={() => selectSize(roomIdx, o.label)}
                                title={o.label}
                                sub={o.desc}
                              />
                            ))}
                          </div>
                        </Step>
                      );
                    })()}

                  {stepKey === "price" && (
                    <Step title="Milyen ár-kategóriában szeretné?">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {PRICE_CATEGORIES.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => selectPriceCategory(c)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              s.priceCategory === c.label
                                ? "border-blue-500/70 bg-blue-500/10"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20"
                            }`}
                          >
                            <span className="text-lg font-semibold">{c.label}</span>
                            <div className="mt-2 text-sm font-medium text-blue-200/90">
                              {huf(c.min)} – {huf(c.max)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </Step>
                  )}

                  {stepKey === "brand" &&
                    (() => {
                      const brandCount = s.brands.filter(
                        (x) => !BRANDS.find((y) => y.label === x)?.exclusive,
                      ).length;
                      return (
                        <Step title="Van márka preferenciája?" subtitle="Válasszon max. 3 márkát, vagy hagyja üresen ha mindegy">
                          <div className="space-y-3">
                            {BRANDS.map((b) => {
                              const selected = s.brands.includes(b.label);
                              const disabled = !selected && !b.exclusive && brandCount >= 3;
                              const Icon = b.Icon;
                              return (
                                <button
                                  key={b.label}
                                  onClick={() => toggleBrand(b.label)}
                                  disabled={disabled}
                                  className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                                    selected
                                      ? "border-blue-500/70 bg-blue-500/10"
                                      : disabled
                                        ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-40"
                                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                                  }`}
                                >
                                  {b.logo ? (
                                    <span className="grid h-10 w-20 shrink-0 place-items-center rounded-lg bg-white p-1.5">
                                      <img src={b.logo} alt={b.label} className="max-h-full max-w-full object-contain" />
                                    </span>
                                  ) : Icon ? (
                                    <span className="grid h-10 w-20 shrink-0 place-items-center rounded-lg bg-white/[0.04]">
                                      <Icon className="h-5 w-5 text-blue-400" />
                                    </span>
                                  ) : (
                                    <span className="grid h-10 w-20 shrink-0 place-items-center rounded-lg bg-white text-base font-extrabold tracking-wide text-neutral-900">
                                      {b.label.toUpperCase()}
                                    </span>
                                  )}
                                  <span className="flex-1 text-lg font-semibold">{b.label}</span>
                                  {selected && (
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-white">
                                      <Check className="h-4 w-4" />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <PrimaryButton onClick={() => goNext()}>
                            {brandCount
                              ? `Tovább (${brandCount} márka)`
                              : s.brands.length
                                ? "Tovább"
                                : "Mindegy - összes márka"}
                            <ArrowRight className="h-5 w-5" />
                          </PrimaryButton>
                        </Step>
                      );
                    })()}

                  {stepKey === "urgency" && (
                    <Step title="Mennyire sürgős a telepítés?" subtitle="Segít a megfelelő időpont egyeztetésében">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-sm:flex max-sm:flex-1 max-sm:flex-col">
                        {URGENCY.map((o) => (
                          <OptionCard
                            key={o.label}
                            selected={s.urgency === o.label}
                            onClick={() => selectUrgency(o.label)}
                            icon={<o.Icon className="h-6 w-6 text-blue-400" />}
                            title={o.label}
                            sub={o.sub}
                          />
                        ))}
                      </div>
                    </Step>
                  )}

                  {stepKey === "contact" && (
                    <Step title="Utolsó lépés" subtitle="Adja meg elérhetőségét és küldjük az ajánlatot.">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Név *" icon={<User className="h-4 w-4" />}>
                          <input
                            value={s.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Teljes név"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Telefonszám *" icon={<Phone className="h-4 w-4" />}>
                          <input
                            type="tel"
                            value={s.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="+36 30 123 4567"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Irányítószám *" icon={<MapPin className="h-4 w-4" />}>
                          <input
                            type="tel"
                            maxLength={4}
                            value={s.zip}
                            onChange={(e) => set("zip", e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="8200"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Email cím *" icon={<Mail className="h-4 w-4" />}>
                          <input
                            type="email"
                            value={s.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="pelda@gmail.com"
                            className={inputCls}
                          />
                        </Field>
                      </div>

                      <label
                        className={`mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition ${
                          s.marketing ? "border-blue-500/60 bg-blue-500/5" : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={s.marketing}
                          onChange={(e) => set("marketing", e.target.checked)}
                          className="mt-0.5 h-5 w-5 accent-blue-600"
                        />
                        <span className="font-medium text-white/85">
                          Nem szeretnék lemaradni az akciókról – kérek email értesítéseket.{" "}
                          <span className="font-normal text-white/55">(Bármikor visszavonható)</span>
                        </span>
                      </label>

                      <p className="mt-3 text-sm text-white/45">
                        Az űrlap kitöltésével tudomásul veszem az{" "}
                        <a href="/adatkezeles" target="_blank" className="text-blue-400 underline">
                          Adatkezelési Tájékoztatót.
                        </a>
                      </p>

                      {TURNSTILE_SITE_KEY && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
                            <ShieldCheck className="h-4 w-4" /> Biztonsági ellenőrzés
                          </div>
                          <div
                            className="cf-turnstile"
                            data-sitekey={TURNSTILE_SITE_KEY}
                            data-theme="dark"
                            data-callback="onTurnstileKalk"
                          />
                          <Script id="turnstile-cb">{`window.onTurnstileKalk=function(t){window.__kalkTurnstile=t;document.dispatchEvent(new CustomEvent('turnstile-kalk',{detail:t}))}`}</Script>
                          <TurnstileListener onToken={setTurnstileToken} />
                        </div>
                      )}

                      {error && <p className="mt-4 text-sm font-medium text-red-400">{error}</p>}

                      <PrimaryButton onClick={submit} disabled={submitting || !contactValid} className="text-xl">
                        {submitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Küldés…
                          </>
                        ) : (
                          "Ajánlat kérése emailben"
                        )}
                      </PrimaryButton>
                    </Step>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-blue-500/60 focus:bg-white/[0.06]";

function ProgressHeader({ step, total, progress }: { step: number; total: number; progress: number }) {
  return (
    <div className="pt-2">
      <div className="mb-2 flex text-sm">
        <span className="text-white/50">
          {step} / {total} lépés
        </span>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#60a5fa] to-[#2563eb] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function Step({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-white/[0.06] bg-white/[0.015] p-5 max-sm:flex-1 sm:p-7">
      <div className="flex items-center gap-3">
        {badge != null && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-400">
            {badge}
          </span>
        )}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {subtitle && <p className="mt-1.5 text-white/45">{subtitle}</p>}
      <div className="mt-5 flex flex-col max-sm:flex-1">{children}</div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  icon,
  title,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  title: string;
  sub?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition max-sm:flex-1 ${
        selected ? "border-blue-500/70 bg-blue-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"
      }`}
    >
      {icon && <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10">{icon}</span>}
      <span className="min-w-0">
        <span className="block text-lg font-semibold">{title}</span>
        {sub && <span className="block text-sm text-white/45">{sub}</span>}
      </span>
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-[#60a5fa] via-[#2563eb] to-[#1e40af] px-6 py-4 text-lg font-bold text-white shadow-[0_4px_20px_rgba(0,123,255,0.45)] transition hover:shadow-[0_8px_30px_rgba(0,123,255,0.7)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-white/60">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>
        <div className="[&>input]:pl-10">{children}</div>
      </div>
    </label>
  );
}

function ThankYou({ name, email }: { name: string; email: string }) {
  const first = name.trim().split(/\s+/).slice(-1)[0] || "";
  return (
    <div className="flex flex-1 flex-col items-center pt-16 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full border border-emerald-400/25 bg-emerald-500/10">
        <Check className="h-10 w-10 text-emerald-400" />
      </div>
      <h1 className="mt-7 text-3xl font-extrabold sm:text-4xl">
        Ajánlatát elküldtük{first ? `, ${first}` : ""}!
      </h1>
      <p className="mt-4 max-w-md text-lg text-white/55">
        A részletes, személyre szabott árajánlatot elküldtük ide:
        {email ? (
          <>
            {" "}
            <span className="font-semibold text-white/85">{email}</span>
          </>
        ) : (
          " a megadott email címre"
        )}
        . Ha nem találja, nézze meg a Spam mappát is.
      </p>
      <a
        href="tel:+36702566448"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-white/80 transition hover:border-white/20"
      >
        <Phone className="h-4 w-4 text-blue-400" /> +36 70 256 6448
      </a>
      <Link href="/" className="mt-4 text-sm text-white/40 underline hover:text-white/70">
        Vissza a főoldalra
      </Link>
    </div>
  );
}

// Cloudflare Turnstile token elkapása az eseményről (csak ha be van állítva).
function TurnstileListener({ onToken }: { onToken: (t: string) => void }) {
  useEffect(() => {
    const h = (e: Event) => onToken((e as CustomEvent).detail as string);
    document.addEventListener("turnstile-kalk", h);
    return () => document.removeEventListener("turnstile-kalk", h);
  }, [onToken]);
  return null;
}
