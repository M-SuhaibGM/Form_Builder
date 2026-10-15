import Link from "next/link";
import { FileText, LayoutDashboard, ShieldCheck, ScrollText, Home } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "My Forms", icon: LayoutDashboard },
  { href: "/privacy", label: "Privacy", icon: ShieldCheck },
  { href: "/terms", label: "Terms", icon: ScrollText },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          {/* Brand */}
          <div className="flex max-w-xs flex-col items-center gap-3 text-center md:items-start md:text-left">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/25">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-gray-900">
                Form<span className="text-blue-600">Builder</span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-500">
              Build forms, collect responses and files, and export everything in one place.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                <Icon className="h-4 w-4 text-gray-400 transition group-hover:text-blue-600" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-6 text-xs text-gray-400 sm:flex-row">
          <p>© 2026 FormBuilder. All rights reserved.</p>
          <p>Built for your ideas.</p>
        </div>
      </div>
    </footer>
  );
}