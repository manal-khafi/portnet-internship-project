import { VesselDetail } from "@/components/VesselDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VesselPage({ params }: PageProps) {
  const { id } = await params;
  
  // In a real app, fetch vessel data using prisma and the ID
  // const vessel = await prisma.navire.findUnique({ where: { id } });
  
  const mockVesselName = "SOUK EXPRESS"; // Should come from DB based on ID

  return <VesselDetail vesselName={mockVesselName} />;
}
