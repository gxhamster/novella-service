"use client";
import { Menu } from "@headlessui/react";
import UserIcon from "./icons/UserIcon";

const NovellaHeader = () => (
  <nav className="fixed top-0 left-0 w-screen bg-surface-100 px-6 items-center border-b-2 border-surface-200 flex justify-between m-0 h-[58px] text-surface-700">
    <span className="text-2xl text-surface-950">novella</span>
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 inline-flex justify-center items-center bg-surface-100 border-[1px] border-surface-500 hover:bg-surface-200 transition-all focus:ring-1 focus:ring-surface-900">
        <UserIcon size={20} />
      </Menu.Button>
      <Menu.Items className="absolute right-0 origin-top-right mt-2 bg-surface-100 border-[1px] border-surface-300  w-56 p-3 flex flex-col text-sm">
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${
                active && "bg-surface-200"
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
              Account settings
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${
                active && "bg-surface-200"
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  </nav>
);

export default NovellaHeader;
