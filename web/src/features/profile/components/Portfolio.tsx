import { FC, useEffect, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ExternalLink, X, Tag as TagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { portfolioService } from '@/shared/services/portfolio.service';
import type { PortfolioProject, CreatePortfolioProjectData } from '@/shared/types/portfolio';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import { FileUploadSection, FileItem, getNewFilesForUpload } from '@/shared/components/common/FileUploadSection';
import { getFilePath } from '@/shared/utils/get-file-path';

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await portfolioService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleTogglePrivacy = async (project: PortfolioProject) => {
    try {
      const updated = await portfolioService.togglePrivacy(project.id, !project.isPublic);
      setProjects(projects.map(p => p.id === project.id ? updated : p));
      toast.success(`Project is now ${updated.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
      toast.error('Failed to update project privacy');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-sm text-gray-500 mt-1">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">You haven't added any portfolio projects yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onTogglePrivacy={handleTogglePrivacy}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProjectModal
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            loadProjects();
          }}
        />
      )}
    </>
  );
}

interface ProjectCardProps {
  project: PortfolioProject;
  onDelete: (id: string) => void;
  onTogglePrivacy: (project: PortfolioProject) => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, onDelete, onTogglePrivacy }) => {
  const navigate = useNavigate();
  const thumbnail = project.images?.[0];
  const imageUrl = thumbnail
    ? getFilePath(thumbnail.file.filename) : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
      {/* Image */}
      <div
        className="relative cursor-pointer"
        onClick={() => navigate(`/profile/portfolio/${project.id}`)}
      >
        <img
          src={imageUrl}
          alt={project.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {project.isPublic ? (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Public
            </span>
          ) : (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              Private
            </span>
          )}
        </div>
        {project.images && project.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            +{project.images.length - 1} more
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-[#7682e8] transition-colors"
          onClick={() => navigate(`/profile/portfolio/${project.id}`)}
        >{project.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {tag.tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => navigate(`/profile/portfolio/${project.id}`)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-white bg-[#7682e8] rounded-lg hover:bg-[#6571d4] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Project
          </button>
          <button
            onClick={() => onTogglePrivacy(project)}
            className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={project.isPublic ? 'Make Private' : 'Make Public'}
          >
            {project.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProjectModalProps {
  project?: PortfolioProject | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectModal: FC<ProjectModalProps> = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    projectLink: project?.projectLink || '',
    isPublic: project?.isPublic ?? true,
  });
  const [tags, setTags] = useState<string[]>(project?.tags?.map(t => t.tag) || []);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!project && files.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const uploadImages = getNewFilesForUpload(files);
    if (!project && uploadImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (uploadImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSubmitting(true);

    try {
      if (project) {
        // Update existing project
        await portfolioService.updateProject(project.id, {
          name: formData.name,
          description: formData.description,
          projectLink: formData.projectLink || undefined,
          isPublic: formData.isPublic,
          tags,
        });
        toast.success('Project updated successfully');
      } else {
        // Create new project
        const projectData: CreatePortfolioProjectData = {
          name: formData.name,
          description: formData.description,
          projectLink: formData.projectLink || undefined,
          isPublic: formData.isPublic,
          tags,
          images: uploadImages,
        };
        await portfolioService.createProject(projectData);
        toast.success('Project created successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mt-[7rem]">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
              placeholder="E.g., E-commerce Platform"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
              placeholder="Describe your project, technologies used, and outcomes..."
              required
            />
          </div>

          {/* Project Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Link (Optional)
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.projectLink}
                onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
                  placeholder="Type a tag..."
                />
              </div>
              <button
                type="button"
                onClick={handleAddTagClick}
                className="px-4 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors whitespace-nowrap"
              >
                + Add
              </button>
            </div>
            {/* Tag Chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
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
            )}
          </div>

          {/* Images */}
          {!project && (
            <FileUploadSection
              files={files}
              onFilesChange={setFiles}
              maxFiles={5}
              acceptedFileTypes="image/*"
              multiple={true}
              label="Project Images"
              uploadButtonText="Add Images"
              emptyStateText="Click to upload project images (1-5)"
              showFileNumbers={true}
              enableCompression={true}
              blockVideos={true}
              blockAudio={true}
            />
          )}

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-[#7682e8] border-gray-300 rounded focus:ring-[#7682e8]"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this project public (visible to clients)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : (project ? 'Update' : 'Create')} Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};