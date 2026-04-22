'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border-2 border-red-100 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl text-portnet-purple mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Une erreur est survenue
        </h2>
        <p className="text-gray-500 mb-8">
          Impossible de charger les données du port. Veuillez réessayer ou contacter l'assistance.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-4 bg-portnet-purple text-white rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl transition-all"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <RefreshCw className="w-5 h-5" />
          Réessayer la Connexion
        </button>
      </div>
    </div>
  );
}
