import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CandidateProfile } from "@/lib/types";
import { Heart, X, MapPin, Briefcase, GraduationCap, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SwipeCardProps {
  candidate: CandidateProfile;
  onAccept: () => void;
  onReject: () => void;
  index: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  candidate,
  onAccept,
  onReject,
  index,
}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const SWIPE_THRESHOLD = 100; // pixels to trigger decision

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onAccept();
      } else if (e.key === "ArrowLeft") {
        onReject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onAccept, onReject]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }
    setIsDragging(true);
    startXRef.current = e.clientX - x;
    startYRef.current = e.clientY - y;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const newX = e.clientX - startXRef.current;
    const newY = e.clientY - startYRef.current;

    setX(newX);
    setY(newY);

    // Calculate rotation based on horizontal movement
    const rotation = (newX / 100) * 5;
    setRotate(rotation);

    // Calculate opacity based on movement
    const opacity = 1 - Math.abs(newX) / 500;
    setOpacity(Math.max(opacity, 0.5));
  };

  const handlePointerUp = () => {
    setIsDragging(false);

    // Determine if swipe threshold is met
    if (Math.abs(x) > SWIPE_THRESHOLD) {
      // Animate out and call callback
      if (x > 0) {
        // Right swipe - accept
        onAccept();
      } else {
        // Left swipe - reject
        onReject();
      }
      // Reset will happen via AnimatePresence
    } else {
      // Return to center
      setX(0);
      setY(0);
      setRotate(0);
      setOpacity(1);
    }
  };

  // Add touch support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX - x;
    startYRef.current = e.touches[0].clientY - y;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const newX = e.touches[0].clientX - startXRef.current;
    const newY = e.touches[0].clientY - startYRef.current;

    setX(newX);
    setY(newY);

    const rotation = (newX / 100) * 5;
    setRotate(rotation);

    const opacity = 1 - Math.abs(newX) / 500;
    setOpacity(Math.max(opacity, 0.5));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(x) > SWIPE_THRESHOLD) {
      if (x > 0) {
        onAccept();
      } else {
        onReject();
      }
    } else {
      setX(0);
      setY(0);
      setRotate(0);
      setOpacity(1);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x: isDragging ? x : 0,
        y: isDragging ? y : 0,
        rotate: isDragging ? rotate : 0,
        zIndex: 100 - index,
      }}
      animate={{
        x: isDragging ? x : 0,
        y: isDragging ? y : 0,
        rotate: isDragging ? rotate : 0,
        scale: isDragging ? 1.02 : 1 - index * 0.02,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerLeave={() => {
        if (isDragging) {
          setIsDragging(false);
          if (Math.abs(x) > SWIPE_THRESHOLD) {
            if (x > 0) {
              onAccept();
            } else {
              onReject();
            }
          } else {
            setX(0);
            setY(0);
            setRotate(0);
            setOpacity(1);
          }
        }
      }}
    >
      <div className="h-full">
        {/* Card */}
        <div className="relative h-full rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col">
          {/* Accept/Reject Labels */}
          {Math.abs(x) > SWIPE_THRESHOLD * 0.5 && (
            <>
              {x > SWIPE_THRESHOLD * 0.5 && (
                <motion.div
                  className="absolute top-4 left-4 z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2">
                    <Heart className="h-5 w-5 text-green-600 fill-green-600" />
                    <span className="font-semibold text-green-700">Shortlist</span>
                  </div>
                </motion.div>
              )}
              {x < -SWIPE_THRESHOLD * 0.5 && (
                <motion.div
                  className="absolute top-4 right-4 z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2">
                    <X className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-700">Reject</span>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-1">
                {candidate.fullName}
              </h2>
              <p className="text-base text-slate-600 mb-4">
                {candidate.yearsOfExperience} years of experience
              </p>

              {/* Location */}
              {candidate.location && (
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{candidate.location}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {candidate.bio && (
              <div className="mb-6">
                <p className="text-slate-600 leading-relaxed">{candidate.bio}</p>
              </div>
            )}

            {/* Skills */}
            {candidate.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-slate-900">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-pink-100 text-pink-700 hover:bg-pink-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {candidate.education.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </h3>
                <div className="space-y-2">
                  {candidate.education.map((edu) => (
                    <div key={edu.id} className="text-sm">
                      <p className="font-medium text-slate-900">{edu.degree}</p>
                      <p className="text-slate-600">{edu.institution}</p>
                      <p className="text-xs text-slate-500">
                        {edu.field} • {edu.endYear || "Current"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(candidate.portfolio ||
              candidate.linkedIn ||
              candidate.github ||
              candidate.personalWebsite) && (
              <div className="mb-6 pt-4 border-t border-slate-200">
                <h3 className="mb-3 font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Links
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.portfolio && (
                    <a
                      href={candidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Portfolio <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {candidate.linkedIn && (
                    <a
                      href={candidate.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {candidate.github && (
                    <a
                      href={candidate.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {candidate.personalWebsite && (
                    <a
                      href={candidate.personalWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 bg-white p-6 sm:p-8 flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="hidden sm:inline">Reject</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-600 hover:bg-green-100 hover:border-green-300 transition-colors"
            >
              <Heart className="h-5 w-5 fill-current" />
              <span className="hidden sm:inline">Shortlist</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
