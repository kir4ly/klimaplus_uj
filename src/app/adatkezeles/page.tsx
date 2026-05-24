import type { Metadata } from "next";
import LegalPage from "@/components/legal-page";
import { ADATKEZELES } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | Klíma Plus",
  description: "Klima Plus Cell Kft. adatkezelési tájékoztatója és nyilatkozata.",
};

export default function Page() {
  return <LegalPage text={ADATKEZELES} />;
}
