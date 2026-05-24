import type { Metadata } from "next";
import LegalPage from "@/components/legal-page";
import { SUTIK } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Sütikezelési tájékoztató | Klíma Plus",
  description: "Klima Plus Cell Kft. sütikezelési (cookie) tájékoztatója és nyilatkozata.",
};

export default function Page() {
  return <LegalPage text={SUTIK} />;
}
