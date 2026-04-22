import { Ship } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VesselStatus = 'in-roads' | 'at-port' | 'at-quay';

interface VesselIconProps {
  status: VesselStatus;
  onClick?: () => void;
  animate?: boolean;
}

const statusColors = {
  'in-roads': '#EF4444',
  'at-port': '#F59E0B',
  'at-quay': '#10B981',
} as const;

export function VesselIcon({ status, onClick, animate = true }: VesselIconProps) {
  const color = statusColors[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group cursor-pointer transition-all duration-300 hover:scale-125',
        onClick && 'focus:outline-none focus:ring-2 focus:ring-portnet-purple/50 rounded-full'
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all duration-300',
            animate && 'animate-pulse'
          )}
          style={{ backgroundColor: color }}
        >
          <Ship className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div
          className={cn(
            'absolute w-14 h-14 rounded-full border-2 opacity-40',
            animate && 'animate-ping'
          )}
          style={{
            borderColor: color,
            top: '-7px',
            left: '-7px',
          }}
        />
      </div>
    </button>
  );
}
