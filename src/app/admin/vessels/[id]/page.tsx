import { VesselDetail } from "@/components/VesselDetail";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { getNavireByIdForUser } from "@/lib/data-access";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VesselPage({ params }: PageProps) {
  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  
  const vessel = await getNavireByIdForUser(user, id);

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
    },
    technicalData: {
      type: vessel.type,
      pavillon: vessel.pavillon,
      longueur: vessel.longueur,
      consignataire: vessel.consignataire
    }
  };

  return <VesselDetail data={vesselData} />;
}
