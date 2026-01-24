import { FC, useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { profileService } from '@/shared/services';
import type { Experience, CreateExperiencePayload, UpdateExperiencePayload } from '@/shared/types/profile';
import type { Experience as ModalExperience } from '@/shared/types/auth/signup';
import ExperienceModal from '@/shared/components/modals/ExperienceModal';

interface ExperienceSectionProps {
    profileId: string;
    experiences: Experience[];
    onUpdate: (experiences: Experience[]) => void;
    isEditable?: boolean;
}

export const ExperienceSection: FC<ExperienceSectionProps> = ({
    profileId,
    experiences,
    onUpdate,
    isEditable = true,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<ModalExperience | null>(null);

    // Adapter: Convert Profile Experience (ISO dates) to Modal Experience (Month/Year)
    const toModalExperience = (exp: Experience): ModalExperience => {
        const getMonthName = (dateStr?: string) => {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'long' });
        };

        const getYear = (dateStr?: string) => {
            if (!dateStr) return '';
            return new Date(dateStr).getFullYear().toString();
        };

        return {
            id: exp.id,
            title: exp.title,
            company: exp.company,
            location: exp.location,
            country: exp.country,
            description: exp.description || '',
            startMonth: getMonthName(exp.startDate),
            startYear: getYear(exp.startDate),
            endMonth: getMonthName(exp.endDate),
            endYear: getYear(exp.endDate),
            currentlyWorking: !exp.endDate,
        };
    };

    const openAddModal = () => {
        setEditingExperience(null);
        setIsModalOpen(true);
    };

    const openEditModal = (experience: Experience) => {
        setEditingExperience(toModalExperience(experience));
        setIsModalOpen(true);
    };

    const handleSave = async (modalData: ModalExperience) => {
        try {
            // Helper to get ISO string from Month/Year
            const getIsoDate = (month?: string, year?: string) => {
                if (!month || !year) return undefined;
                // Create date object (Month name to index)
                const monthIndex = new Date(`${month} 1, 2000`).getMonth();
                const date = new Date(parseInt(year), monthIndex, 1);
                // Adjust for timezone offset to ensure safe ISO string or just use UTC
                // Simply using YYYY-MM-DD format is safer
                const m = (monthIndex + 1).toString().padStart(2, '0');
                return `${year}-${m}-01T00:00:00.000Z`;
            };

            const startDate = getIsoDate(modalData.startMonth, modalData.startYear);
            // If currently working, endDate is undefined. Else verify end date.
            const endDate = modalData.currentlyWorking ? undefined : getIsoDate(modalData.endMonth, modalData.endYear);

            if (!startDate) {
                toast.error("Start date is required");
                return;
            }

            if (editingExperience) {
                // Update existing
                const payload: UpdateExperiencePayload = {
                    title: modalData.title,
                    company: modalData.company,
                    location: modalData.location || undefined,
                    country: modalData.country || undefined,
                    description: modalData.description || undefined,
                    startDate: startDate,
                    endDate: endDate,
                };

                const experienceId = editingExperience.id;

                const updated = await profileService.updateExperience(experienceId, payload);
                const newExperiences = experiences.map((e) =>
                    e.id === experienceId ? updated : e
                );
                onUpdate(newExperiences);
                toast.success('Experience updated successfully');
            } else {
                // Create new
                const payload: CreateExperiencePayload = {
                    providerProfileId: profileId,
                    title: modalData.title,
                    company: modalData.company,
                    location: modalData.location,
                    country: modalData.country,
                    description: modalData.description || undefined,
                    startDate: startDate,
                    endDate: endDate,
                };
                const created = await profileService.createExperience(payload);
                onUpdate([...experiences, created]);
                toast.success('Experience added successfully');
            }
            setIsModalOpen(false);
            setEditingExperience(null);
        } catch (error) {
            toast.error('Failed to save experience');
            console.error(error);
        }
    };

    const handleDelete = async (experienceId: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            await profileService.deleteExperience(experienceId);
            onUpdate(experiences.filter((e) => e.id !== experienceId));
            toast.success('Experience deleted successfully');
        } catch (error) {
            toast.error('Failed to delete experience');
            console.error(error);
        }
    };

    const formatDateRange = (startDate?: string, endDate?: string) => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const endStr = endDate
            ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'Present';
        return `${startStr} - ${endStr}`;
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Work Experience</label>
                </div>
                {isEditable && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center text-sm text-[#768de8] hover:text-[#5a6fd6]"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Experience
                    </button>
                )}
            </div>

            {experiences.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No work experience entries yet</p>
            ) : (
                <div className="space-y-3">
                    {experiences.map((experience) => (
                        <div
                            key={experience.id}
                            className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:border-gray-300 transition-colors"
                        >
                            <div>
                                <h4 className="font-medium text-gray-900">{experience.title}</h4>
                                <p className="text-sm text-gray-600">
                                    {experience.company}
                                    {experience.location && ` • ${experience.location}`}
                                    {experience.country && `, ${experience.country}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDateRange(experience.startDate, experience.endDate)}
                                </p>
                                {experience.description && (
                                    <p className="text-sm text-gray-500 mt-2">{experience.description}</p>
                                )}
                            </div>
                            {isEditable && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(experience)}
                                        className="p-1 text-gray-500 hover:text-[#768de8] transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(experience.id)}
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
                <ExperienceModal
                    experience={editingExperience}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingExperience(null);
                    }}
                />
            )}
        </div>
    );
};

export default ExperienceSection;
