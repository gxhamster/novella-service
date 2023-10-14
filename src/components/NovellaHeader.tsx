"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import UserIcon from "./icons/UserIcon";

type NovellaHeaderMenuItemProps = {
  title: string;
};
const NovellaHeaderMenuItem = ({ title }: NovellaHeaderMenuItemProps) => (
  <Menu.Item>
    {({ active }) => (
      <a
        className={`${
          active && "bg-surface-300"
        } p-2 rounded-md inline-flex gap-2`}
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        {title}
      </a>
    )}
  </Menu.Item>
);

const novellaHeaderMenuItems = ["Account Settings", "Log Out"];

const NovellaHeader = () => (
  <nav className="bg-surface-100 px-6 items-center border-b-[1px] border-surface-300 flex justify-between m-0 h-14 max-h-[56px] text-surface-700">
    <Link href="/dashboard">
      <span className="text-2xl text-surface-950">novella</span>
    </Link>
    <Menu as="div" className="relative z-20">
      <Menu.Button className="py-2 px-3 inline-flex text-sm gap-2 justify-center items-center text-surface-700 bg-surface-100 hover:bg-surface-200 transition-all border-[1px] border-surface-100 focus:border-surface-900 disabled:bg-surface-100 disabled:opacity-60 outline-none">
        <UserIcon size={20} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 origin-top-right mt-2 bg-surface-200 border-[1px] border-surface-300  w-56 p-3 flex flex-col text-sm shadow-2xl shadow-surface-100">
          {novellaHeaderMenuItems.map((item) => (
            <NovellaHeaderMenuItem key={item} title={item} />
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  </nav>
);

export default NovellaHeader;
