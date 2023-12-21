"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import NovellaLogo from "../../public/icon.png";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import classes from "./NovellaSidebar.module.css";
import {
  Center,
  Stack,
  Tooltip,
  UnstyledButton,
  rem,
  Button,
  Text,
  Group,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import HomeIcon from "@/components/icons/HomeIcon";
import BookIcon from "./icons/BookIcon";
import IssueBookIcon from "./icons/IssueBookIcon";
import UnreturnedBookIcon from "./icons/UnreturnedBookIcon";
import UserIcon from "./icons/UserIcon";
import SchoolIcon from "./icons/SchoolIcon";
import SignoutIcon from "./icons/SignoutIcon";
import { Toast } from "./Toast";

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
    links: [{ title: "Home", href: "/dashboard", icon: HomeIcon }],
  },
  {
    groupTitle: "Books",
    links: [
      {
        title: "Issue book",
        href: "/issued",
        icon: IssueBookIcon,
      },
      {
        title: "Books",
        href: "/books",
        icon: BookIcon,
      },
      {
        title: "History",
        href: "/issued/history",
        icon: UnreturnedBookIcon,
      },
    ],
  },
  {
    groupTitle: "Students",
    links: [
      {
        title: "Students",
        href: "/students",
        icon: UserIcon,
      },
      {
        title: "Start Academic Year",
        href: "/students/nextyear",
        icon: SchoolIcon,
      },
    ],
  },
];

function NavbarLink({
  icon: Icon,
  label,
  href,
  active,
  onClick,
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

interface NavbarLinkProps {
  icon: any;
  href: string;
  label: string;
  active?: boolean;
  onClick?(): void;
}

export default function NovellaSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const signOut = trpc.auth.signOut.useMutation({
    onError: (_error) => {
      Toast.Error({ title: "Cannot signout user", message: _error.message });
      throw new Error(_error.message);
    },
    onSuccess: () => {
      router.replace("/login");
    },
  });

  const sidebarLinks = links.map((group) => (
    <Stack
      key={group.groupTitle}
      justify="center"
      gap={10}
      className="border-b-[1px] border-dark-4 py-2"
    >
      {group.links.map((link) => (
        <NavbarLink
          key={link.title}
          icon={link.icon}
          label={link.title}
          href={link.href}
          active={link.href === pathname}
          onClick={() => {
            router.push(link.href);
          }}
        />
      ))}
    </Stack>
  ));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Signout from novella"
        centered
      >
        <Stack gap={20}>
          <Text size="md" c="dark.2">
            Are you sure you want to logout from novella? Be sure to save all
            your pending works before quitting.
          </Text>
          <Group gap={15} justify="end">
            <Button variant="default" size="md" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              loading={signOut.isLoading}
              size="md"
              onClick={() => signOut.mutate()}
            >
              Logout
            </Button>
          </Group>
        </Stack>
      </Modal>
      <nav className={classes.navbar}>
        <Center>
          <Link href="/dashboard">
            <Image
              src={NovellaLogo}
              width={60}
              height={60}
              alt="Novella logo"
            />
          </Link>
        </Center>

        <div className={classes.navbarMain}>{sidebarLinks}</div>

        <Stack justify="center" gap={0}>
          <NavbarLink
            icon={SignoutIcon}
            label="Logout"
            href="#"
            onClick={open}
          />
        </Stack>
      </nav>
    </>
  );
}
