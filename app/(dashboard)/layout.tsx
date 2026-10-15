import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<p className="p-8">Loading...</p>}>
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </Suspense>
    </div>
  );
}