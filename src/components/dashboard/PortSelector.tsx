'use client';

import { ChevronDown } from 'lucide-react';
import React from 'react';

interface Port {
  id: string;
  name: string;
}

interface PortSelectorProps {
  ports: Port[];
  selectedPort: string;
  onPortChange: (id: string) => void;
}

export const PortSelector = React.memo(({ ports, selectedPort, onPortChange }: PortSelectorProps) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="relative">
        <select
          value={selectedPort}
          onChange={(e) => onPortChange(e.target.value)}
          className="appearance-none bg-white text-portnet-purple pl-4 pr-10 py-2 rounded-xl border-2 border-gray-200 hover:border-portnet-purple/30 focus:border-portnet-purple focus:outline-none transition-all cursor-pointer"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {ports.map(port => (
            <option key={port.id} value={port.id}>{port.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-portnet-purple pointer-events-none" />
      </div>
    </div>
  );
});

PortSelector.displayName = 'PortSelector';
