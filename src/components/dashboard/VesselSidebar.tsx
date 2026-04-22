'use client';

import React from 'react';
import { Ship, MapPin } from 'lucide-react';

interface Vessel {
  id: string;
  name: string;
  status: 'in-roads' | 'at-port' | 'at-quay';
  x: number;
  y: number;
}

interface VesselSidebarProps {
  selectedVessel: Vessel | undefined;
  onGoToDetails: (id: string) => void;
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

export const VesselSidebar = React.memo(({ selectedVessel, onGoToDetails }: VesselSidebarProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100 sticky top-8 min-h-[400px]">
      {selectedVessel ? (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${getStatusColor(selectedVessel.status)}20` }}>
              <Ship className="w-6 h-6" style={{ color: getStatusColor(selectedVessel.status) }} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>
                {selectedVessel.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getStatusColor(selectedVessel.status) }}></div>
                <span className="text-sm text-gray-500">{getStatusLabel(selectedVessel.status)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1">ETA</span>
              <span className="text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>17 Avr, 14:30</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1">Affectation Quai</span>
              <span className="text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>Quai 4-B</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1">Type de Cargo</span>
              <span className="text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>Conteneur</span>
            </div>
          </div>

          <button
            onClick={() => onGoToDetails(selectedVessel.id)}
            className="w-full py-3 bg-gradient-to-r from-portnet-purple to-[#4A3A9C] text-white rounded-2xl hover:shadow-xl hover:shadow-portnet-purple/30 transition-all duration-300"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Voir Détails Complets
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">Sélectionner un navire sur la carte</p>
        </div>
      )}
    </div>
  );
});

VesselSidebar.displayName = 'VesselSidebar';
