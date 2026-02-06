import { FC, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import Button from '@/shared/components/ui/Button';
import { projectService } from '@/shared/services/project.service';
import { toast } from 'sonner';

interface ProjectFileUploadProps {
    projectId: string;
    onUploadSuccess: () => void;
}

export const ProjectFileUpload: FC<ProjectFileUploadProps> = ({ projectId, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError('');

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('File size must be less than 10MB');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        try {
            await projectService.uploadProjectFile(projectId, selectedFile, description);
            toast.success('File uploaded successfully');
            setSelectedFile(null);
            setDescription('');
            onUploadSuccess();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to upload file';
            toast.error(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setDescription('');
        setError('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upload File</h3>

            <div className="space-y-4">
                {/* File Input */}
                <div>
                    <Label htmlFor="file-upload">Select File</Label>
                    <div className="mt-2">
                        {!selectedFile ? (
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Max size: 10MB</p>
                                </div>
                                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 flex-1">
                                    <Upload className="w-5 h-5 text-gray-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
                                    disabled={uploading}
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        )}
                    </div>
                    {error && (
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {selectedFile && (
                    <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the file..."
                            className="mt-2"
                        />
                    </div>
                )}

                {/* Upload Button */}
                {selectedFile && (
                    <Button
                        onClick={handleUpload}
                        disabled={uploading || !!error}
                        className="w-full bg-[#7682e8] text-white"
                    >
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </Button>
                )}
            </div>
        </div>
    );
};
