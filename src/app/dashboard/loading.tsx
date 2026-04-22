export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-portnet-purple to-[#4A3A9C] mb-8 shadow-2xl animate-pulse">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <h2 className="text-3xl text-portnet-purple mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Chargement du Dashboard...
        </h2>
        <p className="text-gray-500">Synchronisation des données portuaires en direct</p>
      </div>
    </div>
  );
}
