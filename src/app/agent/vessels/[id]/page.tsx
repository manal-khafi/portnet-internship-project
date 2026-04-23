import { VesselDetail } from "@/components/VesselDetail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VesselPage({ params }: PageProps) {
  const { id } = await params;
  
  const vessel = await prisma.navire.findUnique({
    where: { id },
    include: {
      escales: {
        orderBy: {
          eta: 'desc'
        },
        take: 1,
        include: {
          port: true
        }
      }
    }
  });

  if (!vessel) {
    notFound();
  }

  const latestEscale = vessel.escales[0];

  const vesselData = {
    name: vessel.nom,
    status: latestEscale ? "CONFIRMÉ" : "NON PLANIFIÉ", 
    escaleNumber: latestEscale ? latestEscale.numeroEscale : "N/A",
    portName: latestEscale ? latestEscale.port.nom : "N/A",
    eta: latestEscale ? latestEscale.eta : new Date(),
    lifecycle: {
      avisArrivee: latestEscale?.avisArriveeStatus || 'NOT_DONE',
      dap: latestEscale?.dapStatus || 'NOT_DONE',
      activites: latestEscale?.activitesStatus || 'NOT_DONE',
      manifeste: latestEscale?.manifesteStatus || 'NOT_DONE',
      bad: latestEscale?.badStatus || 'NOT_DONE',
    }
  };

  return <VesselDetail data={vesselData} />;
}
