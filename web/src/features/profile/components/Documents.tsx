import { FC, useEffect, useState } from 'react';
import { Plus, FileText, Download, Trash2, Edit2, Eye, EyeOff, X } from 'lucide-react';
import { documentService } from '@/shared/services/document.service';
import type { ProviderDocument, CreateDocumentData } from '@/shared/types/portfolio';
import { DocumentType } from '@/shared/types/portfolio';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import { getFilePath } from '@/shared/utils/get-file-path';
import { FileUploadSection, FileItem, getNewFilesForUpload } from '@/shared/components/common/FileUploadSection';

export default function Documents() {
  const [documents, setDocuments] = useState<ProviderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ProviderDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getMyDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentService.deleteDocument(documentId);
      setDocuments(documents.filter(d => d.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleTogglePrivacy = async (document: ProviderDocument) => {
    try {
      const updated = await documentService.togglePrivacy(document.id, !document.isPublic);
      setDocuments(documents.map(d => d.id === document.id ? updated : d));
      toast.success(`Document is now ${updated.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
      toast.error('Failed to update document privacy');
    }
  };

  const openEditModal = (document: ProviderDocument) => {
    setEditingDocument(document);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDocument(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
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
            <h1 className="text-xl text-gray-900 font-semibold">Documents</h1>
            <p className="text-sm text-gray-500 mt-1">{documents.length} {documents.length === 1 ? 'document' : 'documents'}</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7682e8] text-white rounded-lg hover:bg-[#6571d4] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="mb-2">No documents uploaded yet</p>
            <p className="text-sm text-gray-400 mb-4">Upload resumes, certificates, licenses, and other professional documents</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-sm font-medium text-gray-700">Document</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Type</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Size</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Uploaded</th>
                  <th className="p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="p-3 text-sm font-medium text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#7682e8]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {documentService.getDocumentTypeLabel(doc.documentType)}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {formatFileSize(doc.file.size)}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {formatDate(doc.createdAt)}
                    </td>
                    <td className="p-3">
                      {doc.isPublic ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                          <Eye className="w-3 h-3" />
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          <EyeOff className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={getFilePath(doc.file.path)}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-[#7682e8] transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-2 text-gray-600 hover:text-[#7682e8] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePrivacy(doc)}
                          className="p-2 text-gray-600 hover:text-[#7682e8] transition-colors"
                          title={doc.isPublic ? 'Make Private' : 'Make Public'}
                        >
                          {doc.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <DocumentModal
          document={editingDocument}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            loadDocuments();
          }}
        />
      )}
    </>
  );
}

interface DocumentModalProps {
  document: ProviderDocument | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DocumentModal: FC<DocumentModalProps> = ({ document, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    description: document?.description || '',
    documentType: (document?.documentType || 'OTHER') as DocumentType,
    isPublic: document?.isPublic ?? false,
  });
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: DocumentType.RESUME, label: 'Resume/CV' },
    { value: DocumentType.CERTIFICATE, label: 'Certificate' },
    { value: DocumentType.LICENSE, label: 'License' },
    { value: DocumentType.OTHER, label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Please provide a document title');
      return;
    }

    if (!document && files.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    setSubmitting(true);

    try {
      if (document) {
        // Update existing document
        await documentService.updateDocument(document.id, {
          title: formData.title,
          description: formData.description || undefined,
          documentType: formData.documentType,
          isPublic: formData.isPublic,
        });
        toast.success('Document updated successfully');
      } else {
        // Create new document
        const uploadFiles = getNewFilesForUpload(files);
        if (uploadFiles.length === 0) {
          toast.error('Please select a file to upload');
          return;
        }
        const documentData: CreateDocumentData = {
          title: formData.title,
          description: formData.description || undefined,
          documentType: formData.documentType,
          file: uploadFiles[0],
          isPublic: formData.isPublic,
        };
        await documentService.createDocument(documentData);
        toast.success('Document uploaded successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save document:', error);
      toast.error('Failed to save document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {document ? 'Edit Document' : 'Upload Document'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
              placeholder="E.g., Software Engineer Resume"
              required
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value as DocumentType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
              required
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
              placeholder="Brief description of the document..."
            />
          </div>

          {/* File Upload */}
          {!document && (
            <FileUploadSection
              files={files}
              onFilesChange={setFiles}
              maxFiles={1}
              acceptedFileTypes=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              multiple={false}
              label="Document File"
              uploadButtonText="Upload File"
              emptyStateText="Click to upload your document"
              showFileNumbers={false}
              enableCompression={false}
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
              Make this document public (visible to clients)
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
              {submitting ? 'Saving...' : (document ? 'Update' : 'Upload')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
