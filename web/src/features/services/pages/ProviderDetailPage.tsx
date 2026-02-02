"use client";

import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, User, MapPin, Briefcase, GraduationCap, Globe, ArrowLeft } from "lucide-react";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";
import { profileService } from "@/shared/services/profile.service";
import type { ProviderProfile } from "@/shared/types/profile";
import { toast } from "sonner";
import OperationRequestForm from "@/shared/components/common/modals/request-modal";
import Button from "@/shared/components/ui/Button";
import { AvailabilityView } from "../components/AvailabilityView";
import { StatusTag } from "@/shared/components/common/tags";
import { PublicPortfolioView } from "../components/PublicPortfolioView";
import { PublicDocumentsView } from "../components/PublicDocumentsView";

const ProviderDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "availability" | "projects" | "documents">("profile");
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const profileData = await profileService.getProfileById(id);
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to load profile:", error);
                toast.error("Failed to load provider profile");
                navigate("/services");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="text-center py-12">
                    <p className="text-gray-600">Provider profile not found</p>
                    <Button
                        onClick={() => navigate("/services")}
                        className="mt-4 text-[#7682e8] hover:underline"
                    >
                        Back to search
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const fullName = profile.user
        ? `${profile.user.firstName} ${profile.user.lastName.charAt(0)}.`
        : "Provider";
    const rating = typeof profile.averageRating === 'number'
        ? profile.averageRating
        : parseFloat(String(profile.averageRating || 0)) || 0;
    const hourlyRate = typeof profile.hourlyRate === 'number'
        ? profile.hourlyRate
        : parseFloat(String(profile.hourlyRate || 0)) || 0;
    const skills = profile.skills?.map((s) => s.skillName) || [];
    const languages = profile.languages || [];
    const experiences = profile.experiences || [];
    const education = profile.education || [];

    return (
        <>
            <div className="min-h-screen ">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[10rem]">
                    {/* Back Button */}
                    <Button
                        onClick={() => navigate("/services")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors border-none shadow-none"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to search</span>
                    </Button>

                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0 flex items-center justify-center">
                                {profile.user?.avatarUrl ? (
                                    <img
                                        src={profile.user.avatarUrl}
                                        alt={fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-400" />
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
                                <p className="text-xl text-gray-600 mb-4">
                                    {profile.title || profile.service?.name || "Service Provider"}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-4">
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
                                </div>

                                {profile.service && (
                                    <StatusTag key={profile.service.name} colorScheme="primary" className="text-xs">
                                        {profile.service.name}
                                    </StatusTag>

                                )}
                                <div className="w-full flex justify-end">
                                    <Button
                                        onClick={() => setIsRequestModalOpen(true)}
                                        className="px-6 py-3 text-[#7682e8] border border-[#7682e8] rounded-lg font-medium  transition-colors"

                                    >
                                        Request Service
                                    </Button>


                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === "profile"
                                ? "text-[#7682e8]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Profile
                            {activeTab === "profile" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("availability")}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === "availability"
                                ? "text-[#7682e8]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Availability
                            {activeTab === "availability" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("projects")}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === "projects"
                                ? "text-[#7682e8]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Projects
                            {activeTab === "projects" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("documents")}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === "documents"
                                ? "text-[#7682e8]"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Documents
                            {activeTab === "documents" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {activeTab === "profile" ? (
                                <>
                                    {/* Bio */}
                                    {profile.bio && (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {profile.bio}
                                            </p>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {experiences.length > 0 && (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5" />
                                                Work Experience
                                            </h2>
                                            <div className="space-y-4">
                                                {experiences.map((exp) => (
                                                    <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                                                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
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
                                                            <p className="text-gray-700 mt-2">{exp.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {education.length > 0 && (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5" />
                                                Education
                                            </h2>
                                            <div className="space-y-4">
                                                {education.map((edu) => (
                                                    <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                                                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                                        <p className="text-gray-600">{edu.school}</p>
                                                        <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(edu.startDate).toLocaleDateString()} -{" "}
                                                            {edu.endDate
                                                                ? new Date(edu.endDate).toLocaleDateString()
                                                                : "Present"}
                                                        </p>
                                                        {edu.description && (
                                                            <p className="text-gray-700 mt-2">{edu.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : activeTab === "availability" ? (
                                <AvailabilityView providerId={profile.id} />
                            ) : activeTab === "projects" ? (
                                <PublicPortfolioView profileId={profile.id} />
                            ) : (
                                <PublicDocumentsView profileId={profile.id} />
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Skills */}
                            {skills.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (

                                            <StatusTag key={skill} colorScheme="primary" className="text-xs">
                                                {skill}
                                            </StatusTag>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Languages */}
                            {languages.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                    </div>
                </div>

                <Footer />
            </div>

            {/* Request Modal */}
            {isRequestModalOpen && profile && (
                <div className="fixed inset-0 bg-[#0000007d] z-[1005] flex items-center justify-center p-4">
                    <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
                        <OperationRequestForm
                            close={() => setIsRequestModalOpen(false)}
                            isOpen={isRequestModalOpen}
                            providerId={profile.id}
                            providerName={fullName}
                            providerTitle={profile.title}
                            providerServiceId={profile.serviceId}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProviderDetailPage;
