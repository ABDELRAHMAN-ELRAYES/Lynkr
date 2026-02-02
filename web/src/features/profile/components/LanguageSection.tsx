import { FC, useState } from 'react';
import { Plus, Pencil, Trash2, Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Language, LanguageProficiency } from '@/shared/types/profile';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import Button from '@/shared/components/ui/Button';

interface LanguageSectionProps {
    languages: Language[];
    onUpdate: (languages: Language[]) => void;
    isEditable?: boolean;
}

interface LanguageFormData {
    language: string;
    proficiency: LanguageProficiency;
}

const proficiencyLevels: { value: LanguageProficiency; label: string }[] = [
    { value: 'BASIC', label: 'Basic' },
    { value: 'CONVERSATIONAL', label: 'Conversational' },
    { value: 'FLUENT', label: 'Fluent' },
    { value: 'NATIVE', label: 'Native' },
];

const proficiencyColors: Record<LanguageProficiency, string> = {
    BASIC: 'bg-gray-100 text-gray-700',
    CONVERSATIONAL: 'bg-blue-100 text-blue-700',
    FLUENT: 'bg-green-100 text-green-700',
    NATIVE: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const initialFormData: LanguageFormData = {
    language: '',
    proficiency: 'CONVERSATIONAL',
};

export const LanguageSection: FC<LanguageSectionProps> = ({
    languages,
    onUpdate,
    isEditable = true,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
    const [formData, setFormData] = useState<LanguageFormData>(initialFormData);

    const openAddModal = () => {
        setEditingLanguage(null);
        setFormData(initialFormData);
        setIsModalOpen(true);
    };

    const openEditModal = (language: Language) => {
        setEditingLanguage(language);
        setFormData({
            language: language.language,
            proficiency: language.proficiency,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.language) {
            toast.error('Please enter a language');
            return;
        }

        // Check for duplicates
        const isDuplicate = languages.some(
            (l) => l.language.toLowerCase() === formData.language.toLowerCase() && l.id !== editingLanguage?.id
        );
        if (isDuplicate) {
            toast.error('This language is already added');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingLanguage) {
                // Update existing (local update only since languages are nested)
                const newLanguages = languages.map((l) =>
                    l.id === editingLanguage.id
                        ? { ...l, language: formData.language, proficiency: formData.proficiency }
                        : l
                );
                onUpdate(newLanguages);
                toast.success('Language updated');
            } else {
                // Add new (local update)
                const newLanguage: Language = {
                    id: `temp-${Date.now()}`,
                    providerProfileId: '',
                    language: formData.language,
                    proficiency: formData.proficiency,
                };
                onUpdate([...languages, newLanguage]);
                toast.success('Language added');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to save language');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (languageId: string) => {
        onUpdate(languages.filter((l) => l.id !== languageId));
        toast.success('Language removed');
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Languages</label>
                </div>
                {isEditable && (
                    <button
                        onClick={openAddModal}
                        className="flex items-center text-sm text-[#768de8] hover:text-[#5a6fd6]"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Language
                    </button>
                )}
            </div>

            {languages.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No languages added yet</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                        <div
                            key={language.id}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${proficiencyColors[language.proficiency]}`}
                        >
                            <span className="font-medium">{language.language}</span>
                            <span className="text-xs opacity-70">
                                ({proficiencyLevels.find((l) => l.value === language.proficiency)?.label})
                            </span>
                            {isEditable && (
                                <div className="flex items-center gap-1 ml-1">
                                    <button
                                        onClick={() => openEditModal(language)}
                                        className="p-0.5 hover:bg-white/30 rounded-full transition-colors"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(language.id)}
                                        className="p-0.5 hover:bg-white/30 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingLanguage ? 'Edit Language' : 'Add Language'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Language *
                            </label>
                            <input
                                type="text"
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                placeholder="e.g., English, Spanish, Arabic"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Proficiency Level
                            </label>
                            <select
                                value={formData.proficiency}
                                onChange={(e) =>
                                    setFormData({ ...formData, proficiency: e.target.value as LanguageProficiency })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8]"
                            >
                                {proficiencyLevels.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-[#768de8] hover:bg-[#5a6fd6]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LanguageSection;
