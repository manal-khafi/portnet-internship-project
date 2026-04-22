'use client';

import { useState } from 'react';
import { Ship, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue lors de la connexion.');
        setIsLoading(false);
        return;
      }

      // Success
      onLogin();
    } catch (err) {
      console.error('Login error:', err);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0F0F1E] via-[#1A1A2E] to-[#332A7C]">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(201, 169, 97, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(201, 169, 97, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#332A7C] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A961] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and header */}
          <div className="text-center mb-12 animate-[fadeInDown_0.6s_ease-out]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#332A7C] to-[#4A3A9C] mb-6 shadow-2xl shadow-[#332A7C]/50">
              <Ship className="w-10 h-10 text-[#C9A961]" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl mb-3 text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              PORTNET
            </h1>
            <p className="text-gray-400 text-lg">Système de Gestion Portuaire</p>
          </div>

          {/* Login card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            <h2 className="text-2xl mb-2 text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>
              Connexion
            </h2>
            <p className="text-gray-500 mb-8">Accéder au centre de commande</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm animate-[shake_0.4s_ease-in-out]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>
                  Adresse Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#332A7C] focus:bg-white focus:outline-none transition-all duration-300"
                    placeholder="admin@portnet.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-[#1A1A2E]" style={{ fontFamily: 'var(--font-display)' }}>
                  Mot de Passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#332A7C] focus:bg-white focus:outline-none transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#332A7C] to-[#4A3A9C] text-white rounded-2xl hover:shadow-2xl hover:shadow-[#332A7C]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="relative z-10">
                  {isLoading ? 'Authentification...' : 'Se Connecter'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961] to-[#D4B97A] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Plateforme sécurisée d'opérations maritimes
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
