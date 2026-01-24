import { FC, useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import type { ProfileSkill } from '@/shared/types/profile';

interface SkillsSectionProps {
    skills: ProfileSkill[];
    onUpdate: (skills: ProfileSkill[]) => void;
    isEditable?: boolean;
}

export const SkillsSection: FC<SkillsSectionProps> = ({
    skills,
    onUpdate,
    isEditable = true,
}) => {
    const [newSkill, setNewSkill] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddSkill = () => {
        const trimmedSkill = newSkill.trim();
        if (!trimmedSkill) return;

        // Check for duplicates
        const isDuplicate = skills.some(
            (s) => s.skillName.toLowerCase() === trimmedSkill.toLowerCase()
        );
        if (isDuplicate) {
            setNewSkill('');
            return;
        }

        const newSkillObj: ProfileSkill = {
            id: `temp-${Date.now()}`,
            skillName: trimmedSkill,
        };
        onUpdate([...skills, newSkillObj]);
        setNewSkill('');
        setIsAdding(false);
    };

    const handleRemoveSkill = (skillId: string) => {
        onUpdate(skills.filter((s) => s.id !== skillId));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        } else if (e.key === 'Escape') {
            setNewSkill('');
            setIsAdding(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Skills</label>
                </div>
                {isEditable && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center text-sm text-[#768de8] hover:text-[#5a6fd6]"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Skill
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                        {skill.skillName}
                        {isEditable && (
                            <button
                                onClick={() => handleRemoveSkill(skill.id)}
                                className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </span>
                ))}

                {isAdding && (
                    <div className="inline-flex items-center gap-1">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                if (!newSkill.trim()) {
                                    setIsAdding(false);
                                }
                            }}
                            placeholder="Type skill..."
                            autoFocus
                            className="px-3 py-1.5 text-sm border border-[#768de8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#768de8] w-32"
                        />
                        <button
                            onClick={handleAddSkill}
                            className="p-1.5 bg-[#768de8] text-white rounded-full hover:bg-[#5a6fd6]"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setNewSkill('');
                                setIsAdding(false);
                            }}
                            className="p-1.5 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {skills.length === 0 && !isAdding && (
                    <p className="text-sm text-gray-500 italic">No skills added yet</p>
                )}
            </div>
        </div>
    );
};

export default SkillsSection;
