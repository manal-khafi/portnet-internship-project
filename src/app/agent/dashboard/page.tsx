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

  const vessels = [
    { id: '1', name: 'SOUK EXPRESS', status: 'at-quay', x: 65, y: 30 },
    { id: '2', name: 'MEDITERRANEAN STAR', status: 'at-quay', x: 65, y: 50 },
    { id: '3', name: 'ATLAS VOYAGER', status: 'at-quay', x: 65, y: 70 },
    { id: '4', name: 'CASABLANCA QUEEN', status: 'at-port', x: 45, y: 50 },
    { id: '5', name: 'SAHARA TRADER', status: 'in-roads', x: 20, y: 35 },
    { id: '6', name: 'MOROCCO PRIDE', status: 'in-roads', x: 25, y: 60 },
  ];

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
