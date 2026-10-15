"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  Sparkles,
  ShieldCheck,
  ChartNoAxesCombined,
  LockKeyhole,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle2,
  WandSparkles,
  Layers3,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const signInWithGoogle = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message ?? "Sign in failed");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (isPending || session) {
    return (
      <div className="flex h-dvh max-h-dvh items-center justify-center bg-slate-50">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="relative h-dvh max-h-dvh overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative mx-auto grid h-full max-w-360 lg:grid-cols-2">
        {/* Left: Brand and product showcase (desktop only) */}
        <section className="relative hidden h-full flex-col justify-between overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50/70 to-violet-50 px-10 py-6 lg:flex lg:px-14 xl:px-20">
          <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <a href="/" className="relative flex w-fit items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Form<span className="text-blue-600">Builder</span>
            </span>
          </a>

          <div className="relative mx-auto my-auto w-full max-w-xl py-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Your ideas, beautifully organized
            </div>

            <h1 className="text-xl font-extrabold leading-[1.12] tracking-tight xl:text-5xl">
              Create beautiful
              <span className="mt-1 block bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text pb-1 text-transparent">
                forms, effortlessly.
              </span>
            </h1>


            {/* Product preview */}
            <div className="relative mt-8 pb-5">
              <div className="absolute -inset-4 rounded-4xl bg-linear-to-br from-blue-200/50 to-violet-200/50 blur-2xl" />

              <div className="relative rounded-2xl border border-white/80 bg-white/90 p-4 shadow-2xl shadow-indigo-900/10 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Contact Form
                      </p>
                      <p className="text-xs text-slate-400">
                        Your new creation
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Published
                  </span>
                </div>

                <div className="grid gap-5 pt-4 grid-cols-[1fr_0.8fr]">
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight">
                        Get in touch
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        We would love to hear from you.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        Full name
                      </label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-400">
                        Enter your name
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        Email address
                      </label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-400">
                        you@example.com
                      </div>
                    </div>

                    <div className="space-y-1.5 [@media(max-height:780px)]:hidden">
                      <label className="text-xs font-semibold text-slate-600">
                        Your message
                      </label>
                      <div className="h-14 rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-400">
                        Write something...
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20">
                      Submit response
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                        <WandSparkles className="h-4 w-4 text-violet-500" />
                        Form elements
                      </div>

                      {[
                        "Text field",
                        "Email field",
                        "Dropdown",
                        "Checkbox",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="mb-2 flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 text-[11px] font-medium text-slate-500 last:mb-0"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${index % 2 === 0 ? "bg-blue-500" : "bg-violet-400"
                              }`}
                          />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-5 -top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white text-emerald-500 shadow-xl">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div className="absolute -bottom-1 -right-5 flex items-center gap-2 rounded-xl border border-white bg-white px-4 py-3 shadow-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Simple & powerful
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Create in minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Feature highlights (hidden on short screens) */}
            <div className="mt-8 grid grid-cols-3 gap-5 [@media(max-height:820px)]:hidden">
              {[
                {
                  icon: WandSparkles,
                  title: "Easy to use",
                  text: "No hassle",
                  color: "text-blue-600 bg-blue-100",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure",
                  text: "Your data matters",
                  color: "text-emerald-600 bg-emerald-100",
                },
                {
                  icon: ChartNoAxesCombined,
                  title: "Insights",
                  text: "Understand responses",
                  color: "text-violet-600 bg-violet-100",
                },
              ].map(({ icon: Icon, title, text, color }) => (
                <div key={title} className="flex flex-col gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="text-xs leading-4 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-slate-400">
            © {new Date().getFullYear()} FormBuilder. Built for your ideas.
          </p>
        </section>

        {/* Right: Login */}
        <section className="relative flex h-full overflow-y-auto px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />

          <div className="relative m-auto w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-5 text-center lg:hidden">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-xl font-extrabold">
                Form<span className="text-blue-600">Builder</span>
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/6 backdrop-blur-xl sm:p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 hidden h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25 lg:flex">
                  <FileText className="h-7 w-7" />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back!
                </h2>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  Sign in to build beautiful forms and manage all your
                  responses in one place.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 [@media(max-height:700px)]:hidden">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Your workspace awaits
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Create, organize, and manage your forms with ease.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-900/5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                ) : (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.06 13.22l7.98 6.19C12.93 13.72 18.01 9.5 24 9.5z"
                      transform="translate(0 4)"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.95 46.98 31.9 46.98 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.99 28.41A14.4 14.4 0 0 1 10.22 24c0-1.53.27-3.02.77-4.41l-7.98-6.19A23.9 23.9 0 0 0 .01 24c0 3.86.92 7.51 3 10.6l7.98-6.19z"
                      transform="translate(0 4)"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.89 2.3-8.18 2.3-5.99 0-11.07-4.22-12.96-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      transform="translate(0 -4)"
                    />
                  </svg>
                )}

                <span>
                  {loading ? "Connecting to Google..." : "Continue with Google"}
                </span>

                {!loading && (
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                )}
              </button>

              <div className="my-5 flex items-center gap-4 [@media(max-height:700px)]:hidden">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                  Simple. Secure. Seamless.
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-100 [@media(max-height:700px)]:hidden">
                {[
                  { icon: LockKeyhole, title: "Secure", text: "Sign-in" },
                  { icon: Zap, title: "Quick", text: "Access" },
                  { icon: Heart, title: "Made for", text: "You" },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center px-2 text-center"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-blue-600 transition-colors hover:bg-blue-50">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  className="font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Have a great idea? Let&apos;s turn it into a form.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}