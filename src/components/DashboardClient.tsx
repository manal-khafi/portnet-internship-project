'use client';

import { useCallback, useMemo, useState } from 'react';
import { Cloud, Waves } from 'lucide-react';
import { Header } from './Header';
import { StatsCard } from './StatsCard';
import { usePathname, useRouter } from 'next/navigation';
import { PortSelector } from './dashboard/PortSelector';
import { VesselMap } from './dashboard/VesselMap';
import { VesselSidebar } from './dashboard/VesselSidebar';

interface Vessel {
  id: string;
  name: string;
  status: 'in-roads' | 'at-port' | 'at-quay';
  x: number;
  y: number;
}

interface DashboardClientProps {
  ports: { id: string; name: string }[];
  vessels: Vessel[];
  initialWeather: Record<string, any[]>;
  initialBathymetry: any;
  stats: any[];
}

export function DashboardClient({ ports, vessels, initialWeather, initialBathymetry, stats }: DashboardClientProps) {
  const [selectedPort, setSelectedPort] = useState(
    ports.length > 0 ? ports[0].id : ""
  );
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const role = pathname.startsWith('/admin') ? 'admin' : 'agent';

  const handleVesselClick = useCallback((vessel: Vessel) => {
    setSelectedVesselId(vessel.id);
  }, []);

  const handlePortChange = useCallback((id: string) => {
    setSelectedPort(id);
  }, []);

  const selectedVessel = useMemo(() =>
    vessels.find(v => v.id === selectedVesselId),
    [vessels, selectedVesselId]);

  const selectedWeather = useMemo(() => {
    return initialWeather[selectedPort] || [
      { label: 'Météo', value: 'Chargement...' },
      { label: 'Température', value: '--°C' },
      { label: 'Vent', value: '-- km/h' },
      { label: 'Houle', value: '0.4 m' },
      { label: 'Visibilité', value: '-- km' },
      { label: 'Humidité', value: '--%' }
    ];
  }, [selectedPort, initialWeather]);

  const selectedBathymetry = useMemo(() => {
    const data = Array.isArray(initialBathymetry) 
      ? initialBathymetry.find((b: any) => b.portId === selectedPort)
      : null;

    if (!data) return [];

    return [
      { label: 'Profondeur Max', value: `${data.profondeurMax} m` },
      { label: 'Profondeur Min', value: `${data.profondeurMin} m` },
      { label: 'Tirant d\'eau Max', value: `${data.tirantEauAutorise} m` },
      { label: 'Longueur Quai', value: `${data.longueurQuai} m` },
      { label: 'Postes Disponibles', value: `${data.postesDisponibles} postes` },
      { label: 'Capacité', value: `${data.capacite} navires` }
    ];
  }, [selectedPort, initialBathymetry]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/login');
    }
  }, [router]);

  const handleGoToDetails = useCallback((id: string) => {
    router.push(`/${role}/vessels/${id}`);
  }, [router, role]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        breadcrumbs={[
          { label: "Dossier d'Escale" },
          { label: 'Vue Interactive' }
        ]}
        onLogout={handleLogout}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <PortSelector
          ports={ports}
          selectedPort={selectedPort}
          onPortChange={handlePortChange}
        />

        {/* Weather & Bathymetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-[fadeInStagger_0.6s_ease-out]">
          <StatsCard
            title="Météo Actuelle"
            icon={<Cloud className="w-7 h-7 text-white" strokeWidth={1.5} />}
            badge="EN DIRECT"
            data={selectedWeather}
          />

          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100 hover:border-portnet-purple/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-portnet-purple to-[#4A3A9C] flex items-center justify-center">
                <Waves className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-display)' }}>DONNÉES</span>
            </div>
            <h3 className="text-lg mb-4 text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>Bathymétrie</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedBathymetry.map((item: any, idx: number) => (
                <div key={idx}>
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-base text-portnet-navy" style={{ fontFamily: 'var(--font-display)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VesselMap
              vessels={vessels}
              selectedVesselId={selectedVesselId}
              onVesselClick={handleVesselClick}
            />
          </div>

          <div className="lg:col-span-1">
            <VesselSidebar
              selectedVessel={selectedVessel}
              onGoToDetails={handleGoToDetails}
            />
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100 hover:border-portnet-purple/20 transition-all duration-300 animate-[fadeInUp_0.6s_ease-out]"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl animate-pulse" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInStagger {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
