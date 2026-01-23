"use client";

import { useState } from "react";
import { X, User, Briefcase, GraduationCap, Languages, Clock, CheckCircle, Ban, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface ProviderRequestDetailModalProps {
    request: any;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function ProviderRequestDetailModal({
    request,
    onClose,
    onApprove,
    onReject,
}: ProviderRequestDetailModalProps) {
    const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

    if (!request) return null;

    const user = request.user || {};
    const profile = request.profile || request;
    const skills = request.skills || [];
    const experiences = request.experiences || [];
    const education = request.education || [];
    const languages = request.languages || [];
    const service = request.service || {};

    const handleConfirmAction = () => {
        if (confirmAction === "approve") {
            onApprove(request.id);
        } else if (confirmAction === "reject") {
            onReject(request.id);
        }
        setConfirmAction(null);
    };

    // Confirmation Dialog
    if (confirmAction) {
        const isApprove = confirmAction === "approve";
        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white rounded-3xl shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isApprove ? "bg-emerald-100" : "bg-rose-100"}`}>
                            {isApprove ? (
                                <CheckCircle className="h-8 w-8 text-emerald-600" />
                            ) : (
                                <AlertTriangle className="h-8 w-8 text-rose-600" />
                            )}
                        </div>
                        <CardTitle className="text-xl mt-4">
                            {isApprove ? "Approve Provider?" : "Reject Provider?"}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {isApprove
                                ? `Are you sure you want to approve ${user.firstName} ${user.lastName}'s application? They will be able to receive service requests.`
                                : `Are you sure you want to reject ${user.firstName} ${user.lastName}'s application? They will need to reapply.`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmAction(null)}
                                className="rounded-xl px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmAction}
                                className={`rounded-xl px-6 ${isApprove
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-rose-600 text-white hover:bg-rose-700"
                                    }`}
                            >
                                {isApprove ? "Yes, Approve" : "Yes, Reject"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-200 flex flex-row items-center justify-between p-6">
                    <div>
                        <CardTitle className="text-xl text-slate-800">Provider Application Details</CardTitle>
                        <CardDescription>Review the complete application before making a decision</CardDescription>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </CardHeader>

                <ScrollArea className="max-h-[calc(90vh-180px)]">
                    <CardContent className="p-6 space-y-6">
                        {/* User Info */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <Avatar className="h-16 w-16 border-2 border-white ring-2 ring-slate-200">
                                <AvatarFallback className="text-lg">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-sm text-slate-500">{user.email}</p>
                                {profile.title && (
                                    <p className="text-sm font-medium text-indigo-600 mt-1">{profile.title}</p>
                                )}
                            </div>
                            <div className="text-right">
                                {profile.hourlyRate && (
                                    <div className="text-lg font-bold text-slate-800">
                                        ${profile.hourlyRate}/hr
                                    </div>
                                )}
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                    Pending Review
                                </Badge>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <User className="h-4 w-4" /> Bio
                                </h4>
                                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl whitespace-pre-wrap">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* Service */}
                        {service.name && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Service Category
                                </h4>
                                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                    {service.name}
                                </Badge>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: any, index: number) => (
                                        <Badge key={index} variant="outline" className="bg-slate-50">
                                            {skill.skillName || skill.name || skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experience */}
                        {experiences.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Work Experience
                                </h4>
                                <div className="space-y-3">
                                    {experiences.map((exp: any, index: number) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-xl">
                                            <div className="font-medium text-slate-800">{exp.title}</div>
                                            <div className="text-sm text-slate-600">{exp.company}</div>
                                            {exp.location && (
                                                <div className="text-sm text-slate-500">{exp.location}, {exp.country}</div>
                                            )}
                                            <div className="text-xs text-slate-400 mt-1">
                                                {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                            </div>
                                            {exp.description && (
                                                <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" /> Education
                                </h4>
                                <div className="space-y-3">
                                    {education.map((edu: any, index: number) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-xl">
                                            <div className="font-medium text-slate-800">{edu.degree}</div>
                                            <div className="text-sm text-slate-600">{edu.school}</div>
                                            {edu.fieldOfStudy && (
                                                <div className="text-sm text-slate-500">{edu.fieldOfStudy}</div>
                                            )}
                                            <div className="text-xs text-slate-400 mt-1">
                                                {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <Languages className="h-4 w-4" /> Languages
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang: any, index: number) => (
                                        <Badge key={index} variant="outline" className="bg-slate-50">
                                            {lang.language} - {lang.proficiency}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Applied Date */}
                        <div className="text-sm text-slate-500">
                            <strong>Applied:</strong> {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}
                        </div>
                    </CardContent>
                </ScrollArea>

                {/* Actions Footer */}
                <div className="border-t border-slate-200 p-6 flex justify-end gap-3 bg-slate-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl"
                    >
                        Close
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setConfirmAction("reject")}
                        className="rounded-xl border-rose-300 text-rose-600 hover:bg-rose-50"
                    >
                        <Ban className="mr-1 h-4 w-4" /> Reject
                    </Button>
                    <Button
                        onClick={() => setConfirmAction("approve")}
                        className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                </div>
            </Card>
        </div>
    );
}

