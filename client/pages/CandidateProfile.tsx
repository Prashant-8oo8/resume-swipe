import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Link2,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { auth, logout, updateCandidateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: auth.candidateProfile?.fullName || "",
    phone: auth.candidateProfile?.phone || "",
    location: auth.candidateProfile?.location || "",
    yearsOfExperience: auth.candidateProfile?.yearsOfExperience || 0,
    bio: auth.candidateProfile?.bio || "",
    linkedIn: auth.candidateProfile?.linkedIn || "",
    github: auth.candidateProfile?.github || "",
    portfolio: auth.candidateProfile?.portfolio || "",
    personalWebsite: auth.candidateProfile?.personalWebsite || "",
  });
  const [newSkill, setNewSkill] = useState("");

  if (!auth.isAuthenticated || auth.role !== "candidate" || !auth.candidateProfile) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = () => {
    updateCandidateProfile(formData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      updateCandidateProfile({
        skills: [...(auth.candidateProfile?.skills || []), newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateCandidateProfile({
      skills:
        auth.candidateProfile?.skills.filter((s) => s !== skillToRemove) || [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
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
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {auth.candidateProfile.fullName}
              </h2>
              <p className="text-slate-600 mb-4">{auth.user?.email}</p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {auth.candidateProfile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {auth.candidateProfile.phone}
                  </div>
                )}
                {auth.candidateProfile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {auth.candidateProfile.location}
                  </div>
                )}
                {auth.candidateProfile.yearsOfExperience > 0 && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {auth.candidateProfile.yearsOfExperience} years experience
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={
                isEditing
                  ? "bg-slate-600 hover:bg-slate-700"
                  : "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              }
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            // Edit Mode
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedIn">LinkedIn URL</Label>
                  <Input
                    id="linkedIn"
                    value={formData.linkedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedIn: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({ ...formData, github: e.target.value })
                    }
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) =>
                      setFormData({ ...formData, portfolio: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalWebsite">Personal Website</Label>
                  <Input
                    id="personalWebsite"
                    value={formData.personalWebsite}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalWebsite: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 h-10"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            // View Mode
            <div className="space-y-8">
              {/* Bio */}
              {formData.bio && (
                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">About</h3>
                  <p className="text-slate-600 leading-relaxed">{formData.bio}</p>
                </div>
              )}

              {/* Skills */}
              <div>
                <h3 className="mb-3 font-semibold text-slate-900">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {auth.candidateProfile.skills.map((skill) => (
                    <Badge key={skill} className="bg-pink-100 text-pink-700 hover:bg-pink-200 cursor-pointer py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddSkill()
                    }
                    className="h-9"
                  />
                  <Button
                    onClick={handleAddSkill}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Education */}
              {auth.candidateProfile.education.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {auth.candidateProfile.education.map((edu) => (
                      <div key={edu.id} className="rounded-lg bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">
                          {edu.degree} in {edu.field}
                        </p>
                        <p className="text-sm text-slate-600">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-slate-500">
                          {edu.endYear || "Current"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(formData.linkedIn ||
                formData.github ||
                formData.portfolio ||
                formData.personalWebsite) && (
                <div>
                  <h3 className="mb-3 font-semibold text-slate-900 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.linkedIn && (
                      <a
                        href={formData.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {formData.github && (
                      <a
                        href={formData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {formData.portfolio && (
                      <a
                        href={formData.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Portfolio
                      </a>
                    )}
                    {formData.personalWebsite && (
                      <a
                        href={formData.personalWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
