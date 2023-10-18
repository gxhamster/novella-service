type StatCardProps = {
  title: string;
  subtitle: string;
  stat: number | null;
  children: React.ReactNode;
};
export default function StatCard({
  title,
  subtitle,
  stat,
  children,
}: StatCardProps) {
  return (
    <div className="bg-surface-200 shadow-sm shadow-surface-200 py-4 px-6 flex flex-col gap-1">
      <div className="flex flex-col h-16 gap-1 text-xl">
        <div className="flex items-center gap-4">
          {children}
          <span className="text-surface-800 text-xl">{title}</span>
        </div>
        <span className="text-surface-700 text-sm">{subtitle}</span>
      </div>
      {stat ? (
        <span className="text-6xl text-surface-950 mt-6">{stat}</span>
      ) : (
        0
      )}
    </div>
  );
}
