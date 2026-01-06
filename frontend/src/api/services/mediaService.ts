import api from '../axios';
import type { MediaAsset, MediaOwnerType } from '../../types';
import { MediaOwnerType as MediaOwnerTypeEnum } from '../../types';

export interface UploadMediaRequest {
    file: File;
    ownerType: MediaOwnerType;
    entityId: number;
}

// Media service - Real API calls
export const mediaService = {
    /**
     * Upload media file
     */
    uploadMedia: async (data: UploadMediaRequest): Promise<MediaAsset> => {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('owner_type', data.ownerType);  // Backend expects snake_case
        formData.append('entity_id', data.entityId.toString());  // Backend expects snake_case

        const response = await api.post<MediaAsset>('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get media for entity
     */
    getEntityMedia: async (ownerType: MediaOwnerType, entityId: number): Promise<MediaAsset[]> => {
        // Backend endpoint is /media/entity/{owner_type}/{entity_id}
        const response = await api.get<MediaAsset[]>(`/media/entity/${ownerType}/${entityId}`);
        return response.data;
    },

    /**
     * Delete media
     */
    deleteMedia: async (assetId: number): Promise<void> => {
        await api.delete(`/media/${assetId}`);
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

    /**
     * Add media by URL
     */
    addMediaByUrl: async (url: string, ownerType: MediaOwnerType, entityId: number): Promise<MediaAsset> => {
        const response = await api.post<MediaAsset>('/media/url', {
            url,
            ownerType,
            entityId,
        });
        return response.data;
    },

    /**
     * Add field photo by URL (convenience method)
     */
    addFieldPhotoByUrl: async (fieldId: number, url: string): Promise<MediaAsset> => {
        return mediaService.addMediaByUrl(url, MediaOwnerTypeEnum.FIELD, fieldId);
    },
};

export default mediaService;
