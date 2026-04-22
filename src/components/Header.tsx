'use client';

import { useState } from 'react';
import { Ship, ChevronDown, ChevronRight, LogOut, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  breadcrumbs?: { label: string; onClick?: () => void }[];
  showBack?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
}

export function Header({ breadcrumbs, showBack, onBack, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {showBack && onBack && (
                <button
                  onClick={onBack}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-[#332A7C]" />
                </button>
              )}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#332A7C] to-[#4A3A9C] flex items-center justify-center shadow-lg">
                <Ship className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-2xl text-[#332A7C] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  PORTNET
                </h1>
              </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {crumb.onClick ? (
                      <button
                        onClick={crumb.onClick}
                        className="text-gray-500 hover:text-[#332A7C] transition-colors"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className={idx === breadcrumbs.length - 1 ? "text-[#332A7C]" : "text-gray-500"} style={{ fontFamily: 'var(--font-display)' }}>
                        {crumb.label}
                      </span>
                    )}
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-[#332A7C]/30 transition-all"
            >
              <div className="text-right">
                <p className="text-sm text-[#332A7C]" style={{ fontFamily: 'var(--font-display)' }}>AGENT #61150</p>
                <p className="text-xs text-gray-500">Consignataire Sud</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#332A7C] flex items-center justify-center">
                <span className="text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>AM</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-[fadeInDown_0.2s_ease-out] z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#EF4444]" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
