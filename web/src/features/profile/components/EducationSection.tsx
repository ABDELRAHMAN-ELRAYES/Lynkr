import { FC, useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { profileService } from '@/shared/services';
import type { Education, CreateEducationPayload, UpdateEducationPayload } from '@/shared/types/profile';
import type { Education as ModalEducation } from '@/shared/types/auth/signup';
import EducationModal from '@/shared/components/modals/EducationModal';

interface EducationSectionProps {
    profileId: string;
    educations: Education[];
    onUpdate: (educations: Education[]) => void;
    isEditable?: boolean;
}

export const EducationSection: FC<EducationSectionProps> = ({
    profileId,
    educations,
    onUpdate,
    isEditable = true,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<ModalEducation | null>(null);

    // Adapter: Convert Profile Education (ISO dates) to Modal Education (Years)
    const toModalEducation = (edu: Education): ModalEducation => {
        return {
            id: edu.id,
            school: edu.school,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            description: edu.description || '',
            fromYear: edu.startDate ? new Date(edu.startDate).getFullYear().toString() : '',
            toYear: edu.endDate ? new Date(edu.endDate).getFullYear().toString() : '',
        };
    };

    const openAddModal = () => {
        setEditingEducation(null);
        setIsModalOpen(true);
    };

    const openEditModal = (education: Education) => {
        setEditingEducation(toModalEducation(education));
        setIsModalOpen(true);
    };

    const handleSave = async (modalData: ModalEducation) => {
        try {
            // Helper to get ISO string from year
            const getIsoDate = (year: string, isEnd = false) => {
                if (!year) return undefined;
                // Set to Jan 1st for start, Dec 31st for end roughly, or just use year-01-01
                // Given the modal only provides Year, we default to Jan 1st for start
                // For end year, we might want Dec 31st? Or just Jan 1st. 
                // Let's stick to Jan 1st to be safe or whatever backend prefers.
                // Profile uses ISO strings. 
                return `${year}-01-01T00:00:00.000Z`;
            };

            const startDate = getIsoDate(modalData.fromYear);
            const endDate = getIsoDate(modalData.toYear);

            if (!startDate) {
                toast.error("Start year is required");
                return;
            }

            if (editingEducation) {
                // Update existing
                const payload: UpdateEducationPayload = {
                    school: modalData.school,
                    degree: modalData.degree,
                    fieldOfStudy: modalData.fieldOfStudy,
                    description: modalData.description || undefined,
                    startDate: startDate,
                    endDate: endDate,
                };

                // We need the original ID. Modal data might use temporary ID if new, but here we are editing so it should match.
                // However, the modal uses 'id' string.
                const educationId = editingEducation.id;

                const updated = await profileService.updateEducation(educationId, payload);
                const newEducations = educations.map((e) =>
                    e.id === educationId ? updated : e
                );
                onUpdate(newEducations);
                toast.success('Education updated successfully');
            } else {
                // Create new
                const payload: CreateEducationPayload = {
                    providerProfileId: profileId,
                    school: modalData.school,
                    degree: modalData.degree,
                    fieldOfStudy: modalData.fieldOfStudy,
                    description: modalData.description || undefined,
                    startDate: startDate,
                    endDate: endDate,
                };
                const created = await profileService.createEducation(payload);
                onUpdate([...educations, created]);
                toast.success('Education added successfully');
            }
            setIsModalOpen(false);
            setEditingEducation(null);
        } catch (error) {
            toast.error('Failed to save education');
            console.error(error);
        }
    };

    const handleDelete = async (educationId: string) => {
        if (!confirm('Are you sure you want to delete this education?')) return;

        try {
            await profileService.deleteEducation(educationId);
            onUpdate(educations.filter((e) => e.id !== educationId));
            toast.success('Education deleted successfully');
        } catch (error) {
            toast.error('Failed to delete education');
            console.error(error);
        }
    };

    const formatDateRange = (startDate?: string, endDate?: string) => {
        if (!startDate) return '';
        const start = new Date(startDate).getFullYear();
        const end = endDate ? new Date(endDate).getFullYear() : 'Present';
        return `${start} - ${end}`;
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Education</label>
                </div>
                {isEditable && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center text-sm text-[#768de8] hover:text-[#5a6fd6]"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Education
                    </button>
                )}
            </div>

            {educations.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No education entries yet</p>
            ) : (
                <div className="space-y-3">
                    {educations.map((education) => (
                        <div
                            key={education.id}
                            className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:border-gray-300 transition-colors"
                        >
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    {education.degree} in {education.fieldOfStudy}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {education.school} • {formatDateRange(education.startDate, education.endDate)}
                                </p>
                                {education.description && (
                                    <p className="text-sm text-gray-500 mt-1">{education.description}</p>
                                )}
                            </div>
                            {isEditable && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(education)}
                                        className="p-1 text-gray-500 hover:text-[#768de8] transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(education.id)}
                                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <EducationModal
                    education={editingEducation}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingEducation(null);
                    }}
                />
            )}
        </div>
    );
};

export default EducationSection;
