import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from '../../components/common';
import toast from 'react-hot-toast';

const FieldPhotosPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock photos for demonstration - start with some sample photos
    const [photos, setPhotos] = useState<string[]>([
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    ]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            toast.error('Please select image files only');
            return;
        }

        // Create preview URLs for the selected files
        const newPhotos = imageFiles.map(file => URL.createObjectURL(file));
        setPhotos(prev => [...prev, ...newPhotos]);
        toast.success(`${imageFiles.length} photo(s) added!`);
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleAddUrl = () => {
        if (!urlInput.trim()) {
            toast.error('Please enter a valid URL');
            return;
        }
        // Basic URL validation
        try {
            new URL(urlInput);
            setPhotos(prev => [...prev, urlInput.trim()]);
            setUrlInput('');
            setShowUrlInput(false);
            toast.success('Photo added from URL!');
        } catch {
            toast.error('Please enter a valid URL');
        }
    };

    const handleDeletePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        toast.success('Photo removed');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
                to={`/owner/fields/${id}`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Field Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Field Photos</h1>
                <p className="text-gray-600 mt-1">
                    Manage photos for your field
                </p>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-white rounded-xl border-2 border-dashed p-8 mb-6 transition-colors ${isDragging
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <div className="text-center">
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isDragging ? 'Drop photos here' : 'Upload Photos'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Drag and drop photos here, or click to browse
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button onClick={handleFileSelect} variant="secondary">
                            Select Files
                        </Button>
                        <Button
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            variant="outline"
                            leftIcon={<LinkIcon className="w-4 h-4" />}
                        >
                            Add from URL
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                        Supports JPG, PNG, WebP. Max 5MB per file.
                    </p>
                </div>
            </div>

            {/* URL Input */}
            {showUrlInput && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <Button onClick={handleAddUrl} leftIcon={<Plus className="w-4 h-4" />}>
                            Add
                        </Button>
                    </div>
                </div>
            )}

            {/* Photos Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Photos ({photos.length})</h2>

                {photos.length === 0 ? (
                    <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No photos uploaded yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Add photos to showcase your field to potential customers
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={photo}
                                    alt={`Field photo ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDeletePhoto(index)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FieldPhotosPage;

