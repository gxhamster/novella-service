"use client";
import NovellaHeader from "@/components/NovellaHeader";
import NovellaSidebar from "@/components/NovellaSidebar";
import AddIcon from "@/components/icons/AddIcon";
import { Button } from "@mantine/core";
import RefreshIcon from "@/components/icons/RefreshIcon";
import { useRouter } from "next/navigation";

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
        <Button variant="subtle" size="md" onClick={() => nextRouter.refresh()}>
          <RefreshIcon size={20} className="text-dark-1" />
        </Button>
        <Button
          variant="filled"
          color="blue"
          size="md"
          rightSection={<AddIcon size={20} />}
          onClick={() => nextRouter.push("/issued")}
        >
          Issue Book
        </Button>
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
      <div className="bg-dark-8 text-white flex overflow-y-hidden h-screen max-h-screen">
        <NovellaSidebar />
        <section className="flex flex-col flex-1 w-full overflow-x-hidden">
          <NovellaHeader />
          <main className="overflow-y-auto flex-1 max-h-screen">
            {/* Content Starts Here */}
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
          </main>
        </section>
      </div>
    </>
  );
}
