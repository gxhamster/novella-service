import NovellaHeader from "@/components/NovellaHeader";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-surface-100 min-h-screen text-white overflow-y-scroll mb-5">
      <NovellaHeader />
      <main className="pt-[58px]">{children}</main>
    </div>
  );
}
