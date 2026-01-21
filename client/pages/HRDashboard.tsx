import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  LogOut,
  MapPin,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockJobs, mockApplications } from "@/lib/mockData";

export default function HRDashboard() {
  const navigate = useNavigate();
  const { auth, logout, getApplicationsByJob } = useApp();

  if (!auth.isAuthenticated || auth.role !== "hr") {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const jobsWithStats = mockJobs.map((job) => {
    const applications = getApplicationsByJob(job.id);
    const shortlisted = applications.filter((app) => app.status === "shortlisted").length;
    const rejected = applications.filter((app) => app.status === "rejected").length;
    const pending = applications.filter((app) => app.status === "applied").length;

    return {
      ...job,
      stats: { shortlisted, rejected, pending, total: applications.length },
    };
  });

  const totalStats = jobsWithStats.reduce(
    (acc, job) => ({
      total: acc.total + job.stats.total,
      shortlisted: acc.shortlisted + job.stats.shortlisted,
      pending: acc.pending + job.stats.pending,
    }),
    { total: 0, shortlisted: 0, pending: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome, {auth.user?.name}!
              </h1>
              <p className="text-sm text-slate-600">
                {auth.hrProfile?.companyName || "HR Manager"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {[
            {
              label: "Total Applicants",
              value: totalStats.total,
              icon: Users,
              color: "from-blue-500 to-cyan-600",
            },
            {
              label: "Shortlisted",
              value: totalStats.shortlisted,
              icon: TrendingUp,
              color: "from-green-500 to-emerald-600",
            },
            {
              label: "Pending Review",
              value: totalStats.pending,
              icon: Briefcase,
              color: "from-orange-500 to-amber-600",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className={`rounded-xl border border-slate-200 bg-gradient-to-br ${stat.color} p-6 text-white shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 opacity-50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Jobs Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Open Positions</h2>
            <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Job</span>
            </Button>
          </div>

          {jobsWithStats.length === 0 ? (
            <motion.div
              className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Briefcase className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-4">No open positions yet</p>
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-600">
                <Plus className="h-4 w-4" />
                Create Job Post
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {jobsWithStats.map((job, idx) => (
                <motion.div
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Job Info */}
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="rounded-lg bg-pink-100 p-3">
                          <Briefcase className="h-6 w-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requiredSkills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.requiredSkills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {job.stats.total}
                          </p>
                          <p className="text-xs text-blue-600">Total</p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {job.stats.shortlisted}
                          </p>
                          <p className="text-xs text-green-600">Shortlisted</p>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-3 text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {job.stats.pending}
                          </p>
                          <p className="text-xs text-orange-600">Pending</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/hr/screening/${job.id}`)}
                          className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                        >
                          Screen <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View All
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
