import { FC, useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { documentService } from '@/shared/services/document.service';
import type { ProviderDocument, DocumentType } from '@/shared/types/portfolio';
import { toast } from 'sonner';
import { getFilePath } from '@/shared/utils/get-file-path';

interface PublicDocumentsViewProps {
    profileId: string;
}

export const PublicDocumentsView: FC<PublicDocumentsViewProps> = ({ profileId }) => {
    const [documents, setDocuments] = useState<ProviderDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const data = await documentService.getPublicDocuments(profileId);
                setDocuments(data);
            } catch (error) {
                console.error('Failed to load documents:', error);
                toast.error('Failed to load documents');
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, [profileId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No public documents available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
            ))}
        </div>
    );
};

interface DocumentCardProps {
    document: ProviderDocument;
}

const DocumentCard: FC<DocumentCardProps> = ({ document }) => {
    const fileUrl = getFilePath(document.file.path);
    const typeLabel = documentService.getDocumentTypeLabel(document.documentType as DocumentType);

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                {/* Document Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#7682e8]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#7682e8]" />
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                {document.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {typeLabel} • {formatFileSize(document.file.size)}
                            </p>
                        </div>

                        {/* Download Button */}
                        <a
                            href={fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm text-[#7682e8] border border-[#7682e8] rounded-md hover:bg-[#7682e8]/5 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                    </div>

                    {/* Description */}
                    {document.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {document.description}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{document.file.filename}</span>
                        <span>Added {new Date(document.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
