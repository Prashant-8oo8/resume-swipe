import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Heart, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function Index() {
  const { auth } = useApp();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.role === "hr") {
        navigate("/hr/dashboard");
      } else if (auth.role === "candidate") {
        navigate("/candidate/profile");
      }
    }
  }, [auth.isAuthenticated, auth.role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">TalentSwipe</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-block rounded-full bg-pink-100 px-4 py-1 text-sm font-semibold text-pink-700">
                    ✨ Hiring Reimagined
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Find Your Perfect
                    <span className="block bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                      Talent Match
                    </span>
                  </h1>
                </div>
                <p className="text-lg text-slate-600">
                  TalentSwipe makes candidate screening fun and efficient. Use our
                  Tinder-style interface to review resumes, make quick decisions, and
                  connect with top talent instantly.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/register">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 px-8 py-6 text-lg hover:from-pink-600 hover:to-rose-700 sm:w-auto">
                      Start Hiring <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full px-8 py-6 text-lg sm:w-auto"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative h-96 w-full max-w-sm">
                {/* Animated card stack visual */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-200 opacity-20 blur-2xl" />
                <div className="absolute inset-8 rounded-2xl border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="h-32 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300" />
                      <div className="space-y-2">
                        <div className="h-3 rounded bg-slate-300 w-3/4" />
                        <div className="h-3 rounded bg-slate-300 w-1/2" />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <div className="h-10 flex-1 rounded-lg bg-red-100" />
                        <div className="h-10 flex-1 rounded-lg bg-green-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-white/50 px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose TalentSwipe?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need for modern candidate screening
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Lightning Fast",
                description:
                  "Screen candidates in seconds with our intuitive swipe interface",
              },
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Enjoyable Experience",
                description:
                  "Make hiring fun with a Tinder-style interface that users love",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Built-in Communication",
                description:
                  "Chat directly with shortlisted candidates without leaving the platform",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: "Smart Filtering",
                description:
                  "Filter candidates by skills, experience, location, and education",
              },
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Full Resume Access",
                description:
                  "View resumes, CVs, portfolios, and social media profiles",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Instant Decisions",
                description:
                  "Make quick accept/reject decisions and manage your pipeline",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-6 hover:border-pink-200 hover:shadow-lg transition-all"
              >
                <div className="mb-3 inline-block rounded-lg bg-pink-100 p-3 text-pink-600">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Hiring?
          </h2>
          <p className="mt-4 text-lg text-pink-100">
            Join hundreds of companies using TalentSwipe to find their next great
            hire
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button className="w-full bg-white text-pink-600 hover:bg-pink-50 sm:w-auto">
                Get Started for Free
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-white text-white hover:bg-white/20 sm:w-auto"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">TalentSwipe</span>
            </div>
            <p className="text-sm text-slate-600">
              © 2024 TalentSwipe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
