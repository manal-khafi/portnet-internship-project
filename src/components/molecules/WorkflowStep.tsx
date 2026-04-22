import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepStatus = 'completed' | 'in-progress' | 'pending';

interface WorkflowStepProps {
  label: string;
  status: StepStatus;
  timestamp?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: '#10B981',
    label: 'Terminé',
  },
  'in-progress': {
    icon: Clock,
    color: '#F59E0B',
    label: 'En Cours',
  },
  pending: {
    icon: Circle,
    color: '#9CA3AF',
    label: 'En Attente',
  },
} as const;

export function WorkflowStep({ label, status, timestamp }: WorkflowStepProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center animate-[fadeInStep_0.6s_ease-out]">
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-3',
          'transition-all duration-300 hover:scale-110',
          status === 'in-progress' && 'animate-pulse'
        )}
        style={{ backgroundColor: config.color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>
      <p
        className="text-center mb-1 font-display"
        style={{ color: config.color }}
      >
        {label}
      </p>
      {timestamp && (
        <p className="text-xs text-gray-500 text-center">{timestamp}</p>
      )}
      {status === 'in-progress' && (
        <div className="mt-2 px-3 py-1 bg-orange-500/10 rounded-lg border border-orange-500/30">
          <p className="text-xs text-orange-600 font-display">En Cours</p>
        </div>
      )}
    </div>
  );
}
