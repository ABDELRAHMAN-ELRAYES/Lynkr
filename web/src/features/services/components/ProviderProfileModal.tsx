"use client";

import { FC, useEffect, useState } from "react";
import { X, Star, MapPin, Briefcase, GraduationCap, Globe, User } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { profileService } from "@/shared/services/profile.service";
import type { ProviderProfile } from "@/shared/types/profile";
import { toast } from "sonner";

interface ProviderProfileModalProps {
    providerId: string;
    isOpen: boolean;
    onClose: () => void;
}

const ProviderProfileModal: FC<ProviderProfileModalProps> = ({
    providerId,
    isOpen,
    onClose,
}) => {
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && providerId) {
            loadProfile();
        }
    }, [isOpen, providerId]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const profileData = await profileService.getProfileById(providerId);
            setProfile(profileData);
        } catch (error) {
            console.error("Failed to load profile:", error);
            toast.error("Failed to load provider profile");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const fullName = profile?.user
        ? `${profile.user.firstName} ${profile.user.lastName}`
        : "Provider";
    const rating =
        typeof profile?.averageRating === "number"
            ? profile.averageRating
            : parseFloat(String(profile?.averageRating || 0)) || 0;
    const hourlyRate =
        typeof profile?.hourlyRate === "number"
            ? profile.hourlyRate
            : parseFloat(String(profile?.hourlyRate || 0)) || 0;
    const skills = profile?.skills?.map((s) => s.skillName) || [];
    const languages = profile?.languages || [];
    const experiences = profile?.experiences || [];
    const education = profile?.education || [];

    return (
        <div className="fixed inset-0 bg-[#0000007d] z-[1005] flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#7682e8] to-[#5a67d8] px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center">
                                {profile?.user?.avatarUrl ? (
                                    <img
                                        src={profile.user.avatarUrl}
                                        alt={fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            {loading ? (
                                <div>
                                    <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-bold text-white">{fullName}</h2>
                                    <p className="text-sm text-white/90">
                                        {profile?.title || profile?.service?.name || "Service Provider"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <Button
                            className="text-white border-2 border-white transition-colors p-2 bg-transparent hover:bg-white/20 rounded-full"
                            onClick={onClose}
                        >
                            <X size={24} />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Quick Info */}
                            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200">
                                {rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-gray-900">
                                            {rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                                <div className="text-2xl font-bold text-gray-900">
                                    ${hourlyRate.toFixed(2)}
                                    <span className="text-sm font-normal text-gray-500">/hr</span>
                                </div>
                                {profile.user?.country && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profile.user.country}</span>
                                    </div>
                                )}
                                {profile.service && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {profile.service.name}
                                    </span>
                                )}
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {profile.bio}
                                    </p>
                                </div>
                            )}

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {experiences.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Work Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {experiences.slice(0, 3).map((exp) => (
                                            <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                                                <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                                                <p className="text-gray-600">{exp.company}</p>
                                                <p className="text-sm text-gray-500">
                                                    {exp.location && `${exp.location}, `}
                                                    {exp.country}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                                                    {exp.endDate
                                                        ? new Date(exp.endDate).toLocaleDateString()
                                                        : "Present"}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {education.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5" />
                                        Education
                                    </h3>
                                    <div className="space-y-4">
                                        {education.slice(0, 3).map((edu) => (
                                            <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                                                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                                <p className="text-gray-600">{edu.school}</p>
                                                <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                                                    {edu.endDate
                                                        ? new Date(edu.endDate).toLocaleDateString()
                                                        : "Present"}
                                                </p>
                                                {edu.description && (
                                                    <p className="text-gray-700 mt-2 text-sm">{edu.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {languages.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Globe className="w-5 h-5" />
                                        Languages
                                    </h3>
                                    <div className="space-y-2">
                                        {languages.map((lang) => (
                                            <div key={lang.id} className="flex justify-between items-center">
                                                <span className="text-gray-700">{lang.language}</span>
                                                <span className="text-sm text-gray-500 capitalize">
                                                    {lang.proficiency.toLowerCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Failed to load profile</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {profile && (
                    <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 flex justify-end gap-3">
                        <Button
                            className="px-6 py-2 text-sm font-medium text-gray-600 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderProfileModal;
