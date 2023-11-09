type DashboardCardProps = {
  children: React.ReactNode;
  showHoverEffect?: boolean;
  className?: string;
};

export default function DashboardCard({
  children,
  showHoverEffect = true,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-surface-200 shadow-lg shadow-surface-100 py-4 px-6 flex flex-col gap-1 ${
        showHoverEffect
          ? "hover:bg-primary-500 group hover:text-surface-900 transition-colors"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
