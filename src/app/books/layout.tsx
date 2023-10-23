"use client";
import NovellaHeader from "@/components/NovellaHeader";
import NovellaSidebar from "@/components/NovellaSidebar";
import ToastProvider from "@/components/NToast/ToastProvider";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <ToastProvider />
      <div className="bg-surface-100 text-white flex overflow-y-hidden h-screen max-h-screen">
        <NovellaSidebar />
        <section className="flex flex-col flex-1 w-full overflow-x-hidden">
          <NovellaHeader />
          <main className="overflow-y-auto flex-1 max-h-screen">
            {children}
          </main>
        </section>
      </div>
    </>
  );
}
