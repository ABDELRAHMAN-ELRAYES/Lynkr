import { FC, useState, useEffect } from 'react';
import { FileText, Download, Trash2, User } from 'lucide-react';
import { projectService } from '@/shared/services/project.service';
import type { ProjectFile } from '@/shared/types/project';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/shared/components/ui/Button';

interface ProjectFileListProps {
    projectId: string;
    onFileDeleted: () => void;
}

export const ProjectFileList: FC<ProjectFileListProps> = ({ projectId, onFileDeleted }) => {
    const { user } = useAuth();
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadFiles();
    }, [projectId]);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjectFiles(projectId);
            setFiles(data);
        } catch (error: any) {
            console.error('Failed to load files:', error);
            toast.error('Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }

        setDeleting(fileId);
        try {
            await projectService.deleteProjectFile(projectId, fileId);
            toast.success('File deleted successfully');
            onFileDeleted();
            loadFiles();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to delete file';
            toast.error(errorMessage);
        } finally {
            setDeleting(null);
        }
    };

    const handleDownload = (file: ProjectFile) => {
        window.open(file.url, '_blank');
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7682e8]"></div>
                </div>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No files uploaded yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Project Files ({files.length})
            </h3>

            <div className="space-y-3">
                {files.map((file) => {
                    const canDelete = file.uploaderId === user?.id;

                    return (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {file.filename}
                                    </p>
                                    {file.description && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                            {file.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <User className="w-3 h-3" />
                                        <span>Uploaded by {file.uploader?.firstName} {file.uploader?.lastName}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownload(file)}
                                    className="flex-shrink-0"
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                                {canDelete && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(file.id)}
                                        disabled={deleting === file.id}
                                        className="flex-shrink-0 text-red-600 hover:text-red-700 border-red-300"
                                    >
                                        {deleting === file.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
