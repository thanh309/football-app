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
        formData.append('ownerType', data.ownerType);
        formData.append('entityId', data.entityId.toString());

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
        const response = await api.get<MediaAsset[]>('/media', {
            params: { ownerType, entityId },
        });
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
};

export default mediaService;
