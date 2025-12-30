import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '../../components/common';
import toast from 'react-hot-toast';

const FieldPhotosPage: React.FC = () => {
    const { fieldId } = useParams<{ fieldId: string }>();
    const [isDragging, setIsDragging] = useState(false);

    // Mock photos for demonstration
    const [photos] = useState<string[]>([]);

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
        toast.success('Photo upload functionality coming soon!');
    };

    const handleFileSelect = () => {
        toast.success('Photo upload functionality coming soon!');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
                to={`/owner/fields/${fieldId}`}
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
                    <Button onClick={handleFileSelect} variant="secondary">
                        Select Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-3">
                        Supports JPG, PNG, WebP. Max 5MB per file.
                    </p>
                </div>
            </div>

            {/* Photos Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Photos</h2>

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
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="p-2 bg-white rounded-full hover:bg-gray-100">
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
