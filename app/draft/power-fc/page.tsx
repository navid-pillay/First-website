import type { Metadata } from "next";
import DraftProgramPage from "@/components/DraftProgramPage";

export const metadata: Metadata = {
  title: "Draft: Power FC",
  robots: { index: false, follow: false },
};

export default function DraftPowerFcPage() {
  return <DraftProgramPage program="power-fc" />;
}
