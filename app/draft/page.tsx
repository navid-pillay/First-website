import type { Metadata } from "next";
import DraftChoice from "@/components/DraftChoice";
import DraftNav from "@/components/DraftNav";
import PowerFcHero from "@/components/heroes/PowerFcHero";

// Draft: the Power FC hero with its opening sequence, then (as you scroll) the
// two programs, under a sticky navigation bar. No footer or intro screen.
export const metadata: Metadata = {
  title: "Draft: Power FC hero",
  robots: { index: false, follow: false },
};

export default function DraftPage() {
  return (
    <>
      <DraftNav />
      <main className="bg-paper">
        <PowerFcHero intro scrollAway />
        <DraftChoice />
      </main>
    </>
  );
}
