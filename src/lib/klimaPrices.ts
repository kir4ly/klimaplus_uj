// Klíma ár-adatbázis – a szerelő által megadott listaárak alapján.
// A /ajanlatkero kalkulátor ez alapján keresi ki minden helyiséghez a méret +
// kategória + márka szerinti konkrét modellt és árat. EGYELŐRE csak belső
// használatra (a szerelőnek küldött értesítő emailben) – a látogatónak nem
// jelenik meg ár. Az árak forrás szerint készülék-listaárak.

export type SizeKey = "15-25" | "25-35" | "35-50" | "50+";
export type CategoryKey = "olcso" | "kozep" | "premium" | "luxus";
export type BrandKey = "Gree" | "Syen" | "Aux";

export type Variant = { kw: number; price: number };
export type ClimaModel = {
  brand: BrandKey;
  model: string;
  category: CategoryKey;
  variants: Partial<Record<SizeKey, Variant>>;
};

// Kategória sorrend (olcsótól a luxusig) – a fallbackhez.
export const CATEGORY_ORDER: CategoryKey[] = ["olcso", "kozep", "premium", "luxus"];

// A kalkulátor UI címkéi -> belső kulcsok.
export const CATEGORY_LABEL_TO_KEY: Record<string, CategoryKey> = {
  Olcsó: "olcso",
  Közép: "kozep",
  Prémium: "premium",
  Luxus: "luxus",
};
export const SIZE_LABEL_TO_KEY: Record<string, SizeKey> = {
  "15-25 m²": "15-25",
  "25-35 m²": "25-35",
  "35-50 m²": "35-50",
  "50+ m²": "50+",
};

export const MODELS: ClimaModel[] = [
  // ---- GREE ----
  {
    brand: "Gree",
    model: "Pulse Pro",
    category: "kozep",
    variants: {
      "15-25": { kw: 2.5, price: 235000 },
      "25-35": { kw: 3.5, price: 250000 },
      "35-50": { kw: 5.3, price: 360000 },
      "50+": { kw: 7.1, price: 445000 },
    },
  },
  {
    brand: "Gree",
    model: "Comfort Pro",
    category: "kozep",
    variants: {
      "15-25": { kw: 2.7, price: 260000 },
      "25-35": { kw: 3.5, price: 275000 },
      "35-50": { kw: 5.3, price: 405000 },
      "50+": { kw: 7.1, price: 485000 },
    },
  },
  {
    brand: "Gree",
    model: "G Time",
    category: "premium",
    variants: {
      "15-25": { kw: 2.7, price: 265000 },
      "25-35": { kw: 3.5, price: 290000 },
      "35-50": { kw: 5.1, price: 420000 },
      "50+": { kw: 7.1, price: 495000 },
    },
  },
  {
    brand: "Gree",
    model: "Airy",
    category: "luxus",
    variants: {
      "15-25": { kw: 2.7, price: 335000 },
      "25-35": { kw: 3.5, price: 350000 },
      "35-50": { kw: 5.3, price: 460000 },
      "50+": { kw: 7.1, price: 530000 },
    },
  },
  {
    brand: "Gree",
    model: "Amber Royal",
    category: "luxus",
    // Nincs 50+ változat.
    variants: {
      "15-25": { kw: 2.7, price: 410000 },
      "25-35": { kw: 3.5, price: 430000 },
      "35-50": { kw: 5.3, price: 500000 },
    },
  },

  // ---- SYEN ----
  {
    brand: "Syen",
    model: "Charm",
    category: "olcso",
    variants: {
      "15-25": { kw: 2.7, price: 200000 },
      "25-35": { kw: 3.2, price: 205000 },
      "35-50": { kw: 4.6, price: 345000 },
      "50+": { kw: 6.2, price: 400000 },
    },
  },
  {
    brand: "Syen",
    model: "Muse Next",
    category: "kozep",
    variants: {
      "15-25": { kw: 2.7, price: 225000 },
      "25-35": { kw: 3.5, price: 235000 }, // forrásban "35-35 m2" elgépelés
      "35-50": { kw: 5.3, price: 345000 },
      "50+": { kw: 7.1, price: 440000 },
    },
  },

  // ---- AUX ----
  {
    brand: "Aux",
    model: "Gamma 3R",
    category: "olcso",
    // Nincs 50+ változat; a "5,1 kw 50 m2" a 35-50 sávba sorolva.
    variants: {
      "15-25": { kw: 2.5, price: 190000 },
      "25-35": { kw: 3.5, price: 200000 },
      "35-50": { kw: 5.1, price: 290000 },
    },
  },
  {
    brand: "Aux",
    model: "Delta 3",
    category: "kozep",
    variants: {
      "15-25": { kw: 2.7, price: 215000 },
      "25-35": { kw: 3.5, price: 230000 },
      "35-50": { kw: 5.4, price: 340000 },
      "50+": { kw: 7.3, price: 460000 },
    },
  },
  {
    brand: "Aux",
    model: "Magma 2",
    category: "premium",
    // Nincs 50+ változat.
    variants: {
      "15-25": { kw: 2.7, price: 245000 },
      "25-35": { kw: 3.5, price: 265000 },
      "35-50": { kw: 5.4, price: 390000 },
    },
  },
  {
    brand: "Aux",
    model: "Aura",
    category: "luxus",
    variants: {
      "15-25": { kw: 2.7, price: 265000 },
      "25-35": { kw: 3.5, price: 280000 },
      "35-50": { kw: 5.4, price: 410000 },
      "50+": { kw: 7.3, price: 480000 },
    },
  },
];

export const ALL_BRANDS: BrandKey[] = ["Gree", "Syen", "Aux"];

export const huf = (n: number) => n.toLocaleString("hu-HU") + " Ft";

// A brand-címkékből valódi márkakulcsok. Ha nincs konkrét (üres, "Mindegy",
// "Nem tudom"), akkor mindhárom márkát nézzük.
function resolveBrands(brandLabels: string[]): BrandKey[] {
  const real = ALL_BRANDS.filter((b) => brandLabels.includes(b));
  return real.length ? real : ALL_BRANDS;
}

// Az adott márkához a kért kategóriához legközelebbi, ténylegesen létező
// kategória (lefelé, majd felfelé keresve). Pl. Syen + luxus -> közép.
function nearestCategory(brand: BrandKey, wanted: CategoryKey): CategoryKey | null {
  const avail = new Set(MODELS.filter((m) => m.brand === brand).map((m) => m.category));
  if (avail.has(wanted)) return wanted;
  const idx = CATEGORY_ORDER.indexOf(wanted);
  for (let d = 1; d < CATEGORY_ORDER.length; d++) {
    const lo = CATEGORY_ORDER[idx - d];
    if (lo && avail.has(lo)) return lo;
    const hi = CATEGORY_ORDER[idx + d];
    if (hi && avail.has(hi)) return hi;
  }
  return null;
}

export type Pick = { brand: BrandKey; model: string; kw: number; price: number };

// Egy helyiséghez (méret) + márka + kategória alapján a legjobb (legolcsóbb)
// illő modell. Ha a kért kategóriában nincs az adott mérethez modell, lefelé
// lépünk kategóriát, amíg találunk olyat, ami lefedi a méretet.
function pickModel(brand: BrandKey, wantedCat: CategoryKey | null, size: SizeKey | null): Pick | null {
  if (!size || !wantedCat) return null;
  const start = nearestCategory(brand, wantedCat);
  if (!start) return null;
  const startIdx = CATEGORY_ORDER.indexOf(start);
  // A megtalált kategóriától lefelé keresünk olyat, aminek van erre a méretre ára.
  for (let i = startIdx; i >= 0; i--) {
    const cat = CATEGORY_ORDER[i];
    const candidates = MODELS.filter(
      (m) => m.brand === brand && m.category === cat && m.variants[size],
    );
    if (candidates.length) {
      const best = candidates.reduce((a, b) =>
        (a.variants[size]!.price <= b.variants[size]!.price ? a : b),
      );
      const v = best.variants[size]!;
      return { brand, model: best.model, kw: v.kw, price: v.price };
    }
  }
  return null;
}

export type RoomRec = { size: string; sizeKey: SizeKey | null; picks: Pick[] };
export type Recommendation = {
  rooms: RoomRec[];
  totals: { brand: BrandKey; total: number }[];
};

// A teljes ajánlat: helyiségenként a márkánkénti javasolt modell + ár, és
// márkánkénti végösszeg. Csak belső (szerelői) email célra.
export function recommend(
  sizeLabels: (string | null)[],
  categoryLabel: string,
  brandLabels: string[],
): Recommendation {
  const catKey = CATEGORY_LABEL_TO_KEY[categoryLabel] ?? null;
  const brands = resolveBrands(brandLabels);

  const rooms: RoomRec[] = sizeLabels.map((label) => {
    const sizeKey = label ? SIZE_LABEL_TO_KEY[label] ?? null : null;
    const picks = brands
      .map((b) => pickModel(b, catKey, sizeKey))
      .filter((p): p is Pick => p !== null);
    return { size: label ?? "n/a", sizeKey, picks };
  });

  const totals = brands
    .map((brand) => {
      let total = 0;
      let complete = true;
      for (const r of rooms) {
        const p = r.picks.find((x) => x.brand === brand);
        if (p) total += p.price;
        else complete = false;
      }
      return { brand, total, complete };
    })
    // Csak azok a márkák, ahol minden helyiségre volt ár (különben félrevezető összeg).
    .filter((t) => t.complete && t.total > 0)
    .map(({ brand, total }) => ({ brand, total }));

  return { rooms, totals };
}

// --- Vásárlói árajánlat (customer-facing) -----------------------------------
// A recommend() egy márkánkénti "legjobb" modellt ad a szerelőnek. A vásárlói
// árajánlathoz helyiségenként TÖBB opciót mutatunk (a kiválasztott márkák
// illő modelljei), a legolcsóbbat kiemelve, és a telepítési díjjal + végösszeggel.

// Egy márkából egy helyiséghez illő modellek. Elsőként pontosan a kért
// kategóriát nézi; ha ott nincs (és a fallback engedélyezett), a legközelebbi
// létező kategóriától lefelé keres olyat, aminek van erre a méretre változata.
function optionsForBrand(
  brand: BrandKey,
  wantedCat: CategoryKey,
  size: SizeKey,
  allowFallback: boolean,
): Pick[] {
  const toPicks = (cat: CategoryKey) =>
    MODELS.filter((m) => m.brand === brand && m.category === cat && m.variants[size]).map((m) => {
      const v = m.variants[size]!;
      return { brand, model: m.model, kw: v.kw, price: v.price };
    });
  const exact = toPicks(wantedCat);
  if (exact.length || !allowFallback) return exact;
  const start = nearestCategory(brand, wantedCat);
  if (!start) return [];
  for (let i = CATEGORY_ORDER.indexOf(start); i >= 0; i--) {
    const got = toPicks(CATEGORY_ORDER[i]);
    if (got.length) return got;
  }
  return [];
}

// Az összes illő modell a kiválasztott márkákból, ár szerint növekvő sorrendben.
function collectOptions(
  brands: BrandKey[],
  wantedCat: CategoryKey | null,
  size: SizeKey | null,
  allowFallback: boolean,
): Pick[] {
  if (!size || !wantedCat) return [];
  const out: Pick[] = [];
  for (const brand of brands) out.push(...optionsForBrand(brand, wantedCat, size, allowFallback));
  return out.sort((a, b) => a.price - b.price);
}

export type QuoteRoom = { size: string; options: Pick[]; cheapest: Pick | null };
export type Quote = {
  rooms: QuoteRoom[];
  installPerUnit: number;
  unitCount: number; // ahány helyiségre van érvényes ajánlat
  productsTotal: number; // a legolcsóbb opciók összege
  installTotal: number;
  grandTotal: number;
};

// A teljes vásárlói árajánlat: helyiségenként opciók + a legolcsóbb opcióval
// számolt végösszeg (készülék + telepítés).
export function buildQuote(
  sizeLabels: (string | null)[],
  categoryLabel: string,
  brandLabels: string[],
  installPerUnit: number,
): Quote {
  const catKey = CATEGORY_LABEL_TO_KEY[categoryLabel] ?? null;
  const explicit = ALL_BRANDS.filter((b) => brandLabels.includes(b));
  const isMindegy = explicit.length === 0;
  const brands = isMindegy ? ALL_BRANDS : explicit;

  const rooms: QuoteRoom[] = sizeLabels.map((label) => {
    const sizeKey = label ? SIZE_LABEL_TO_KEY[label] ?? null : null;
    // "Mindegy": maradunk a kért kategóriában (nem húzunk be alacsonyabb tier-t
    // más márkából). Ha egyik márkának sincs rá modellje, engedünk fallbackot.
    // Konkrét márka esetén: fallback – a márka legjobb elérhető modelljét mutatjuk.
    let options = collectOptions(brands, catKey, sizeKey, !isMindegy);
    if (isMindegy && !options.length) options = collectOptions(brands, catKey, sizeKey, true);
    return { size: label ?? "n/a", options, cheapest: options[0] ?? null };
  });

  const unitCount = rooms.filter((r) => r.cheapest).length;
  const productsTotal = rooms.reduce((sum, r) => sum + (r.cheapest?.price ?? 0), 0);
  const installTotal = installPerUnit * unitCount;
  return {
    rooms,
    installPerUnit,
    unitCount,
    productsTotal,
    installTotal,
    grandTotal: productsTotal + installTotal,
  };
}
