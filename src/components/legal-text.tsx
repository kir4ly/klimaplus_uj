import type { ReactNode } from "react";

const TITLES = new Set([
  "ADATKEZELÉSI TÁJÉKOZTATÓ ÉS NYILATKOZAT",
  "SÜTIKEZELÉSI TÁJÉKOZTATÓ ÉS NYILATKOZAT",
]);

type Kind = "h1" | "h2" | "h3" | "bullet" | "p";

function kind(block: string): Kind {
  const line = block.trim();
  if (TITLES.has(line)) return "h1";
  if (line.startsWith("•")) return "bullet";
  // Real section headers have a space after the number and no trailing period;
  // table-of-contents entries (no space and/or trailing period) stay paragraphs.
  if (/^\d+\.\d+\s/.test(line) && !line.endsWith(".")) return "h3";
  if (/^\d+\.\s/.test(line) && !line.endsWith(".")) return "h2";
  return "p";
}

/** Renders the verbatim legal text into readable, lightly-structured markup. */
export default function LegalText({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < blocks.length) {
    if (kind(blocks[i]) === "bullet") {
      const items: string[] = [];
      while (i < blocks.length && kind(blocks[i]) === "bullet") {
        items.push(blocks[i].replace(/^•\s*/, ""));
        i++;
      }
      out.push(
        <ul key={key++} className="my-4 list-disc space-y-2 pl-6 text-neutral-700">
          {items.map((it, j) => (
            <li key={j} className="whitespace-pre-line leading-relaxed">
              {it}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const block = blocks[i];
    switch (kind(block)) {
      case "h1":
        out.push(
          <h1 key={key++} className="mb-7 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            {block}
          </h1>,
        );
        break;
      case "h2":
        out.push(
          <h2 key={key++} className="mt-10 mb-3 border-t border-neutral-200 pt-7 text-xl font-bold text-neutral-900">
            {block}
          </h2>,
        );
        break;
      case "h3":
        out.push(
          <h3 key={key++} className="mt-7 mb-2 text-lg font-semibold text-neutral-800">
            {block}
          </h3>,
        );
        break;
      default:
        out.push(
          <p key={key++} className="my-3 whitespace-pre-line leading-relaxed text-neutral-700">
            {block}
          </p>,
        );
    }
    i++;
  }

  return <>{out}</>;
}
