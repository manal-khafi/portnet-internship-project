'use client';

import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { Header } from './Header';
import { usePathname, useRouter } from 'next/navigation';

interface VesselDetailProps {
  vesselName: string;
}

interface WorkflowStep {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: string;
}

const workflowSteps: WorkflowStep[] = [
  { id: 'avis', label: 'Avis Arrivée', status: 'completed', timestamp: '15 Avr, 09:00' },
  { id: 'dap', label: 'DAP', status: 'completed', timestamp: '15 Avr, 14:30' },
  { id: 'activities', label: 'Activités', status: 'in-progress', timestamp: '17 Avr, 08:00' },
  { id: 'manifest', label: 'Manifeste', status: 'pending' },
  { id: 'bad', label: 'BAD', status: 'pending' },
];

const vesselSpecs = [
  { label: 'Type', value: 'PORTE-CONTENEURS' },
  { label: 'Pavillon', value: 'PANAMA (PA)' },
  { label: 'Longueur', value: '225.50 M' },
  { label: 'Consignataire', value: 'M. MARITIME SERVICES' },
];

export function VesselDetail({ vesselName }: VesselDetailProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const role = pathname.startsWith('/admin') ? 'admin' : 'agent';
    router.push(`/${role}/dashboard`);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-white" strokeWidth={2} />;
      default:
        return <Circle className="w-6 h-6 text-white" strokeWidth={2} />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#F59E0B';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        breadcrumbs={[
          { label: "Dossier d'Escale", onClick: handleBack },
          { label: 'Détails Escale' }
        ]}
        showBack
        onBack={handleBack}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-gray-100 mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-4xl text-[#332A7C]" style={{ fontFamily: 'var(--font-display)' }}>
                  {vesselName}
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 rounded-xl border-2 border-[#10B981]/30">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                  <span className="text-[#10B981] text-sm" style={{ fontFamily: 'var(--font-display)' }}>CONFIRMÉ</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Escale</p>
                  <p className="text-xl text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>52310</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Port</p>
                  <p className="text-xl text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>AGADIR</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ETA</p>
                  <p className="text-xl text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>18.04.2026 10:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redux Life Cycle Tracker */}
        <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-gray-100 mb-8 animate-[fadeInUp_0.6s_ease-out]">
          <h3 className="text-xl mb-8 text-[#332A7C]" style={{ fontFamily: 'var(--font-display)' }}>
            Cycle de Vie
          </h3>

          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }}>
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#F59E0B] transition-all duration-1000"
                style={{ width: '50%' }}
              ></div>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-5 gap-4" style={{ zIndex: 1 }}>
              {workflowSteps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center animate-[fadeInStep_0.6s_ease-out]" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-3 transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: getStepColor(step.status),
                      animation: step.status === 'in-progress' ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                    }}
                  >
                    {getStepIcon(step.status)}
                  </div>
                  <p className="text-center mb-1" style={{ fontFamily: 'var(--font-display)', color: getStepColor(step.status) }}>
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-gray-500 text-center">{step.timestamp}</p>
                  )}
                  {step.status === 'in-progress' && (
                    <div className="mt-2 px-3 py-1 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                      <p className="text-xs text-[#F59E0B]" style={{ fontFamily: 'var(--font-display)' }}>En Cours</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Grid */}
        <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-gray-100 animate-[fadeInUp_0.7s_ease-out]">
          <h3 className="text-xl mb-6 text-[#332A7C]" style={{ fontFamily: 'var(--font-display)' }}>
            Données Techniques Navire
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vesselSpecs.map((spec, idx) => (
              <div
                key={spec.label}
                className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-[#332A7C]/30 transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                  {spec.label}
                </p>
                <p
                  className={`text-base ${spec.label === 'Consignataire' ? 'text-[#332A7C] font-semibold' : 'text-[#1A1A2E]'}`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInStep {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
