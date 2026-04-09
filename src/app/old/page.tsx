import { DotGrid } from "@/components/diagram/dot-grid";
import { MobileDiagram } from "@/components/diagram/mobile-diagram";
import { SystemDiagramClient } from "@/components/diagram/diagram-loader";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DotGrid />
      <div className="hidden md:block h-screen">
        <SystemDiagramClient />
      </div>
      <div className="md:hidden">
        <MobileDiagram />
      </div>
    </main>
  );
}
