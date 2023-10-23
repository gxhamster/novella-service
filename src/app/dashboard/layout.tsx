"use client";
import NovellaHeader from "@/components/NovellaHeader";
import NovellaSidebar from "@/components/NovellaSidebar";
import ToastProvider from "@/components/NToast/ToastProvider";
import NButtonLink from "@/components/NButtonLink";
import AddIcon from "@/components/icons/AddIcon";
import NButton from "@/components/NButton";
import RefreshIcon from "@/components/icons/RefreshIcon";
import { useRouter } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
  statistics: React.ReactNode;
  recently: React.ReactNode;
};

export default function DashboardLayout({
  children,
  statistics,
  recently,
}: DashboardLayoutProps) {
  const nextRouter = useRouter();

  return (
    <>
      <ToastProvider />
      <div className="bg-surface-100 text-white flex overflow-y-hidden h-screen max-h-screen">
        <NovellaSidebar />
        <section className="flex flex-col flex-1 w-full overflow-x-hidden">
          <NovellaHeader />
          <main className="overflow-y-auto flex-1 max-h-screen">
            {/* Content Starts Here */}
            <div className="my-16 mx-auto px-16 w-full flex flex-col text-surface-900 gap-y-3">
              <section className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-3xl">Dashboard</span>
                  <span className="text-md text-surface-600 font-light mt-1">
                    View manage your library
                  </span>
                </div>
                <div className="flex gap-2">
                  <NButton
                    onClick={() => nextRouter.refresh()}
                    icon={
                      <RefreshIcon
                        className="text-surface-600 group-hover:text-surface-900"
                        size={18}
                      />
                    }
                    kind="ghost"
                  />
                  <NButtonLink
                    href="/issued"
                    kind="primary"
                    title="Issue book"
                    size="normal"
                    icon={<AddIcon size={20} />}
                  />
                </div>
              </section>
              {statistics}
              {recently}
              {children}
            </div>
          </main>
        </section>
      </div>
    </>
  );
}
