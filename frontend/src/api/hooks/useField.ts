import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fieldService,
    type CreateFieldRequest,
    type UpdateFieldRequest,
    type FieldSearchParams
} from '../services/fieldService';
import type { FieldProfile } from '../../types';

export const fieldKeys = {
    all: ['fields'] as const,
    lists: () => [...fieldKeys.all, 'list'] as const,
    list: (filters: FieldSearchParams) => [...fieldKeys.lists(), filters] as const,
    details: () => [...fieldKeys.all, 'detail'] as const,
    detail: (id: number) => [...fieldKeys.details(), id] as const,
    owner: (ownerId: number) => [...fieldKeys.all, 'owner', ownerId] as const,
    slots: (fieldId: number, date: string) => [...fieldKeys.all, 'slots', fieldId, date] as const,
    pricing: (fieldId: number) => [...fieldKeys.all, 'pricing', fieldId] as const,
    amenities: (fieldId: number) => [...fieldKeys.all, 'amenities', fieldId] as const,
    allAmenities: () => [...fieldKeys.all, 'allAmenities'] as const,
};

export function useField(fieldId: number) {
    return useQuery({
        queryKey: fieldKeys.detail(fieldId),
        queryFn: () => fieldService.getFieldById(fieldId),
        enabled: !!fieldId,
    });
}

export function useOwnerFields(ownerId: number) {
    return useQuery({
        queryKey: fieldKeys.owner(ownerId),
        queryFn: () => fieldService.getOwnerFields(ownerId),
        enabled: !!ownerId,
    });
}

export function useSearchFields(params: FieldSearchParams) {
    return useQuery({
        queryKey: fieldKeys.list(params),
        queryFn: () => fieldService.searchFields(params),
    });
}

export function useAvailableSlots(fieldId: number, date: string) {
    return useQuery({
        queryKey: fieldKeys.slots(fieldId, date),
        queryFn: () => fieldService.getAvailableSlots(fieldId, date),
        enabled: !!fieldId && !!date,
    });
}

export function useFieldPricing(fieldId: number) {
    return useQuery({
        queryKey: fieldKeys.pricing(fieldId),
        queryFn: () => fieldService.getFieldPricing(fieldId),
        enabled: !!fieldId,
    });
}

export function useFieldAmenities(fieldId: number) {
    return useQuery({
        queryKey: fieldKeys.amenities(fieldId),
        queryFn: () => fieldService.getFieldAmenities(fieldId),
        enabled: !!fieldId,
    });
}

export function useAllAmenities() {
    return useQuery({
        queryKey: fieldKeys.allAmenities(),
        queryFn: () => fieldService.getAmenities(),
    });
}

export function useCreateField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFieldRequest) => fieldService.createField(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: fieldKeys.all });
        },
    });
}

export function useUpdateField() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateFieldRequest) => fieldService.updateField(data),
        onSuccess: (field) => {
            queryClient.setQueryData<FieldProfile>(fieldKeys.detail(field.fieldId), field);
            queryClient.invalidateQueries({ queryKey: fieldKeys.lists() });
        },
    });
}

export function useUpdateFieldPricing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ fieldId, rules }: { fieldId: number; rules: Parameters<typeof fieldService.updateFieldPricing>[1] }) =>
            fieldService.updateFieldPricing(fieldId, rules),
        onSuccess: (_, { fieldId }) => {
            queryClient.invalidateQueries({ queryKey: fieldKeys.pricing(fieldId) });
        },
    });
}

export function useUpdateFieldAmenities() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ fieldId, amenityIds }: { fieldId: number; amenityIds: number[] }) =>
            fieldService.updateFieldAmenities(fieldId, amenityIds),
        onSuccess: (_, { fieldId }) => {
            queryClient.invalidateQueries({ queryKey: fieldKeys.amenities(fieldId) });
        },
    });
}
