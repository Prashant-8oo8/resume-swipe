// User Types
export type UserRole = "candidate" | "hr";

export interface User {
  id: string;
  email: string;
  password: string; // In real app, never store plaintext
  name: string;
  role: UserRole;
  createdAt: Date;
}

// Candidate Types
export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  yearsOfExperience: number;
  skills: string[];
  education: EducationEntry[];
  resume?: {
    filename: string;
    uploadedAt: Date;
  };
  cv?: {
    filename: string;
    uploadedAt: Date;
  };
  portfolio?: string; // URL
  linkedIn?: string;
  github?: string;
  personalWebsite?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

// HR Types
export interface HRProfile {
  id: string;
  userId: string;
  companyName: string;
  companySize?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job Types
export interface Job {
  id: string;
  hrId: string;
  title: string;
  description: string;
  department: string;
  location: string;
  requiredSkills: string[];
  minExperience: number;
  minEducation?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  status: "active" | "closed" | "draft";
  createdAt: Date;
  closedAt?: Date;
  applicantCount: number;
}

// Application Types
export type ApplicationStatus = "applied" | "shortlisted" | "rejected";

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  shortlistedAt?: Date;
  rejectedAt?: Date;
}

// Chat Types
export interface ChatConversation {
  id: string;
  hrId: string;
  candidateId: string;
  jobId: string;
  applicationId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
  candidateProfile: CandidateProfile | null;
  hrProfile: HRProfile | null;
}
