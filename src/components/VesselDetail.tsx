'use client';

import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { Header } from './Header';
import { usePathname, useRouter } from 'next/navigation';

interface VesselTechnicalData {
  type: string;
  pavillon: string;
  longueur: number | null;
  consignataire: string;
}

interface VesselDetails {
  name: string;
  status: string;
  escaleNumber: string | number;
  portName: string;
  eta: string | Date;
  lifecycle: {
    avisArrivee: 'NOT_DONE' | 'DOING' | 'DONE';
    dap: 'NOT_DONE' | 'DOING' | 'DONE';
    activites: 'NOT_DONE' | 'DOING' | 'DONE';
    manifeste: 'NOT_DONE' | 'DOING' | 'DONE';
    bad: 'NOT_DONE' | 'DOING' | 'DONE';
  };
  technicalData: VesselTechnicalData;
}

export function VesselDetail({ data }: VesselDetailProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const role = pathname.startsWith('/admin') ? 'admin' : 'agent';
    router.push(`/${role}/dashboard`);
  };

  const vesselSpecs = [
    { label: 'Type', value: data.technicalData.type || 'N/A' },
    { label: 'Pavillon', value: data.technicalData.pavillon?.toUpperCase() || 'N/A' },
    { label: 'Longueur', value: data.technicalData.longueur ? `${data.technicalData.longueur.toFixed(2)} M` : 'N/A' },
    { label: 'Consignataire', value: data.technicalData.consignataire?.toUpperCase() || 'N/A' },
  ];

  const mapStatus = (dbStatus: string): 'completed' | 'current' | 'pending' => {
    if (dbStatus === 'DONE') return 'completed';
    if (dbStatus === 'DOING') return 'current';
    return 'pending';
  };

  const workflowSteps: WorkflowStep[] = [
    { id: 'avis', label: 'Avis Arrivée', status: mapStatus(data.lifecycle.avisArrivee) },
    { id: 'dap', label: 'DAP', status: mapStatus(data.lifecycle.dap) },
    { id: 'activities', label: 'Activités', status: mapStatus(data.lifecycle.activites) },
    { id: 'manifest', label: 'Manifeste', status: mapStatus(data.lifecycle.manifeste) },
    { id: 'bad', label: 'BAD', status: mapStatus(data.lifecycle.bad) },
  ];

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMÉ':
        return 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]';
      case 'EN ATTENTE':
        return 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]';
      case 'ANNULÉ':
        return 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-500';
    }
  };

  const formattedEta = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(data.eta)).replace(',', '');

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />;
      case 'current':
        return <Clock className="w-6 h-6 text-white" strokeWidth={2} />;
      default:
        return <Circle className="w-6 h-6 text-white" strokeWidth={2} />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'current':
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
                  {data.name}
                </h2>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getStatusStyles(data.status)}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${data.status.toUpperCase() === 'CONFIRMÉ' ? 'bg-[#10B981]' : data.status.toUpperCase() === 'EN ATTENTE' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                  <span className="text-sm font-semibold uppercase" style={{ fontFamily: 'var(--font-display)' }}>{data.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Escale</p>
                  <p className="text-xl text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>{data.escaleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Port</p>
                  <p className="text-xl text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>{data.portName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ETA</p>
                  <p className="text-xl text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>{formattedEta}</p>
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

          <div className="relative pt-4 pb-4">
            {/* Progress line segments */}
            <div className="absolute top-[52px] left-[10%] right-[10%] h-1 flex z-0">
              {workflowSteps.slice(0, -1).map((_, i) => {
                const nextStep = workflowSteps[i + 1];
                let lineColor = '#E5E7EB'; // Default gray
                if (nextStep.status === 'completed') lineColor = '#10B981'; // Green
                else if (nextStep.status === 'current') lineColor = '#F59E0B'; // Orange

                return (
                  <div 
                    key={i} 
                    className="flex-1 h-full transition-colors duration-500"
                    style={{ backgroundColor: lineColor }}
                  />
                );
              })}
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-5 gap-4" style={{ zIndex: 1 }}>
              {workflowSteps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center animate-[fadeInStep_0.6s_ease-out]" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-3 transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: getStepColor(step.status),
                      animation: step.status === 'current' ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                    }}
                  >
                    {getStepIcon(step.status)}
                  </div>
                  <p className="text-center mb-1 font-medium" style={{ fontFamily: 'var(--font-display)', color: getStepColor(step.status) }}>
                    {step.label}
                  </p>
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
