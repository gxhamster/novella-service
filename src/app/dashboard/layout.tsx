"use client";
import NovellaHeader from "@/components/NovellaHeader";
import NovellaSidebar from "@/components/NovellaSidebar";
import ToastProvider from "@/components/NToast/ToastProvider";
import NButtonLink from "@/components/NButtonLink";
import AddIcon from "@/components/icons/AddIcon";
import NButton from "@/components/NButton";
import RefreshIcon from "@/components/icons/RefreshIcon";
import { useRouter } from "next/navigation";
import { SkeletonTheme } from "react-loading-skeleton";

type DashboardLayoutProps = {
  children: React.ReactNode;
  statistics: React.ReactNode;
  popular: React.ReactNode;
  recently: React.ReactNode;
  issuetrends: React.ReactNode;
};

function DashboardHeader() {
  const nextRouter = useRouter();
  return (
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
  );
}

export default function DashboardLayout({
  children,
  statistics,
  popular,
  recently,
  issuetrends,
}: DashboardLayoutProps) {
  return (
    <>
      <ToastProvider />
      <div className="bg-surface-100 text-white flex overflow-y-hidden h-screen max-h-screen">
        <NovellaSidebar />
        <section className="flex flex-col flex-1 w-full overflow-x-hidden">
          <NovellaHeader />
          <main className="overflow-y-auto flex-1 max-h-screen">
            {/* Content Starts Here */}
            <SkeletonTheme baseColor="#202020" highlightColor="#262626">
              <div className="my-16 mx-auto px-16 w-full flex flex-col text-surface-900 gap-y-3">
                <DashboardHeader />

                <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-8">
                  {statistics}
                  {popular}
                  {issuetrends}
                </div>
                {recently}
                {children}
              </div>
            </SkeletonTheme>
          </main>
        </section>
      </div>
    </>
  );
}
