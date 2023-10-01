type StatCardProps = {
  title: string;
  subtitle: string;
  stat: number;
  children: React.ReactNode;
};
export default function StatCard({
  title,
  subtitle,
  stat,
  children,
}: StatCardProps) {
  return (
    <div className="bg-surface-200 w-72 min-w-[18rem] shadow-sm shadow-surface-200 py-4 px-6 flex flex-col gap-1">
      <div className="flex flex-col h-16 gap-1 text-xl">
        <div className="flex items-center gap-4">
          {children}
          <span className="text-surface-800 text-xl">{title}</span>
        </div>
        <span className="text-surface-700 text-sm">{subtitle}</span>
      </div>
      <span className="text-5xl text-surface-950 font-bold mt-6">{stat}</span>
    </div>
  );
}
