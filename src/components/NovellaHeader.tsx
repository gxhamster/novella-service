"use client";
import { Fragment } from "react";
import Link from "next/link";
import NGlobalSearch from "./NGlobalSearch/NGlobalSearch";

const NovellaHeader = () => (
  <nav className="bg-surface-100 px-6 items-center border-b-[1px] border-surface-300 flex justify-between m-0 h-14 max-h-[56px] text-surface-700">
    <Link href="/dashboard">
      <span className="text-2xl text-surface-950">novella</span>
    </Link>
    <section className="flex gap-10 items-center h-full">
      <NGlobalSearch />
    </section>
  </nav>
);

export default NovellaHeader;
