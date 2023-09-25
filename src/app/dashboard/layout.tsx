import NovellaHeader from "@/components/NovellaHeader";
import NovellaSidebar from "@/components/NovellaSidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-surface-100 min-h-screen text-white relative">
      <NovellaHeader />
      <NovellaSidebar />
      <main className="fixed top-[58px] left-[64px] h-[calc(100%-58px)] pb-8 w-[calc(100%-64px)] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
