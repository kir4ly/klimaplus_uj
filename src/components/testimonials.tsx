// Real Google reviews from Klima Plus's own profile, transcribed verbatim and
// shown as native testimonials. Light (no external script), non-clickable (keeps
// the funnel — no off-page exit). Legal: genuine, attributed, not fabricated.
const REVIEWS = [
  {
    name: "Dani Somogyi",
    time: "2 hete",
    text: "Tegnap telepítettek klímát a lakásomba! Tökéletes munkát végeztek! Csak ajánlani tudom! Ha klímát szeretnél, őket válaszd!",
  },
  {
    name: "Marianna Kunyikné Járó",
    time: "5 hónapja",
    text: "Szakszerű tanácsadást kaptunk a felméréssel együtt. A beszerelést pontosan a megbeszélt időben, gyorsan, precízen végezték. Tisztaságot hagytak maguk után. Igényesek, közvetlenek, ezek alapján szívesen ajánlom őket!",
  },
  {
    name: "Krisztina Mayer",
    time: "1 éve",
    text: "Gyors, megbízható emberek! Rövid határidőn belül kaptam időpontot szerelésre. Nagyon szépen, tisztán dolgoznak! Mindent elmondtak, mit kell tudnom! Mindenkinek csak ajánlani tudom őket!",
  },
];

export default function Testimonials() {
  return (
    <div className="mt-3 space-y-3">
      {REVIEWS.map((r) => (
        <figure key={r.name} className="rounded-xl bg-white px-5 py-4 text-left shadow">
          <div className="flex items-center justify-between gap-3">
            <figcaption className="text-sm font-semibold text-neutral-900">{r.name}</figcaption>
            <span className="shrink-0 text-xs text-neutral-500">Google · {r.time}</span>
          </div>
          <div className="mt-1 text-sm leading-none text-[#FBBC05]" aria-hidden="true">★★★★★</div>
          <blockquote className="mt-2 text-sm leading-relaxed text-neutral-700">{r.text}</blockquote>
        </figure>
      ))}
    </div>
  );
}
