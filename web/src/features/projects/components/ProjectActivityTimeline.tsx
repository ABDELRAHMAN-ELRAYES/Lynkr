import { FC, useState, useEffect } from 'react';
import { Activity, FileText, CheckCircle, XCircle, Upload, Trash2 } from 'lucide-react';
import { projectService } from '@/shared/services/project.service';
import type { ProjectActivity } from '@/shared/types/project';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ProjectActivityTimelineProps {
    projectId: string;
}

export const ProjectActivityTimeline: FC<ProjectActivityTimelineProps> = ({ projectId }) => {
    const [activities, setActivities] = useState<ProjectActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, [projectId]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjectActivities(projectId);
            setActivities(data);
        } catch (error: any) {
            console.error('Failed to load activities:', error);
            toast.error('Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'FILE_UPLOADED':
                return <Upload className="w-4 h-4" />;
            case 'FILE_DELETED':
                return <Trash2 className="w-4 h-4" />;
            case 'COMPLETION_REQUESTED':
                return <CheckCircle className="w-4 h-4" />;
            case 'COMPLETION_CONFIRMED':
                return <CheckCircle className="w-4 h-4" />;
            case 'PROJECT_CANCELLED':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'FILE_UPLOADED':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
            case 'FILE_DELETED':
                return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
            case 'COMPLETION_REQUESTED':
            case 'COMPLETION_CONFIRMED':
                return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
            case 'PROJECT_CANCELLED':
                return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getActivityDescription = (activity: ProjectActivity) => {
        const userName = activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'Someone';

        switch (activity.type) {
            case 'FILE_UPLOADED':
                return `${userName} uploaded a file`;
            case 'FILE_DELETED':
                return `${userName} deleted a file`;
            case 'COMPLETION_REQUESTED':
                return `${userName} marked the project as complete`;
            case 'COMPLETION_CONFIRMED':
                return `${userName} confirmed project completion`;
            case 'PROJECT_CANCELLED':
                return `${userName} cancelled the project`;
            default:
                return `${userName} performed an action`;
        }
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

    if (activities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No activities yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Project Activity
            </h3>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="relative flex gap-4">
                        {/* Timeline Line */}
                        {index < activities.length - 1 && (
                            <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        )}

                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {getActivityDescription(activity)}
                                    </p>
                                    {activity.metadata && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {activity.metadata.fileName && `File: ${activity.metadata.fileName}`}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
