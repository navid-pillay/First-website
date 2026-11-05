import type { Metadata } from "next";
import PowerFcHero from "@/components/heroes/PowerFcHero";

// Draft: the Power FC hero on its own, with no header, footer or intro.
export const metadata: Metadata = {
  title: "Draft: Power FC hero",
  robots: { index: false, follow: false },
};

export default function DraftPage() {
  return (
    <main className="flex min-h-svh flex-col justify-center bg-paper">
      <PowerFcHero fullScreen />
    </main>
  );
}
