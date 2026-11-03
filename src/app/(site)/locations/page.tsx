import type { Metadata } from "next";
import LocationsMap from "@/components/LocationsMap";

export const metadata: Metadata = {
  title: "Locations | Power FC",
  description: "Find Power Soccer and Power FC program locations across Toronto: East York, North Toronto, Bloor West, Forest Hill, Lawrence Park, Leaside, York Mills, and the Danforth.",
};

export default function LocationsPage() {
  return <LocationsMap />;
}
