import NovellaHeader from "@/components/NovellaHeader";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function Books({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-surface-100 min-h-screen text-white relative">
      <NovellaHeader />
      <main className="fixed top-[58px] h-full overflow-hidden w-full">
        {children}
      </main>
    </div>
  );
}
