import { DashboardClient } from "@/components/DashboardClient";

// In a real app, this would fetch from Prisma
async function getDashboardData() {
  const ports = [
    { id: 'casablanca', name: 'Port of Casablanca' },
    { id: 'tangier', name: 'Port of Tangier Med' },
    { id: 'agadir', name: 'Port of Agadir' },
  ];

  const vessels = [
    { id: '1', name: 'SOUK EXPRESS', status: 'at-quay', x: 65, y: 30 },
    { id: '2', name: 'MEDITERRANEAN STAR', status: 'at-quay', x: 65, y: 50 },
    { id: '3', name: 'ATLAS VOYAGER', status: 'at-quay', x: 65, y: 70 },
    { id: '4', name: 'CASABLANCA QUEEN', status: 'at-port', x: 45, y: 50 },
    { id: '5', name: 'SAHARA TRADER', status: 'in-roads', x: 20, y: 35 },
    { id: '6', name: 'MOROCCO PRIDE', status: 'in-roads', x: 25, y: 60 },
  ];

  const weather = [
    { label: 'Météo', value: 'Ensoleillé' },
    { label: 'Température', value: '26°C' },
    { label: 'Vent', value: '12 km/h S' },
    { label: 'Houle', value: '0.4 m' },
    { label: 'Visibilité', value: '12 km' },
    { label: 'Marée', value: 'Haute 11:30' }
  ];

  const bathymetry = [
    { label: 'Profondeur Max', value: '11.5 m' },
    { label: 'Profondeur Min', value: '5.5 m' },
    { label: 'Tirant d\'eau Max', value: '10.0 m' },
    { label: 'Longueur Quai', value: '450 m' },
    { label: 'Postes Disponibles', value: '6 postes' },
    { label: 'Capacité', value: '12 navires' }
  ];

  const stats = [
    { label: 'En Rade', value: '2', color: '#EF4444' },
    { label: 'Au Port', value: '1', color: '#F59E0B' },
    { label: 'À Quai', value: '3', color: '#10B981' },
    { label: 'Total Général', value: '6', color: '#332A7C' },
  ];

  return { ports, vessels, weather, bathymetry, stats };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <DashboardClient 
      ports={data.ports}
      vessels={data.vessels as any}
      initialWeather={data.weather}
      initialBathymetry={data.bathymetry}
      stats={data.stats}
    />
  );
}
