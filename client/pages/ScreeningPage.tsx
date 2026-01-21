import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mockJobs, mockCandidateProfiles } from "@/lib/mockData";

export default function ScreeningPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { auth, updateApplicationStatus, getApplicationsByJob } = useApp();
  const [processedIndices, setProcessedIndices] = useState<Set<number>>(new Set());
  const [stats, setStats] = useState({ shortlisted: 0, rejected: 0 });

  const job = mockJobs.find((j) => j.id === jobId);
  const jobApplications = getApplicationsByJob(jobId || "");
  
  const candidates = useMemo(() => {
    return mockCandidateProfiles.filter((candidate) =>
      jobApplications.some((app) => app.candidateId === candidate.id)
    );
  }, [jobApplications]);

  const unprocessedCandidates = useMemo(() => {
    return candidates.filter((_, index) => !processedIndices.has(index));
  }, [candidates, processedIndices]);

  if (!job || !auth.isAuthenticated || auth.role !== "hr") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Job not found or unauthorized access</p>
          <Button onClick={() => navigate("/hr/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAccept = (index: number) => {
    const candidate = candidates[index];
    const application = jobApplications.find(
      (app) => app.candidateId === candidate.id
    );
    if (application) {
      updateApplicationStatus(application.id, "shortlisted");
    }
    
    setProcessedIndices((prev) => new Set([...prev, index]));
    setStats((prev) => ({ ...prev, shortlisted: prev.shortlisted + 1 }));
  };

  const handleReject = (index: number) => {
    const candidate = candidates[index];
    const application = jobApplications.find(
      (app) => app.candidateId === candidate.id
    );
    if (application) {
      updateApplicationStatus(application.id, "rejected");
    }
    
    setProcessedIndices((prev) => new Set([...prev, index]));
    setStats((prev) => ({ ...prev, rejected: prev.rejected + 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/hr/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
                <p className="text-sm text-slate-600">{job.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.shortlisted}</p>
                <p className="text-xs text-slate-600">Shortlisted</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-slate-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 min-h-[calc(100vh-100px)]">
        {unprocessedCandidates.length > 0 ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                {unprocessedCandidates.length} of {candidates.length} candidates remaining
              </p>
              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${
                      ((processedIndices.size) / candidates.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Card Stack */}
            <div className="relative h-[600px] sm:h-[700px] mb-12">
              <AnimatePresence>
                {unprocessedCandidates.map((candidate, idx) => (
                  <motion.div
                    key={candidate.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: idx === 0 ? (stats.shortlisted % 2 === 1 ? 200 : -200) : 0,
                      scale: 0.9,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <SwipeCard
                      candidate={candidate}
                      onAccept={() => {
                        const actualIndex = candidates.findIndex(
                          (c) => c.id === candidate.id
                        );
                        handleAccept(actualIndex);
                      }}
                      onReject={() => {
                        const actualIndex = candidates.findIndex(
                          (c) => c.id === candidate.id
                        );
                        handleReject(actualIndex);
                      }}
                      index={idx}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Keyboard Hints */}
            <div className="text-center text-sm text-slate-600 space-y-1">
              <p>💡 Drag left to reject, right to shortlist</p>
              <p>⌨️ Use ← and → arrow keys as shortcuts</p>
            </div>
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full py-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 rounded-full bg-green-100 p-6">
              <Heart className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              You've reviewed all candidates!
            </h2>
            <p className="text-slate-600 mb-6 max-w-sm">
              You shortlisted {stats.shortlisted} candidate
              {stats.shortlisted !== 1 ? "s" : ""} and rejected {stats.rejected}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate("/hr/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Review Again
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
