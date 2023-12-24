"use client";
import Link from "next/link";
import GlobalSearch from "./GlobalSearch/GlobalSearch";

const NovellaHeader = () => (
  <nav className="bg-dark-7 px-6 items-center border-b-[1px] border-dark-4 flex justify-between m-0 h-14 max-h-[56px] text-surface-700">
    <Link href="/dashboard">
      <span className="text-2xl text-surface-950">novella</span>
    </Link>
    <section className="flex gap-10 items-center h-full">
      <GlobalSearch />
    </section>
  </nav>
);

export default NovellaHeader;
