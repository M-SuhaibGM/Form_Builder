"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublicForm = pathname.startsWith("/f/") || pathname === "/login";
  const isBuilder = pathname.startsWith("/builder");

  return (
    <div className="flex min-h-screen flex-col">
      {!isPublicForm && <Navbar />}
      <div className="flex flex-1 flex-col">{children}</div>
      {!isPublicForm && !isBuilder && <Footer />}
    </div>
  );
}