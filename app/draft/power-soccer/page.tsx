import type { Metadata } from "next";
import DraftProgramPage from "@/components/DraftProgramPage";

export const metadata: Metadata = {
  title: "Draft: Power Soccer",
  robots: { index: false, follow: false },
};

export default function DraftPowerSoccerPage() {
  return <DraftProgramPage program="power-soccer" />;
}
