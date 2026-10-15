import Link from "next/link";
import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <span>© {new Date().getFullYear()} FormBuilder. All rights reserved.</span>
        </div>
        <div className="flex gap-5">
          <Link href="/" className="hover:text-gray-900">My Forms</Link>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
        </div>
      </div>
    </footer>
  );
}