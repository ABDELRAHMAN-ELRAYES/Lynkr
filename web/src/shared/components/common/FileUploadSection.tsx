import {
    File,
    FileText,
    Image,
    Archive,
    Plus,
    Upload,
    X,
    HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { getFilePath } from "@/shared/utils/get-file-path";
import { Label } from "../ui/label";

// File type categories
export type FileCategory = "image" | "document" | "archive" | "other";

// Existing file from API
export interface ExistingFile {
    id: string;
    name: string;
    mimetype: string;
    originalname?: string;
}

// Union type for both new and existing files
export type FileItem = File | ExistingFile;

// Type guard to check if item is existing file
export const isExistingFile = (item: FileItem): item is ExistingFile => {
    return "id" in item && "mimetype" in item && typeof item.id === "string";
};

// Compression options
interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
}

// File Upload Component
export const FileUploadSection = ({
    files,
    onFilesChange,
    maxFiles,
    acceptedFileTypes = "*/*",
    multiple = true,
    label = "Files",
    uploadButtonText = "Add Files",
    emptyStateText = "Click to upload files",
    showFileNames = true,
    showFileNumbers = true,
    showFileTypes = true,
    groupByCategory = false,
    allowAllFileTypes = false,
    enableCompression = true,
    compressionOptions = {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
        maxSizeMB: 2,
    },
    baseUrl = "/uploads",
    blockVideos = true,
    blockAudio = true,
}: {
    files: FileItem[];
    onFilesChange: (files: FileItem[]) => void;
    maxFiles?: number;
    acceptedFileTypes?: string;
    multiple?: boolean;
    label?: string;
    uploadButtonText?: string;
    emptyStateText?: string;
    showFileNames?: boolean;
    showFileNumbers?: boolean;
    showFileTypes?: boolean;
    groupByCategory?: boolean;
    allowAllFileTypes?: boolean;
    enableCompression?: boolean;
    compressionOptions?: CompressionOptions;
    baseUrl?: string;
    blockVideos?: boolean;
    blockAudio?: boolean;
}) => {
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);

    // Check if file is video or audio
    const isVideoOrAudioFile = (file: File): boolean => {
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();

        const videoExtensions =
            /\.(mp4|avi|mov|wmv|flv|mkv|webm|m4v|3gp|mpeg|mpg)$/i;
        const audioExtensions = /\.(mp3|wav|ogg|flac|aac|m4a|wma)$/i;

        const isVideo =
            blockVideos && (type.startsWith("video/") || videoExtensions.test(name));
        const isAudio =
            blockAudio && (type.startsWith("audio/") || audioExtensions.test(name));

        return isVideo || isAudio;
    };

    // Compress image file using browser-image-compression
    const compressImage = async (
        file: File,
        options: CompressionOptions
    ): Promise<File> => {
        try {
            const compressionOptions = {
                maxSizeMB: options.maxSizeMB || 2,
                maxWidthOrHeight: Math.max(
                    options.maxWidth || 1920,
                    options.maxHeight || 1920
                ),
                useWebWorker: true,
                initialQuality: options.quality || 0.8,
                fileType: file.type,
            };

            const compressedBlob = await imageCompression(file, compressionOptions);

            const compressedFile = new (window.File as {
                new(
                    fileBits: BlobPart[],
                    fileName: string,
                    options?: FilePropertyBag
                ): File;
            })([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            return compressedFile;
        } catch (error) {
            return file;
        }
    };

    // Categorize file
    const categorizeFile = (item: FileItem): FileCategory => {
        const type = isExistingFile(item)
            ? item.mimetype.toLowerCase()
            : item.type.toLowerCase();
        const name = isExistingFile(item) ? item.name : item.name;

        if (type.startsWith("image/")) return "image";

        if (
            type.includes("pdf") ||
            type.includes("word") ||
            type.includes("document") ||
            type.includes("excel") ||
            type.includes("spreadsheet") ||
            type.includes("text") ||
            type.includes("presentation") ||
            type.includes("powerpoint") ||
            type.includes("msword") ||
            type.includes("officedocument") ||
            name.match(/\.(docx?|xlsx?|pptx?|txt|rtf|pdf)$/i)
        ) {
            return "document";
        }

        if (
            type.includes("zip") ||
            type.includes("rar") ||
            type.includes("tar") ||
            type.includes("7z") ||
            type.includes("gzip") ||
            type.includes("compressed") ||
            name.match(/\.(zip|rar|7z|tar|gz)$/i)
        ) {
            return "archive";
        }

        return "other";
    };

    // Generate preview URLs
    useEffect(() => {
        const generatePreviews = async () => {
            const previews = await Promise.all(
                files.map(async (item) => {
                    const category = categorizeFile(item);

                    if (isExistingFile(item)) {
                        if (category === "image") {
                            return `${item.name}`;
                        }
                        return "";
                    } else {
                        if (category === "image") {
                            return URL.createObjectURL(item);
                        }
                        return "";
                    }
                })
            );
            setFilePreviews(previews);
        };

        generatePreviews();

        return () => {
            filePreviews.forEach((preview) => {
                if (preview && preview.startsWith("blob:")) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [files, baseUrl]);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        let newFiles = Array.from(selectedFiles);

        // Block video and audio files
        if (blockVideos || blockAudio) {
            const blockedFiles = newFiles.filter(isVideoOrAudioFile);
            if (blockedFiles.length > 0) {
                const blockedTypes = [];
                if (blockVideos) blockedTypes.push("video");
                if (blockAudio) blockedTypes.push("audio");

                toast.error(`Uploading ${blockedTypes.join(" and ")} files is not allowed`);

                // Remove blocked files from the selection
                newFiles = newFiles.filter((file) => !isVideoOrAudioFile(file));

                if (newFiles.length === 0) {
                    event.target.value = "";
                    return;
                }
            }
        }

        if (maxFiles && files.length + newFiles.length > maxFiles) {
            toast.error(`Cannot add more than ${maxFiles} files`);
            return;
        }

        if (enableCompression) {
            setIsCompressing(true);
            try {
                const processedFiles = await Promise.all(
                    newFiles.map(async (file) => {
                        if (file.type.startsWith("image/")) {
                            try {
                                return await compressImage(file, compressionOptions);
                            } catch (error) {
                                return file;
                            }
                        }
                        return file;
                    })
                );
                newFiles = processedFiles;
            } catch (error) {
                toast.error("Error occurred while compressing files");
            } finally {
                setIsCompressing(false);
            }
        }

        if (!allowAllFileTypes && acceptedFileTypes !== "*/*") {
            const validFiles = newFiles.filter((file) =>
                isFileTypeAccepted(file, acceptedFileTypes)
            );

            if (validFiles.length !== newFiles.length) {
                toast.warning(
                    `Some unsupported files were rejected. Added ${validFiles.length} file(s) only.`
                );
            }

            const filesToAdd = multiple ? validFiles : [validFiles[0]];
            onFilesChange([...files, ...filesToAdd]);
            toast.success(`Added ${filesToAdd.length} file(s) successfully`);
        } else {
            const filesToAdd = multiple ? newFiles : [newFiles[0]];
            onFilesChange([...files, ...filesToAdd]);
            toast.success(`Added ${filesToAdd.length} file(s) successfully`);
        }

        event.target.value = "";
    };

    const isFileTypeAccepted = (file: File, acceptedTypes: string): boolean => {
        if (acceptedTypes === "*/*") return true;

        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        const fileType = file.type;
        const acceptedList = acceptedTypes.split(",").map((type) => type.trim());

        return acceptedList.some((pattern) => {
            if (pattern.startsWith(".")) {
                return fileExtension === pattern;
            } else if (pattern.endsWith("/*")) {
                const category = pattern.split("/*")[0];
                return fileType.startsWith(category);
            } else {
                return fileType === pattern;
            }
        });
    };

    const handleRemoveFile = (index: number) => {
        if (filePreviews[index] && filePreviews[index].startsWith("blob:")) {
            URL.revokeObjectURL(filePreviews[index]);
        }

        const newFiles = files.filter((_, i) => i !== index);
        onFilesChange(newFiles);
        toast.success("File removed successfully");
    };

    const canAddMore = !maxFiles || files.length < maxFiles;
    const filesCountText = maxFiles
        ? `(${files.length}/${maxFiles})`
        : `(${files.length})`;

    const getFileIcon = (item: FileItem) => {
        const category = categorizeFile(item);

        switch (category) {
            case "image":
                return <Image className="h-8 w-8 text-blue-500" />;
            case "document":
                return <FileText className="h-8 w-8 text-red-500" />;
            case "archive":
                return <Archive className="h-8 w-8 text-orange-500" />;
            default:
                return < HelpCircle className="h-8 w-8 text-gray-500" />;
        }
    };

    const getFileType = (item: FileItem) => {
        const category = categorizeFile(item);
        const type = isExistingFile(item) ? item.mimetype : item.type;

        switch (category) {
            case "image":
                return "Image";
            case "document":
                if (type.includes("pdf")) return "PDF";
                if (type.includes("word") || type.includes("document"))
                    return "Word Document";
                if (type.includes("excel") || type.includes("spreadsheet"))
                    return "Excel Spreadsheet";
                if (type.includes("text")) return "Text File";
                if (type.includes("presentation")) return "Presentation";
                return "Document";
            case "archive":
                return "Compressed File";
            default:
                const name = isExistingFile(item) ? item.name : item.name;
                const extension = name.split(".").pop()?.toUpperCase();
                if (extension && extension.length <= 5) {
                    return `${extension} File`;
                }
                return type || "File";
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileName = (item: FileItem) => {
        return isExistingFile(item) ? item.name : item.name;
    };

    const getFileSize = (item: FileItem) => {
        return isExistingFile(item) ? null : formatFileSize(item.size);
    };

    const groupedFiles = groupByCategory
        ? files.reduce((acc, item, index) => {
            const category = categorizeFile(item);
            if (!acc[category]) acc[category] = [];
            acc[category].push({ item, index });
            return acc;
        }, {} as Record<FileCategory, { item: FileItem; index: number }[]>)
        : null;

    const categoryLabels: Record<FileCategory, string> = {
        image: "Images",
        document: "Documents",
        archive: "Compressed Files",
        other: "Other Files",
    };

    const FileItemComponent = ({
        item,
        index,
    }: {
        item: FileItem;
        index: number;
    }) => {
        const category = categorizeFile(item);
        const hasPreview = category === "image";
        const isExisting = isExistingFile(item);

        return (
            <div className="h-[15rem] relative group border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden">
                {hasPreview && filePreviews[index] ? (
                    <div className="relative w-full h-full">
                        {category === "image" ? (
                            <img
                                src={
                                    filePreviews[index].includes("blob")
                                        ? filePreviews[index]
                                        : getFilePath(filePreviews[index])
                                }
                                alt={`Preview ${getFileName(item)}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={filePreviews[index]}
                                className="w-full h-full object-cover"
                            />
                        )}
                        {showFileNumbers && (
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                            </div>
                        )}
                        {isExisting && (
                            <div className="absolute bottom-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                                Existing
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-white p-4">
                        {getFileIcon(item)}
                        <div className="text-xs text-slate-500 mt-2 text-center">
                            {getFileType(item)}
                        </div>
                        {showFileNames && (
                            <div
                                className="text-sm font-medium text-slate-800 mt-2 text-center truncate w-full px-2"
                                title={getFileName(item)}
                            >
                                {getFileName(item)}
                            </div>
                        )}
                        {showFileTypes && !isExisting && getFileSize(item) && (
                            <div className="text-xs text-slate-500 mt-1">
                                {getFileSize(item)}
                            </div>
                        )}
                        {isExisting && (
                            <div className="text-xs text-green-600 mt-1">Existing file</div>
                        )}
                        {showFileNumbers && (
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="h-3 w-3" />
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-4 w-full">
            <div
                className={`flex items-center ${canAddMore ? "justify-between" : "justify-end"
                    }`}
            >
                {canAddMore && (
                    <div>
                        <Label
                            htmlFor="file-upload"
                            className={`cursor-pointer flex items-center gap-2 text-sm text-[#06355c] hover:text-[#052a4a] transition-colors ${isCompressing ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            <Upload className="h-4 w-4" />
                            {isCompressing ? "Compressing..." : uploadButtonText}
                        </Label>
                         <input
                            type="file"
                            id="file-upload"
                            multiple={multiple}
                            accept={allowAllFileTypes ? "*/*" : acceptedFileTypes}
                            onChange={handleFileUpload}
                            disabled={isCompressing}
                            className="hidden"
                        />

                    </div>
                )}
                <Label className="text-sm font-medium text-slate-700">
                    {label} {filesCountText}
                </Label>
            </div>

            {files.length > 0 ? (
                <div className="space-y-6">
                    {groupByCategory && groupedFiles ? (
                        Object.entries(groupedFiles).map(([category, fileItems]) => (
                            <div key={category} className="space-y-3">
                                <h4 className="text-sm font-medium text-slate-700">
                                    {categoryLabels[category as FileCategory]} ({fileItems.length}
                                    )
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fileItems.map(({ item, index }) => (
                                        <FileItemComponent key={index} item={item} index={index} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((item, index) => (
                                <FileItemComponent key={index} item={item} index={index} />
                            ))}

                            {canAddMore && (
                                <Label
                                    htmlFor="file-upload"
                                    className="h-[15rem] cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-slate-400 transition-colors bg-white"
                                >
                                    <Plus className="h-8 w-8 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-500">Add file</span>
                                    {maxFiles && (
                                        <span className="text-xs text-slate-400 mt-1">
                                            ({maxFiles - files.length} remaining)
                                        </span>
                                    )}
                                </Label>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <Label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-slate-400 transition-colors bg-white"
                >
                    <File className="h-12 w-12 text-slate-400 mb-4" />
                    <span className="text-sm text-slate-500">{emptyStateText}</span>
                    {maxFiles && (
                        <span className="text-xs text-slate-400 mt-1">
                            Max {maxFiles} files
                        </span>
                    )}
                </Label>
            )}
        </div>
    );
};

// Helper functions to export
export const getNewFilesForUpload = (files: FileItem[]): File[] => {
    return files.filter((item) => !isExistingFile(item)) as File[];
};

export const getExistingFileIds = (files: FileItem[]): string[] => {
    return files.filter(isExistingFile).map((item) => item.id);
};
