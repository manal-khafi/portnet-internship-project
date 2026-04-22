import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  icon: ReactNode;
  badge?: string;
  badgeColor?: string;
  data: { label: string; value: string }[];
}

export function StatsCard({ title, icon, badge, badgeColor = 'gray', data }: StatsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100 hover:border-portnet-purple/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-portnet-purple to-[#4A3A9C] flex items-center justify-center">
          {icon}
        </div>
        {badge && (
          <span className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-display)' }}>
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg mb-4 text-portnet-purple" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {data.map((item, idx) => (
          <div key={idx}>
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className="text-base text-portnet-navy" style={{ fontFamily: 'var(--font-display)' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
