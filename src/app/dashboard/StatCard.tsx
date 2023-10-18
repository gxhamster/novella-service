import NButtonLink from "@/components/NButtonLink";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";

type StatCardProps = {
  title: string;
  subtitle: string;
  stat: number | null;
  href: string;
  children: React.ReactNode;
};
export default function StatCard({
  title,
  subtitle,
  stat,
  href = "#",
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
      <div className="flex justify-between items-end">
        {stat ? (
          <span className="text-6xl text-surface-950 mt-6">{stat}</span>
        ) : (
          0
        )}
        <NButtonLink
          kind="default"
          href={href}
          className="hover:translate-x-2 transition-transform text-surface-500 hover:text-surface-800"
          icon={<LeftArrowIcon />}
        />
      </div>
    </div>
  );
}
