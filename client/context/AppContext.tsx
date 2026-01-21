import React, { createContext, useContext, useState, useCallback } from "react";
import {
  User,
  CandidateProfile,
  HRProfile,
  AuthState,
  ApplicationStatus,
  Application,
} from "@/lib/types";
import {
  mockUsers,
  mockCandidateProfiles,
  mockHRProfiles,
  mockApplications,
} from "@/lib/mockData";

interface AppContextType {
  // Auth state
  auth: AuthState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registerCandidate: (
    email: string,
    password: string,
    name: string
  ) => boolean;
  registerHR: (email: string, password: string, name: string) => boolean;

  // Candidate operations
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => void;

  // Application operations
  getApplicationsByCandidate: (candidateId: string) => Application[];
  getApplicationsByJob: (jobId: string) => Application[];
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus
  ) => void;
  applyToJob: (jobId: string, candidateId: string) => string; // Returns applicationId

  // Swipe operations
  getSwipeCandidatesForJob: (jobId: string) => CandidateProfile[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [candidateProfiles, setCandidateProfiles] = useState<
    CandidateProfile[]
  >(mockCandidateProfiles);
  const [hrProfiles, setHRProfiles] = useState<HRProfile[]>(mockHRProfiles);
  const [applications, setApplications] = useState<Application[]>(
    mockApplications
  );
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    role: null,
    candidateProfile: null,
    hrProfile: null,
  });

  const login = useCallback((email: string, password: string): boolean => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return false;

    let candidateProfile = null;
    let hrProfile = null;

    if (user.role === "candidate") {
      candidateProfile =
        candidateProfiles.find((p) => p.userId === user.id) || null;
    } else if (user.role === "hr") {
      hrProfile = hrProfiles.find((p) => p.userId === user.id) || null;
    }

    setAuth({
      isAuthenticated: true,
      user,
      role: user.role,
      candidateProfile,
      hrProfile,
    });

    return true;
  }, [users, candidateProfiles, hrProfiles]);

  const logout = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      user: null,
      role: null,
      candidateProfile: null,
      hrProfile: null,
    });
  }, []);

  const registerCandidate = useCallback(
    (email: string, password: string, name: string): boolean => {
      // Check if email exists
      if (users.some((u) => u.email === email)) {
        return false;
      }

      const newUserId = `user-${Date.now()}`;
      const newCandidateId = `candidate-${Date.now()}`;

      const newUser: User = {
        id: newUserId,
        email,
        password, // In real app, hash this
        name,
        role: "candidate",
        createdAt: new Date(),
      };

      const newProfile: CandidateProfile = {
        id: newCandidateId,
        userId: newUserId,
        fullName: name,
        email,
        yearsOfExperience: 0,
        skills: [],
        education: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUsers([...users, newUser]);
      setCandidateProfiles([...candidateProfiles, newProfile]);

      setAuth({
        isAuthenticated: true,
        user: newUser,
        role: "candidate",
        candidateProfile: newProfile,
        hrProfile: null,
      });

      return true;
    },
    [users, candidateProfiles]
  );

  const registerHR = useCallback(
    (email: string, password: string, name: string): boolean => {
      // Check if email exists
      if (users.some((u) => u.email === email)) {
        return false;
      }

      const newUserId = `user-${Date.now()}`;
      const newHRId = `hr-${Date.now()}`;

      const newUser: User = {
        id: newUserId,
        email,
        password, // In real app, hash this
        name,
        role: "hr",
        createdAt: new Date(),
      };

      const newProfile: HRProfile = {
        id: newHRId,
        userId: newUserId,
        companyName: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUsers([...users, newUser]);
      setHRProfiles([...hrProfiles, newProfile]);

      setAuth({
        isAuthenticated: true,
        user: newUser,
        role: "hr",
        candidateProfile: null,
        hrProfile: newProfile,
      });

      return true;
    },
    [users, hrProfiles]
  );

  const updateCandidateProfile = useCallback(
    (profile: Partial<CandidateProfile>) => {
      if (!auth.candidateProfile) return;

      const updated = {
        ...auth.candidateProfile,
        ...profile,
        updatedAt: new Date(),
      };

      setCandidateProfiles(
        candidateProfiles.map((p) =>
          p.id === updated.id ? updated : p
        )
      );

      setAuth((prev) => ({
        ...prev,
        candidateProfile: updated,
      }));
    },
    [auth.candidateProfile, candidateProfiles]
  );

  const getApplicationsByCandidate = useCallback(
    (candidateId: string): Application[] => {
      return applications.filter((app) => app.candidateId === candidateId);
    },
    [applications]
  );

  const getApplicationsByJob = useCallback(
    (jobId: string): Application[] => {
      return applications.filter((app) => app.jobId === jobId);
    },
    [applications]
  );

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      setApplications(
        applications.map((app) => {
          if (app.id === applicationId) {
            const updatedApp = { ...app, status };

            if (status === "shortlisted") {
              updatedApp.shortlistedAt = new Date();
            } else if (status === "rejected") {
              updatedApp.rejectedAt = new Date();
            }

            return updatedApp;
          }
          return app;
        })
      );
    },
    [applications]
  );

  const applyToJob = useCallback(
    (jobId: string, candidateId: string): string => {
      const applicationId = `app-${Date.now()}`;
      const newApplication: Application = {
        id: applicationId,
        jobId,
        candidateId,
        status: "applied",
        appliedAt: new Date(),
      };

      setApplications([...applications, newApplication]);
      return applicationId;
    },
    [applications]
  );

  const getSwipeCandidatesForJob = useCallback(
    (jobId: string): CandidateProfile[] => {
      const jobApplicants = applications
        .filter((app) => app.jobId === jobId)
        .map((app) => app.candidateId);

      return candidateProfiles.filter((profile) =>
        jobApplicants.includes(profile.id)
      );
    },
    [candidateProfiles, applications]
  );

  const value: AppContextType = {
    auth,
    login,
    logout,
    registerCandidate,
    registerHR,
    updateCandidateProfile,
    getApplicationsByCandidate,
    getApplicationsByJob,
    updateApplicationStatus,
    applyToJob,
    getSwipeCandidatesForJob,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
