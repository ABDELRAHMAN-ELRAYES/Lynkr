import { FC, useState } from 'react';
import { AlertCircle, Upload, X, FileText } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import Button from '@/shared/components/ui/Button';
import { proposalService } from '@/shared/services/proposal.service';
import type { CreateProposalPayload } from '@/shared/types/request';
import { toast } from 'sonner';

interface ProposalFormProps {
    requestId: string;
    onSubmit: () => void;
    onCancel?: () => void;
}

interface FormErrors {
    price?: string;
    priceType?: string;
    estimatedDays?: string;
    notes?: string;
}

export const ProposalForm: FC<ProposalFormProps> = ({ requestId, onSubmit, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProposalPayload>({
        requestId,
        price: 0,
        priceType: 'FIXED',
        estimatedDays: 1,
        notes: '',
        files: [],
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const validateField = (name: keyof FormErrors, value: string | number): string => {
        switch (name) {
            case 'price':
                if (!value || Number(value) <= 0) {
                    return 'Price must be greater than 0';
                }
                return '';
            case 'priceType':
                if (!value || (value !== 'FIXED' && value !== 'HOURLY')) {
                    return 'Please select a price type';
                }
                return '';
            case 'estimatedDays':
                if (!value || Number(value) < 1) {
                    return 'Estimated days must be at least 1';
                }
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (field: keyof CreateProposalPayload, value: string | number | File[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field as keyof FormErrors]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadedFiles((prev) => [...prev, ...files]);
        setFormData((prev) => ({
            ...prev,
            files: [...(prev.files || []), ...files],
        }));
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            files: prev.files?.filter((_, i) => i !== index) || [],
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const priceError = validateField('price', formData.price);
        if (priceError) newErrors.price = priceError;

        const priceTypeError = validateField('priceType', formData.priceType);
        if (priceTypeError) newErrors.priceType = priceTypeError;

        const estimatedDaysError = validateField('estimatedDays', formData.estimatedDays);
        if (estimatedDaysError) newErrors.estimatedDays = estimatedDaysError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            setLoading(true);
            await proposalService.createProposal(formData);
            toast.success('Proposal submitted successfully');
            onSubmit();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to submit proposal';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">
                        Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                        <div className="flex items-center gap-1.5 text-sm text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.price}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priceType">
                        Price Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.priceType}
                        onValueChange={(value) => handleInputChange('priceType', value)}
                    >
                        <SelectTrigger className={errors.priceType ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select price type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FIXED">Fixed Price</SelectItem>
                            <SelectItem value="HOURLY">Hourly Rate</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.priceType && (
                        <div className="flex items-center gap-1.5 text-sm text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.priceType}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="estimatedDays">
                    Estimated Delivery Time (Days) <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="estimatedDays"
                    type="number"
                    min="1"
                    value={formData.estimatedDays || ''}
                    onChange={(e) => handleInputChange('estimatedDays', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    className={errors.estimatedDays ? 'border-red-500' : ''}
                />
                {errors.estimatedDays && (
                    <div className="flex items-center gap-1.5 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.estimatedDays}</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">
                    Cover Letter / Notes
                </Label>
                <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes or clarifications about your proposal..."
                    rows={6}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="files">
                    Attachments (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        id="files"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="files"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                            PDF, DOC, DOCX, PNG, JPG (Max 10MB per file)
                        </span>
                    </label>
                </div>

                {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-300">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#7682e8] text-white"
                >
                    {loading ? 'Submitting...' : 'Submit Proposal'}
                </Button>
            </div>
        </form>
    );
};
