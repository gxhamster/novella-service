import NovellaHeader from "@/components/NovellaHeader";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function BookLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-surface-100 min-h-screen text-white relative">
      <NovellaHeader />
      <main className="fixed top-[58px] h-full overflow-y-auto pb-[8rem] w-full">
        {children}
      </main>
    </div>
  );
}
