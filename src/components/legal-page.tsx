import Link from "next/link";
import LegalText from "./legal-text";

export default function LegalPage({ text }: { text: string }) {
  return (
    <main className="min-h-screen bg-neutral-50 font-body">
      <header className="bg-[#2b2b2b]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label="Klima Plus főoldal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/klima-plus-white.svg" alt="Klima Plus" className="h-7 w-auto" />
          </Link>
          <Link href="/" className="text-sm font-medium text-white/80 transition hover:text-white">
            ← Vissza a főoldalra
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-10 md:py-14">
        <LegalText text={text} />
      </article>

      <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
        <Link href="/adatkezeles" className="hover:underline">
          Adatkezelési tájékoztató
        </Link>
        {" • "}
        <Link href="/sutik" className="hover:underline">
          Sütikezelési tájékoztató
        </Link>
      </footer>
    </main>
  );
}
