"use client";
import NovellaHeader from "@/components/NovellaHeader";
import NovellaSidebar from "@/components/NovellaSidebar";

type StudentLayout = {
  children: React.ReactNode;
};

export default function StudentLayout({ children }: StudentLayout) {
  return (
    <div className="bg-dark-8 text-white flex overflow-y-hidden h-screen max-h-screen">
      <NovellaSidebar />
      <section className="flex flex-col flex-1 w-full overflow-x-hidden">
        <NovellaHeader />
        <main className="overflow-y-auto flex-1 max-h-screen">{children}</main>
      </section>
    </div>
  );
}
