"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@/components/icons/HomeIcon";
import Image from "next/image";
import NovellaLogo from "../../public/icon.png";
import Link from "next/link";
import BookIcon from "./icons/BookIcon";
import IssueBookIcon from "./icons/IssueBookIcon";
import UnreturnedBookIcon from "./icons/UnreturnedBookIcon";
import UserIcon from "./icons/UserIcon";
import SignoutIcon from "./icons/SignoutIcon";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-toastify";

type NovellaSidebarLinkProps = {
  href: string;
  title: string;
  isActive?: boolean;
  children: React.ReactNode;
};
function NovellaSidebarLink({
  href,
  title,
  isActive = false,
  children,
}: NovellaSidebarLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Link
      onMouseOver={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      href={href}
      className={`relative bg-surface-100 h-12 w-12 flex justify-center items-center hover:bg-surface-200 hover:text-surface-800 text-surface-600 transition-all ${
        isActive ? "bg-surface-200 text-surface-800" : null
      }`}
    >
      {showTooltip ? (
        <span className="fixed bg-surface-100 px-3 py-2 text-xs left-[4.2rem] whitespace-nowrap inline-block border-[1px] border-surface-300 text-center z-40">
          {title}
        </span>
      ) : null}
      {children}
    </Link>
  );
}

type SignoutButtonLink = {
  children: React.ReactNode;
  onClick: () => void;
};

function SignoutButtonLink({ children, onClick }: SignoutButtonLink) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseOver={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative bg-surface-100 h-12 w-12 flex justify-center items-center hover:bg-surface-200 hover:text-surface-800 text-surface-600 transition-all"
    >
      {showTooltip ? (
        <span className="fixed bg-surface-100 px-3 py-2 text-xs left-[4.2rem] whitespace-nowrap inline-block border-[1px] border-surface-300 text-center z-40">
          Sign out
        </span>
      ) : null}
      {children}
    </button>
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
      {
        title: "Add book",
        href: "/dashboard/books",
        icon: <BookIcon size={20} />,
      },
      {
        title: "Issue book",
        href: "/dashboard/issued",
        icon: <IssueBookIcon size={20} />,
      },
      {
        title: "History",
        href: "/dashboard/issued/history",
        icon: <UnreturnedBookIcon size={20} />,
      },
    ],
  },
  {
    groupTitle: "Students",
    links: [
      {
        title: "Students",
        href: "/dashboard/students",
        icon: <UserIcon size={20} />,
      },
    ],
  },
];

export default function NovellaSidebar() {
  const pathname = usePathname();
  const nextRouter = useRouter();
  const signOut = trpc.auth.signOut.useMutation({
    onError: (_error) => {
      toast.error(`Cannot signout user: ${_error.message}`);
      throw new Error(_error.message);
    },
    onSuccess: () => {
      nextRouter.replace("/login");
    },
  });

  return (
    <div className="overflow-y-hidden bg-surface-100 w-[64px] border-r-[1px] border-surface-200 flex flex-col p-2 pb-5">
      <div className="bg-surface-100 h-12 w-12 flex justify-center items-center text-primary-500">
        <Image src={NovellaLogo} width={48} height={48} alt="Novella logo" />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-2 items-center">
          {links.map((linkGroup, groupIdx) => (
            <div key={linkGroup.groupTitle} className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                {linkGroup.links.map((link, idx) => (
                  <NovellaSidebarLink
                    key={idx}
                    title={link.title}
                    href={link.href}
                    isActive={pathname === link.href}
                  >
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
        <SignoutButtonLink onClick={() => signOut.mutate()}>
          <SignoutIcon size={20} />
        </SignoutButtonLink>
      </div>
    </div>
  );
}
