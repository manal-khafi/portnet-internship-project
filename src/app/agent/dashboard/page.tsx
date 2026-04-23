import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";
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
          { label: 'Houle', value: '-- m' },
          { label: 'Visibilité', value: '-- km' },
          { label: 'Humidité', value: '--%' }
        ];
      }
    }
  }

  const stats = [
    { label: 'En Rade', value: '2', color: '#EF4444' },
    { label: 'Au Port', value: '1', color: '#F59E0B' },
    { label: 'À Quai', value: '3', color: '#10B981' },
    { label: 'Total Général', value: '6', color: '#332A7C' },
  ];

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
    x: Math.random() * 80,
    y: Math.random() * 80,
  }));

  return {
    ports: portsFromDb.map(p => ({ id: p.id, name: p.nom })),
    vessels,
    weatherMap,
    bathymetry,
    stats
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
      stats={data.stats}
    />
  );
}
