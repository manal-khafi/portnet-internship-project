'use client';

import { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Avatar } from '../atoms/Avatar';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  agentId: string;
  department: string;
  initials: string;
  onLogout?: () => void;
}

export function UserMenu({ agentId, department, initials, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 bg-white px-4 py-2 rounded-xl',
          'border-2 border-gray-200 hover:border-portnet-purple/30',
          'transition-all'
        )}
      >
        <div className="text-right">
          <p className="text-sm text-portnet-purple font-display">{agentId}</p>
          <p className="text-xs text-gray-500">{department}</p>
        </div>
        <Avatar initials={initials} size="md" />
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-56',
            'bg-white border-2 border-gray-200 rounded-xl shadow-xl',
            'overflow-hidden animate-[fadeInDown_0.2s_ease-out] z-50'
          )}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3',
              'text-gray-900 hover:bg-gray-50 transition-colors'
            )}
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Déconnexion</span>
          </button>
        </div>
      )}
    </div>
  );
}
