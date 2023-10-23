type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-surface-200 shadow-lg shadow-surface-100 py-4 px-6 flex flex-col gap-1 hover:bg-primary-500 group hover:text-surface-900 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
