import { FC, useEffect, useState } from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { portfolioService } from '@/shared/services/portfolio.service';
import type { PortfolioProject } from '@/shared/types/portfolio';
import { toast } from 'sonner';

interface PublicPortfolioViewProps {
    profileId: string;
}

export const PublicPortfolioView: FC<PublicPortfolioViewProps> = ({ profileId }) => {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await portfolioService.getPublicProjects(profileId);
                setProjects(data);
            } catch (error) {
                console.error('Failed to load portfolio projects:', error);
                toast.error('Failed to load portfolio');
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [profileId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No portfolio projects to display</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} profileId={profileId} />
            ))}
        </div>
    );
};

interface ProjectCardProps {
    project: PortfolioProject;
    profileId: string;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
    // Get the first image as thumbnail
    const thumbnail = project.images?.[0];
    const imageUrl = thumbnail
        ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'}/api/uploads/${thumbnail.file.path.split('/').pop()}`
        : null;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail Image */}
            {imageUrl && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            {/* Project Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                            >
                                <Tag className="w-3 h-3" />
                                {tag.tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    {/* Image Count */}
                    <span className="text-xs text-gray-500">
                        {project.images?.length || 0} {project.images?.length === 1 ? 'image' : 'images'}
                    </span>

                    {/* Project Link */}
                    {project.projectLink && (
                        <a
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-[#7682e8] hover:underline"
                        >
                            View Project
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
