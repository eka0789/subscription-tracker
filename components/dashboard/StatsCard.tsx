interface StatsCardProps {
  title: string;
  value: number | string;
  colorClass: string;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, colorClass, icon }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 border-l-4 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-gray-300">{icon}</div>}
      </div>
    </div>
  );
}
