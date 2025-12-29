import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mediaService, type UploadMediaRequest } from '../services/mediaService';
import type { MediaOwnerType } from '../../types';

export const mediaKeys = {
    all: ['media'] as const,
    entity: (ownerType: MediaOwnerType, entityId: number) =>
        [...mediaKeys.all, ownerType, entityId] as const,
    field: (fieldId: number) => [...mediaKeys.all, 'Field', fieldId] as const,
};

export function useEntityMedia(ownerType: MediaOwnerType, entityId: number) {
    return useQuery({
        queryKey: mediaKeys.entity(ownerType, entityId),
        queryFn: () => mediaService.getEntityMedia(ownerType, entityId),
        enabled: !!entityId,
    });
}

export function useFieldPhotos(fieldId: number) {
    return useQuery({
        queryKey: mediaKeys.field(fieldId),
        queryFn: () => mediaService.getFieldPhotos(fieldId),
        enabled: !!fieldId,
    });
}

export function useUploadMedia() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UploadMediaRequest) => mediaService.uploadMedia(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({
                queryKey: mediaKeys.entity(data.ownerType, data.entityId)
            });
        },
    });
}

export function useUploadFieldPhoto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ fieldId, file }: { fieldId: number; file: File }) =>
            mediaService.uploadFieldPhoto(fieldId, file),
        onSuccess: (_, { fieldId }) => {
            queryClient.invalidateQueries({ queryKey: mediaKeys.field(fieldId) });
        },
    });
}

export function useDeleteMedia() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assetId: number) => mediaService.deleteMedia(assetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mediaKeys.all });
        },
    });
}
