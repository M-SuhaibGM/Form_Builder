"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileText,
  Layers3,
  LayoutTemplate,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MousePointer2,
  Palette,
  Play,
  ShieldCheck,
  Sparkles,
  Zap,
  ChartNoAxesCombined,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: LayoutTemplate,
    title: "Beautiful form templates",
    description:
      "Start with a clean layout and create forms for almost any purpose.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MousePointer2,
    title: "Effortless form building",
    description:
      "Build organized forms with a simple, intuitive form creation experience.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Understand your responses",
    description:
      "Keep your collected information organized and ready to review.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Designed with security in mind",
    description:
      "Sign in securely and manage your forms from your own workspace.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Layers3,
    title: "Everything in one place",
    description:
      "Keep your forms organized instead of managing scattered documents.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: Zap,
    title: "A smoother workflow",
    description:
      "Spend less time organizing questions and more time using the results.",
    color: "bg-amber-50 text-amber-600",
  },
];

const useCases = [
  {
    icon: Users,
    title: "Customer feedback",
    description: "Learn what your customers think about your products.",
  },
  {
    icon: FileText,
    title: "Registration forms",
    description: "Collect information for events, programs, and signups.",
  },
  {
    icon: MessageSquareText,
    title: "Surveys & research",
    description: "Ask questions and gather useful responses.",
  },
];

const faqs = [
  {
    question: "What is FormBuilder?",
    answer:
      "FormBuilder helps you create, organize, and manage forms in one workspace.",
  },
  {
    question: "How do I get started?",
    answer:
      "Click Get Started or Sign In and continue with your Google account. Once authenticated, you can access your application.",
  },
  {
    question: "What can I create with FormBuilder?",
    answer:
      "You can use your form builder for contact forms, surveys, registrations, feedback, and other information collection needs supported by your application.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation is needed to use the web application. Open it in your browser and sign in.",
  },
];

function Brand() {
  return (
    <Link href="/" className="group flex w-fit items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:rotate-3">
        <FileText className="h-5 w-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-slate-900">
        Form<span className="text-blue-600">Builder</span>
      </span>
    </Link>
  );
}

function FormPreview() {
  const [selected, setSelected] = useState("email");
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[570px]">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-blue-300/40 via-indigo-200/30 to-violet-300/40 blur-3xl" />

      <div className="absolute -right-5 top-12 hidden h-20 w-20 rounded-2xl border border-white/80 bg-white/80 shadow-xl backdrop-blur-md sm:flex sm:items-center sm:justify-center">
        <Palette className="h-8 w-8 text-violet-500" />
      </div>

      <div className="absolute -left-7 bottom-24 hidden h-16 w-16 rounded-2xl border border-white/80 bg-white/90 shadow-xl sm:flex sm:items-center sm:justify-center">
        <Sparkles className="h-7 w-7 text-blue-500" />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Customer Feedback
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Form preview
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Preview
          </span>
        </div>

        <div className="grid min-h-[370px] sm:grid-cols-[155px_1fr]">
          <aside className="hidden border-r border-slate-100 bg-slate-50/80 p-4 sm:block">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Form elements
            </p>

            {[
              { icon: FileText, label: "Text field" },
              { icon: MessageSquareText, label: "Long answer" },
              { icon: CheckCircle2, label: "Multiple choice" },
              { icon: LayoutTemplate, label: "Dropdown" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white px-2 py-2.5 text-[11px] font-medium text-slate-600"
              >
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {label}
              </div>
            ))}

            <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-3 text-white">
              <Sparkles className="mb-3 h-4 w-4" />
              <p className="text-xs font-bold">Make it yours</p>
              <p className="mt-1 text-[10px] leading-4 text-blue-100">
                Create a form that fits your needs.
              </p>
            </div>
          </aside>

          <div className="p-5 sm:p-6">
            <div className="mb-5">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                <Sparkles className="h-3 w-3" />
                YOUR FORM
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                We value your feedback
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Tell us about your experience. Your feedback helps us improve.
              </p>
            </div>

            {showSuccess ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-slate-800">Demo submitted!</h4>
                <p className="mt-2 text-xs text-slate-500">
                  This is a local preview, not a saved response.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    What is your name?
                  </label>
                  <input
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Your email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    How was your experience?
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {["Excellent", "Good", "Average"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelected(option)}
                        className={`rounded-lg border px-2.5 py-2 text-[10px] font-medium transition sm:px-3 ${selected === option
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                            : "border-slate-200 text-slate-500 hover:border-blue-200"
                          }`}
                      >
                        {selected === option && (
                          <Check className="mr-1 inline h-3 w-3" />
                        )}
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSuccess(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Submit preview
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <LockKeyhole className="h-3 w-3 text-emerald-600" />
            Form preview
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Interactive demo
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Brand />

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How it works
            </a>
            <a
              href="#use-cases"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Use cases
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              FAQs
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white p-5 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {[
                ["Features", "#features"],
                ["How it works", "#how-it-works"],
                ["Use cases", "#use-cases"],
                ["FAQs", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/login"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative isolate px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white" />
        <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/30 blur-[110px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm sm:text-sm">
              <Sparkles className="h-4 w-4" />
              A simpler way to collect information
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-[68px]">
              Great forms.
              <span className="mt-2 block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text pb-2 text-transparent">
                Meaningful insights.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0">
              Create beautiful forms, gather responses, and keep everything
              organized with a form builder designed to make your work easier.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl"
              >
                Start Building for Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <Play className="h-4 w-4 fill-current" />
                See How It Works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-500 sm:text-sm lg:justify-start">
              {[
                "Easy to use",
                "Google sign-in",
                "Organized workspace",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <FormPreview />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y border-slate-100 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Everything starts with a question
          </span>
          <div className="hidden h-5 w-px bg-slate-200 sm:block" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Create
            </span>
            <ArrowRight className="hidden h-4 w-4 text-slate-300 sm:block" />
            <span className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-violet-600" />
              Collect
            </span>
            <ArrowRight className="hidden h-4 w-4 text-slate-300 sm:block" />
            <span className="flex items-center gap-2">
              <ChartNoAxesCombined className="h-4 w-4 text-emerald-600" />
              Understand
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Features
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to
              <span className="text-blue-600"> build better forms.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg">
              A clean workspace to create forms, organize your work, and
              collect the information that matters.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color }, i) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.05] sm:p-7"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Built for better workflows
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-slate-50 px-5 py-24 sm:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              How it works
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              From a blank page to a form, in a few steps.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
              Get started with a straightforward workflow that helps you move
              from an idea to an organized form.
            </p>

            <div className="mt-9 space-y-7">
              {[
                {
                  number: "01",
                  title: "Sign in to your workspace",
                  description:
                    "Use your Google account to access your FormBuilder workspace.",
                },
                {
                  number: "02",
                  title: "Create your form",
                  description:
                    "Give your form a name and add the questions you need.",
                },
                {
                  number: "03",
                  title: "Collect and manage responses",
                  description:
                    "Use the response management features available in your application to review submissions.",
                },
              ].map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-sm font-extrabold text-blue-600 shadow-sm">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-bold">Your workspace</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Keep your forms organized
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Layers3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <p className="mt-4 text-xs text-slate-500">Your forms</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Organized
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <ChartNoAxesCombined className="h-5 w-5 text-violet-600" />
                  <p className="mt-4 text-xs text-slate-500">Your workflow</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Simplified
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-700">
                      YOUR NEXT IDEA
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                      Start with a question.
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                      Turn the information you need into a form that is ready
                      for your workflow.
                    </p>
                  </div>
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm sm:flex">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>
                <Link
                  href="/login"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Create your first form
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Use cases
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              One builder. Plenty of possibilities.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              Create forms for the information you need to collect.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {useCases.map(({ icon: Icon, title, description }, i) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 sm:p-8"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${i === 0
                      ? "bg-blue-50 text-blue-600"
                      : i === 1
                        ? "bg-violet-50 text-violet-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {description}
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-slate-50 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <CircleHelp className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              A few things you might want to know before getting started.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="text-sm font-semibold text-slate-800 sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${openFaq === index ? "rotate-180 text-blue-600" : ""
                      }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-5 pb-5 sm:px-6">
                    <p className="text-sm leading-7 text-slate-500">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-14 text-center shadow-2xl shadow-indigo-600/20 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mt-7 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your next great form starts here.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Bring your ideas to life, organize your questions, and get
              started with FormBuilder today.
            </p>
            <Link
              href="/login"
              className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Brand />
          <p>© 2026 FormBuilder. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
            <Link href="/terms" className="transition hover:text-blue-600">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-blue-600">
              Privacy
            </Link>
            <Link href="/login" className="transition hover:text-blue-600">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}