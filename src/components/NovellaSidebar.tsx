"use client";
import HomeIcon from "@/components/icons/HomeIcon";
import Image from "next/image";
import NovellaLogo from "../../public/icon.png";
import Link from "next/link";
import BookIcon from "./icons/BookIcon";
import IssueBookIcon from "./icons/IssueBookIcon";
import UnreturnedBookIcon from "./icons/UnreturnedBookIcon";
import { useState } from "react";
import UserIcon from "./icons/UserIcon";

type NovellaSidebarLinkProps = {
  href: string;
  title: string;
  children: React.ReactNode;
};
function NovellaSidebarLink({
  href,
  title,
  children,
}: NovellaSidebarLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Link
      onMouseOver={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      href={href}
      className={`relative bg-surface-100 h-12 w-12 flex justify-center items-center hover:bg-surface-200 hover:text-surface-800 text-surface-600 transition-all `}
    >
      {showTooltip ? (
        <span className="absolute bg-surface-100 px-3 py-2 text-xs left-full ml-3   whitespace-nowrap inline-block border-[1px] border-surface-300 text-center">
          {title}
        </span>
      ) : null}
      {children}
    </Link>
  );
}

const links = [
  {
    groupTitle: "Home",
    links: [
      { title: "Home", href: "/dashboard", icon: <HomeIcon size={20} /> },
    ],
  },
  {
    groupTitle: "Books",
    links: [
      { title: "Add book", href: "/books", icon: <BookIcon size={20} /> },
      {
        title: "Issue book",
        href: "/issued",
        icon: <IssueBookIcon size={20} />,
      },
      {
        title: "Unreturned book",
        href: "/books",
        icon: <UnreturnedBookIcon size={20} />,
      },
    ],
  },
  {
    groupTitle: "Students",
    links: [
      { title: "Students", href: "/students", icon: <UserIcon size={20} /> },
    ],
  },
];

export default function NovellaSidebar() {
  return (
    <div className="fixed top-0 min-h-screen bg-surface-100 w-[64px] border-r-[1px] border-surface-200 flex flex-col p-2 items-center gap-2 z-10">
      <div className="bg-surface-100 h-12 w-12 flex justify-center items-center text-primary-500">
        <Image src={NovellaLogo} width={48} height={48} alt="Novella logo" />
      </div>
      {links.map((linkGroup, groupIdx) => (
        <div key={linkGroup.groupTitle} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {linkGroup.links.map((link, idx) => (
              <NovellaSidebarLink key={idx} title={link.title} href={link.href}>
                {link.icon}
              </NovellaSidebarLink>
            ))}
          </div>

          {groupIdx !== links.length - 1 ? (
            <span className="border-[0.7px] border-surface-300 w-full"></span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
