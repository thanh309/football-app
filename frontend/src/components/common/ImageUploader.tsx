import { useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    onUpload: (files: File[]) => Promise<string[]>;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptTypes?: string[];
    existingImages?: string[];
    onRemove?: (url: string) => void;
    className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onUpload,
    maxFiles = 5,
    maxSizeMB = 5,
    acceptTypes = ['image/jpeg', 'image/png', 'image/webp'],
    existingImages = [],
    onRemove,
    className,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const totalImages = existingImages.length + previews.length;

    const validateFiles = (files: File[]): string | null => {
        for (const file of files) {
            if (!acceptTypes.includes(file.type)) {
                return `Invalid file type: ${file.name}. Accepted: ${acceptTypes.join(', ')}`;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                return `File too large: ${file.name}. Max size: ${maxSizeMB}MB`;
            }
        }
        if (totalImages + files.length > maxFiles) {
            return `Too many files. Maximum: ${maxFiles}`;
        }
        return null;
    };

    const handleFiles = useCallback(async (files: File[]) => {
        setError(null);
        const validationError = validateFiles(files);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);

        // Upload files
        setIsUploading(true);
        try {
            await onUpload(files);
        } catch (err) {
            setError('Upload failed. Please try again.');
            // Remove previews on error
            newPreviews.forEach(url => URL.revokeObjectURL(url));
            setPreviews(prev => prev.filter(p => !newPreviews.includes(p)));
        } finally {
            setIsUploading(false);
        }
    }, [totalImages, maxFiles, acceptTypes, maxSizeMB, onUpload]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFiles(files);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removePreview = (index: number) => {
        const url = previews[index];
        URL.revokeObjectURL(url);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={clsx('space-y-4', className)}>
            {/* Existing images */}
            {existingImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {existingImages.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            {onRemove && (
                                <button
                                    onClick={() => onRemove(url)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Preview images */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {previews.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                onClick={() => removePreview(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload area */}
            {totalImages < maxFiles && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={clsx(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
                        isDragging
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-gray-400'
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptTypes.join(',')}
                        multiple
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                        {isDragging ? (
                            <ImageIcon className="w-10 h-10 text-emerald-500" />
                        ) : (
                            <Upload className="w-10 h-10 text-gray-400" />
                        )}
                        <p className="text-gray-600">
                            {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
                        </p>
                        <p className="text-sm text-gray-400">
                            Max {maxFiles} files, {maxSizeMB}MB each
                        </p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default ImageUploader;
