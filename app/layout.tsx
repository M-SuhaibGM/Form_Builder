import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FormBuilder - Create beautiful forms, effortlessly",
    template: "%s | FormBuilder",
  },
  description:
    "Build forms with drag and drop, collect responses and file uploads, and export everything to CSV. All in one place.",
  applicationName: "FormBuilder",
  keywords: ["form builder", "online forms", "surveys", "file upload forms", "collect responses"],
  openGraph: {
    type: "website",
    siteName: "FormBuilder",
    title: "FormBuilder - Create beautiful forms, effortlessly",
    description: "Build forms, collect responses and files, and export everything in one place.",
  },
  twitter: {
    card: "summary",
    title: "FormBuilder",
    description: "Build forms, collect responses and files, and export everything in one place.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}