"use client";
import ToastProvider from "@/components/ToastProvider";

type LoginLayoutProps = {
  children: React.ReactNode;
};

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <main className="flex min-h-screen bg-surface-100 text-white">
      <ToastProvider />
      {children}
    </main>
  );
}
