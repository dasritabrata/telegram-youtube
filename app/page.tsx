import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header />
     
      <main>
        {/* HERO SECTION */}
        <div className="relative flex  flex-col items-center justify-center px-4 py-20 text-center sm:px-6 overflow-hidden">

          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100" />

          {/* Soft glow */}
          <div className="absolute -top-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Learn{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Smartly
            </span>
          </h1>

          <span className="mt-4 max-w-xs text-base text-slate-600 sm:max-w-md sm:text-lg">
            Access lessons, notes, and interactive video classes anytime, anywhere.
          </span>

          <div className="mt-6 flex gap-3">
            <Link href="/dashboard"> 
            <Button className="rounded-full bg-indigo-600 px-6 py-5 text-base hover:bg-indigo-700">
              Get Started
            </Button>
            </Link>
            
            <Button
              variant="outline"
              className="rounded-full px-6 py-5 text-base"
            >
              Learn More
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">
              Trusted by students and educators worldwide
            </p>

            <div className="flex gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                  15k+
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Active Students
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                  2M+
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Notes & Resources Shared
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                  99.9%
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Uptime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              All-in-one Learning Platform
            </h2>
            <p className="mt-4 text-slate-600 max-w-md mx-auto">
              Powerful tools to learn, revise, and collaborate with your peers seamlessly.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Feature Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900">
                  📚 Interactive Lessons
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Access high-quality lessons with notes, examples, and exercises.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900">
                  📝 Smart Notes
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Write, highlight, and organize notes for every subject efficiently.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900">
                  🎥 Video Classes
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Attend live and recorded classes with interactive video tools.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900">
                  🏆 Progress Tracking
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Track your learning progress and get insights for better outcomes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900">
                  🔒 Secure & Private
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  All your learning data is safe with end-to-end privacy.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-slate-900">
                  ⚡ Fast & Reliable
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Access all content instantly, even on slow networks.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
