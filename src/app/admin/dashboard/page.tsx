import { DashboardClient } from "@/components/DashboardClient";
import { prisma } from "@/lib/prisma";
import { fetchWeather } from "@/lib/weather";

async function getDashboardData() {
  const portsFromDb = await prisma.port.findMany({
    orderBy: {
      nom: "asc",
    },
  });

  const weatherMap: Record<string, any[]> = {};

  for (const port of portsFromDb) {
    if (port.lat && port.lon) {
      try {
        weatherMap[port.id] = await fetchWeather(port.lat, port.lon);
      } catch (error) {
        console.error(`Failed to fetch weather for ${port.nom}:`, error);
        weatherMap[port.id] = [
          { label: 'Météo', value: 'Indisponible' },
          { label: 'Température', value: '--°C' },
          { label: 'Vent', value: '-- km/h' },
          { label: 'Houle', value: '0.4 m' },
          { label: 'Visibilité', value: '-- km' },
          { label: 'Humidité', value: '--%' }
        ];
      }
    }
  }


  const escales = await prisma.escale.findMany({
    include: {
      navire: true,
    },
  });

  const vessels = escales.map((escale) => ({
    id: escale.navire.id,
    name: escale.navire.nom,
    portId: escale.portId,
    status: 
      escale.statut === "RADE" ? "in-roads" : 
      escale.statut === "AU_PORT" ? "at-port" : 
      "at-quay",
    eta: escale.eta,
    cargoType: escale.navire.type,
    x: Math.random() * 80,
    y: Math.random() * 80,
  }));


  const bathymetry = await prisma.bathymetrie.findMany({
    select: {
      id: true,
      portId: true,
      profondeurMax: true,
      profondeurMin: true,
      tirantEauAutorise: true,
      longueurQuai: true,
      postesDisponibles: true,
      capacite: true,
    },
  });

  return {
    ports: portsFromDb.map(p => ({ id: p.id, name: p.nom })),
    vessels,
    weatherMap,
    bathymetry
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <DashboardClient
      ports={data.ports}
      vessels={data.vessels as any}
      initialWeather={data.weatherMap}
      initialBathymetry={data.bathymetry}
    />
  );
}
