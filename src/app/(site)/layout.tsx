import type { ReactNode } from "react";
import Header from "@/components/Header";

// Every page except the intro: the navigation bar on top. The Locations page
// fills the rest of the screen with its map.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col has-[[data-map-page]]:h-dvh">
      <Header />
      {children}
    </div>
  );
}
