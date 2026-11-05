import type { Metadata } from "next";
import DraftChoice from "@/components/DraftChoice";
import PowerFcHero from "@/components/heroes/PowerFcHero";

// Draft: the Power FC hero with its opening sequence, then (as you scroll) the
// choice between the two programs. No header, footer or intro screen.
export const metadata: Metadata = {
  title: "Draft: Power FC hero",
  robots: { index: false, follow: false },
};

export default function DraftPage() {
  return (
    <main className="bg-paper">
      <PowerFcHero fullScreen intro scrollAway />
      <DraftChoice />
    </main>
  );
}
