import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Save, X, ExternalLink, Calendar, Tag as TagIcon, Plus } from 'lucide-react';
import { portfolioService } from '@/shared/services/portfolio.service';
import type { PortfolioProject } from '@/shared/types/portfolio';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import { getFilePath } from '@/shared/utils/get-file-path';
import { FileUploadSection, FileItem, getNewFilesForUpload, ExistingFile } from '@/shared/components/common/FileUploadSection';

export default function PortfolioProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<PortfolioProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Edit form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        projectLink: '',
        isPublic: true,
    });
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [files, setFiles] = useState<ExistingFile[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // Track image IDs to delete

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const loadProject = async () => {
        try {
            setLoading(true);
            const projects = await portfolioService.getMyProjects();
            const foundProject = projects.find(p => p.id === projectId);

            if (foundProject) {
                setProject(foundProject);
                // Initialize edit form with project data
                setFormData({
                    name: foundProject.name,
                    description: foundProject.description,
                    projectLink: foundProject.projectLink || '',
                    isPublic: foundProject.isPublic,
                });
                setTags(foundProject.tags?.map(t => t.tag) || []);

                // Convert existing images to FileItems
                const existingFileItems: ExistingFile[] = foundProject.images?.map(img => ({
                    id: img.id,
                    name: img.file.filename,
                    mimgetype: img.file.mimetype || 'image/webp',
                    originalname:img.file.filename
                })) || [];
                setFiles(existingFileItems);
            } else {
                toast.error('Project not found');
                navigate('/profile/portfolio');
            }
        } catch (error) {
            console.error('Failed to load project:', error);
            toast.error('Failed to load project details');
            navigate('/profile/portfolio');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTagClick();
        }
    };

    const handleAddTagClick = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleFilesChange = (newFiles: FileItem[]) => {
        // Track which existing images were removed
        const existingImageIds = project?.images?.map(img => img.id) || [];
        const currentFileIds = newFiles.filter(f => f.id).map(f => f.id);
        const deletedIds = existingImageIds.filter(id => !currentFileIds.includes(id));

        setImagesToDelete(deletedIds);
        setFiles(newFiles);
    };

    const handleSave = async () => {
        if (!project) return;

        if (!formData.name || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        try {
            // 1. Delete removed images
            for (const imageId of imagesToDelete) {
                await portfolioService.removeProjectImage(project.id, imageId);
            }

            // 2. Add new images
            const newFiles = getNewFilesForUpload(files);
            for (const file of newFiles) {
                await portfolioService.addProjectImage(project.id, file);
            }

            // 3. Update project metadata
            await portfolioService.updateProject(project.id, {
                name: formData.name,
                description: formData.description,
                projectLink: formData.projectLink || undefined,
                isPublic: formData.isPublic,
                tags,
            });

            toast.success('Project updated successfully');
            setIsEditMode(false);
            setImagesToDelete([]);
            // Reload project to get updated data
            await loadProject();
        } catch (error) {
            console.error('Failed to update project:', error);
            toast.error('Failed to update project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset to original project data
        if (project) {
            setFormData({
                name: project.name,
                description: project.description,
                projectLink: project.projectLink || '',
                isPublic: project.isPublic,
            });
            setTags(project.tags?.map(t => t.tag) || []);

            const existingFileItems: ExistingFile[] = project.images?.map(img => ({
                id: img.id,
                name: img.file.filename,
                size: 0,
                mimetype: img.file.mimetype || 'image/webp',
                url: getFilePath(img.file.filename),
                category: 'image',
            })) || [];
            setFiles(existingFileItems);
            setImagesToDelete([]);
        }
        setIsEditMode(false);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    const selectedImage = files[selectedImageIndex];
    const imageUrl = getFilePath(selectedImage.name) || 'https://via.placeholder.com/800x600?text=No+Image';

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link to="/profile/portfolio" className="hover:text-gray-700">Portfolio</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{isEditMode ? 'Edit Project' : project.name}</span>
                    </nav>
                </div>

                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="text-3xl font-bold text-gray-900 mb-2 w-full border-b-2 border-[#7682e8] focus:outline-none"
                                    placeholder="Project Name"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Created {formatDate(project.createdAt)}</span>
                                </div>
                                {isEditMode ? (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublic}
                                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                            className="w-4 h-4 text-[#7682e8] border-gray-300 rounded focus:ring-[#7682e8]"
                                        />
                                        <span className="text-gray-700">Make Public</span>
                                    </label>
                                ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs ${project.isPublic
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {project.isPublic ? 'Public' : 'Private'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 px-4">
                            {isEditMode ? (
                                <>
                                    <Button
                                        onClick={handleCancelEdit}
                                        disabled={submitting}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={submitting}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {submitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => navigate('/profile/portfolio')}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2 space-y-6">
                        {isEditMode ? (
                            /* Edit Mode - Image Manager */
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Images</h3>
                                <FileUploadSection
                                    files={files}
                                    onFilesChange={handleFilesChange}
                                    maxFiles={5}
                                    acceptedFileTypes="image/*"
                                    multiple={true}
                                    label=""
                                    uploadButtonText="Add Images"
                                    emptyStateText="Click to upload project images (max 5)"
                                    showFileNumbers={true}
                                    enableCompression={true}
                                    blockVideos={true}
                                    blockAudio={true}
                                />
                            </div>
                        ) : (
                            /* View Mode - Image Gallery */
                            <>
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={imageUrl}
                                            alt={project.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {files.length > 1 && (
                                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Gallery ({files.length} images)</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                            {files.map((file, index) => (
                                                <button
                                                    key={file.id || index}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                        ? 'border-[#7682e8] ring-2 ring-[#7682e8]/20'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={getFilePath(file.name) || ''}
                                                        alt={`${project.name} - ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
                            {isEditMode ? (
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
                                    placeholder="Describe your project..."
                                />
                            ) : (
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        {/* Tags */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies</h3>
                            {isEditMode ? (
                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <div className="relative flex-1">
                                            <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleAddTag}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent text-sm"
                                                placeholder="Add tag..."
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddTagClick}
                                            className="px-3 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors whitespace-nowrap text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-[#7682e8]/10 text-[#7682e8] text-sm rounded-full"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:bg-[#7682e8]/20 rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags && project.tags.length > 0 ? (
                                        project.tags.map((tagItem, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-[#7682e8]/10 text-[#7682e8] text-sm rounded-full"
                                            >
                                                {tagItem.tag}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No tags yet</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Related Links */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔗 Related Links</h3>
                            {isEditMode ? (
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={formData.projectLink}
                                        onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent text-sm"
                                        placeholder="https://project-url.com"
                                    />
                                </div>
                            ) : (
                                project.projectLink ? (
                                    <a
                                        href={project.projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[#7682e8] hover:text-[#6571d4] transition-colors break-all"
                                    >
                                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{project.projectLink}</span>
                                    </a>
                                ) : (
                                    <p className="text-sm text-gray-500">No link added</p>
                                )
                            )}
                        </div>

                        {/* Project Stats */}
                        {!isEditMode && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Images</span>
                                        <span className="font-medium text-gray-900">{files.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tags</span>
                                        <span className="font-medium text-gray-900">{project.tags?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Visibility</span>
                                        <span className="font-medium text-gray-900">{project.isPublic ? 'Public' : 'Private'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
