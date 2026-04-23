'use client';

import { useState, useEffect } from 'react';
import { Ship, ChevronDown, ChevronRight, LogOut, ArrowLeft } from 'lucide-react';

interface UserSession {
  fullName: string;
  department: string;
  role: string;
}

interface HeaderProps {
  breadcrumbs?: { label: string; onClick?: () => void }[];
  showBack?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
}

export function Header({ breadcrumbs, showBack, onBack, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        console.log('Session Data:', data);
        
        if (res.ok) {
          setUser({
            fullName: data.fullName || data.name || 'Utilisateur',
            department: data.department || 'Consignataire',
            role: data.role || 'agent'
          });
        } else {
          console.error('Session API Error:', data.error);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
      }
    }
    fetchSession();
  }, []);

  const getInitials = (name: string) => {
    if (!name || name === 'Utilisateur' || name === '--') return 'UN';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'UN';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm relative z-50">
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
                <h1 className="text-2xl font-bold text-[#332A7C] tracking-tight">
                  PORTNET
                </h1>
              </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 text-sm ml-4">
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
                      <span className={idx === breadcrumbs.length - 1 ? "text-[#332A7C] font-semibold" : "text-gray-500"}>
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

          {/* User Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-[#332A7C]/30 transition-all shadow-sm"
            >
              {user ? (
                <div className="text-right flex flex-col justify-center">
                  <p className="text-sm font-bold text-[#332A7C] uppercase leading-none mb-1">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {user.role === 'admin' ? 'Administrateur' : user.department}
                  </p>
                </div>
              ) : (
                <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-lg" />
              )}
              
              <div className="w-10 h-10 rounded-full bg-[#332A7C] flex items-center justify-center shadow-md ml-1">
                <span className="text-white text-sm font-bold">
                  {user ? getInitials(user.fullName) : '--'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-[fadeInDown_0.2s_ease-out]">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#1A1A2E] hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
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