// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { MediaAsset, MediaOwnerType } from '../../types';
import { MediaOwnerType as MediaOwnerTypeEnum, MediaType } from '../../types';

export interface UploadMediaRequest {
    file: File;
    ownerType: MediaOwnerType;
    entityId: number;
}

// --- Mock Data ---
const mockMediaAssets: MediaAsset[] = [
    {
        assetId: 1,
        ownerId: 1,
        ownerType: MediaOwnerTypeEnum.FIELD,
        entityId: 1,
        fileName: 'field_photo_1.jpg',
        storagePath: '/uploads/fields/1/field_photo_1.jpg',
        fileType: MediaType.IMAGE,
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        createdAt: '2024-06-01T10:00:00Z',
    },
    {
        assetId: 2,
        ownerId: 1,
        ownerType: MediaOwnerTypeEnum.FIELD,
        entityId: 1,
        fileName: 'field_photo_2.jpg',
        storagePath: '/uploads/fields/1/field_photo_2.jpg',
        fileType: MediaType.IMAGE,
        fileSize: 850000,
        mimeType: 'image/jpeg',
        createdAt: '2024-06-01T10:05:00Z',
    },
    {
        assetId: 3,
        ownerId: 1,
        ownerType: MediaOwnerTypeEnum.TEAM,
        entityId: 1,
        fileName: 'team_logo.png',
        storagePath: '/uploads/teams/1/team_logo.png',
        fileType: MediaType.IMAGE,
        fileSize: 256000,
        mimeType: 'image/png',
        createdAt: '2024-01-15T12:00:00Z',
    },
    {
        assetId: 4,
        ownerId: 1,
        ownerType: MediaOwnerTypeEnum.POST,
        entityId: 1,
        fileName: 'match_highlight.mp4',
        storagePath: '/uploads/posts/1/match_highlight.mp4',
        fileType: MediaType.VIDEO,
        fileSize: 52428800,
        mimeType: 'video/mp4',
        createdAt: '2025-01-10T19:00:00Z',
    },
];

export const mediaService = {
    /**
     * Upload media file
     */
    uploadMedia: async (data: UploadMediaRequest): Promise<MediaAsset> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const formData = new FormData();
        // formData.append('file', data.file);
        // formData.append('ownerType', data.ownerType);
        // formData.append('entityId', data.entityId.toString());
        //
        // const response = await api.post<MediaAsset>('/media/upload', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // });
        // return response.data;
        // --- End Real API call ---

        return {
            assetId: Math.floor(Math.random() * 1000) + 100,
            ownerId: 1, // Assume current user
            ownerType: data.ownerType,
            entityId: data.entityId,
            fileName: data.file.name,
            storagePath: `/uploads/${data.ownerType.toLowerCase()}s/${data.entityId}/${data.file.name}`,
            fileType: data.file.type.startsWith('video') ? MediaType.VIDEO : MediaType.IMAGE,
            fileSize: data.file.size,
            mimeType: data.file.type,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get media for entity
     */
    getEntityMedia: async (ownerType: MediaOwnerType, entityId: number): Promise<MediaAsset[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<MediaAsset[]>('/media', {
        //     params: { ownerType, entityId },
        // });
        // return response.data;
        // --- End Real API call ---

        return mockMediaAssets.filter(
            asset => asset.ownerType === ownerType && asset.entityId === entityId
        );
    },

    /**
     * Delete media
     */
    deleteMedia: async (_assetId: number): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.delete(`/media/${assetId}`);
        // --- End Real API call ---

        console.log('Mock: Media deleted successfully');
    },

    /**
     * Get field photos (convenience method)
     */
    getFieldPhotos: async (fieldId: number): Promise<MediaAsset[]> => {
        return mediaService.getEntityMedia(MediaOwnerTypeEnum.FIELD, fieldId);
    },

    /**
     * Upload field photo (convenience method)
     */
    uploadFieldPhoto: async (fieldId: number, file: File): Promise<MediaAsset> => {
        return mediaService.uploadMedia({
            file,
            ownerType: MediaOwnerTypeEnum.FIELD,
            entityId: fieldId,
        });
    },
};

export default mediaService;
