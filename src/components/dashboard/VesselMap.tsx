'use client';

import React from 'react';
import { Ship, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vessel {
  id: string;
  name: string;
  status: 'in-roads' | 'at-port' | 'at-quay';
  x: number;
  y: number;
}

interface VesselMapProps {
  vessels: Vessel[];
  selectedVesselId: string | null;
  onVesselClick: (vessel: Vessel) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in-roads': return 'var(--portnet-red)';
    case 'at-port': return 'var(--portnet-orange)';
    case 'at-quay': return 'var(--portnet-green)';
    default: return '#6B7280';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in-roads': return 'En Rade';
    case 'at-port': return 'Au Port';
    case 'at-quay': return 'À Quai';
    default: return 'Inconnu';
  }
};

export const VesselMap = React.memo(({ vessels, selectedVesselId, onVesselClick }: VesselMapProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100 hover:border-portnet-purple/20 transition-all duration-300">
      <h3 className="text-xl mb-6 text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>
        Carte de Surveillance en Direct
      </h3>

      <div className="relative bg-gradient-to-br from-[#E8F4F8] to-[#D4E8EE] rounded-2xl h-[500px] overflow-hidden border-2 border-gray-200">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(51, 42, 124, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(51, 42, 124, 0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>

        {/* ZONE QUAIS */}
        <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-gray-300/40 border-l-4 border-gray-400">
          <div className="text-center pt-6">
            <p className="text-lg text-gray-700" style={{ fontFamily: 'var(--font-display)' }}>ZONE QUAIS</p>
          </div>
          <div className="absolute right-8 top-[20%] space-y-6">
            {[1, 2, 3, 4, 5, 6].map(berth => (
              <div key={berth} className="w-20 h-14 bg-white/60 border-2 border-gray-400 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-sm text-gray-700" style={{ fontFamily: 'var(--font-display)' }}>Quai {berth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Water Zones */}
        <div className="absolute left-[8%] top-[20%] w-[20%] h-[30%] rounded-2xl bg-portnet-red/10 border-2 border-dashed border-portnet-red/40 flex items-center justify-center backdrop-blur-sm">
          <p className="text-sm text-portnet-red" style={{ fontFamily: 'var(--font-display)' }}>EN RADE</p>
        </div>

        <div className="absolute left-[35%] top-[35%] w-[25%] h-[30%] rounded-2xl bg-portnet-orange/10 border-2 border-dashed border-portnet-orange/40 flex items-center justify-center backdrop-blur-sm">
          <p className="text-sm text-portnet-orange" style={{ fontFamily: 'var(--font-display)' }}>AU PORT</p>
        </div>

        {/* Vessels */}
        {vessels.map((vessel, idx) => {
          let zoneX = vessel.x;
          let zoneY = vessel.y;

          if (vessel.status === 'in-roads') {
            const index = vessels.filter(v => v.status === 'in-roads').findIndex(v => v.id === vessel.id);
            zoneX = 15;
            zoneY = 25 + (index * 20);
          } else if (vessel.status === 'at-port') {
            zoneX = 45;
            zoneY = 50;
          } else if (vessel.status === 'at-quay') {
            const index = vessels.filter(v => v.status === 'at-quay').findIndex(v => v.id === vessel.id);
            zoneX = 78;
            zoneY = 25 + (index * 18);
          }

          const isSelected = selectedVesselId === vessel.id;

          return (
            <button
              key={vessel.id}
              onClick={() => onVesselClick(vessel)}
              className={cn(
                "absolute group cursor-pointer transition-all duration-300 hover:scale-125 z-10",
                isSelected && "scale-125 z-20"
              )}
              style={{
                left: `${zoneX}%`,
                top: `${zoneY}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${idx * 0.1}s`
              }}
            >
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 animate-pulse",
                    isSelected && "ring-4 ring-white shadow-2xl"
                  )}
                  style={{
                    backgroundColor: getStatusColor(vessel.status),
                    animationDelay: `${idx * 0.2}s`
                  }}
                >
                  <Ship className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="absolute w-14 h-14 rounded-full border-2 animate-ping opacity-40"
                  style={{
                    borderColor: getStatusColor(vessel.status),
                    top: '-7px',
                    left: '-7px',
                    animationDelay: `${idx * 0.2}s`
                  }}
                ></div>
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-gray-200">
          <div className="space-y-2 text-sm">
            {(['in-roads', 'at-port', 'at-quay'] as const).map(status => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(status) }}></div>
                <span className="text-gray-700">{getStatusLabel(status)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md border border-gray-300">
          <Eye className="w-5 h-5 text-portnet-purple" />
        </div>
      </div>
    </div>
  );
});

VesselMap.displayName = 'VesselMap';
