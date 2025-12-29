import api from '../axios';
import type { FieldProfile, FieldCalendar, FieldPricingRule, Amenity } from '../../types';

export interface CreateFieldRequest {
    fieldName: string;
    description?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    defaultPricePerHour: number;
    capacity?: number;
    amenityIds?: number[];
}

export interface UpdateFieldRequest extends Partial<CreateFieldRequest> {
    fieldId: number;
}

export interface FieldSearchParams {
    query?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenityIds?: number[];
    status?: string;
    page?: number;
    limit?: number;
}

export interface AvailableSlotsParams {
    fieldId: number;
    date: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const fieldService = {
    /**
     * Create a new field profile
     */
    createField: async (data: CreateFieldRequest): Promise<FieldProfile> => {
        const response = await api.post<FieldProfile>('/fields', data);
        return response.data;
    },

    /**
     * Get field by ID
     */
    getFieldById: async (fieldId: number): Promise<FieldProfile> => {
        const response = await api.get<FieldProfile>(`/fields/${fieldId}`);
        return response.data;
    },

    /**
     * Update field profile
     */
    updateField: async ({ fieldId, ...data }: UpdateFieldRequest): Promise<FieldProfile> => {
        const response = await api.put<FieldProfile>(`/fields/${fieldId}`, data);
        return response.data;
    },

    /**
     * Get fields owned by user
     */
    getOwnerFields: async (ownerId: number): Promise<FieldProfile[]> => {
        const response = await api.get<FieldProfile[]>(`/fields/owner/${ownerId}`);
        return response.data;
    },

    /**
     * Search fields
     */
    searchFields: async (params: FieldSearchParams): Promise<PaginatedResponse<FieldProfile>> => {
        const response = await api.get<PaginatedResponse<FieldProfile>>('/fields/search', { params });
        return response.data;
    },

    /**
     * Get available time slots for a field on a specific date
     */
    getAvailableSlots: async (fieldId: number, date: string): Promise<FieldCalendar[]> => {
        const response = await api.get<FieldCalendar[]>(`/fields/${fieldId}/slots`, {
            params: { date },
        });
        return response.data;
    },

    /**
     * Get field pricing rules
     */
    getFieldPricing: async (fieldId: number): Promise<FieldPricingRule[]> => {
        const response = await api.get<FieldPricingRule[]>(`/fields/${fieldId}/pricing`);
        return response.data;
    },

    /**
     * Update field pricing rules
     */
    updateFieldPricing: async (fieldId: number, rules: Partial<FieldPricingRule>[]): Promise<FieldPricingRule[]> => {
        const response = await api.put<FieldPricingRule[]>(`/fields/${fieldId}/pricing`, { rules });
        return response.data;
    },

    /**
     * Get all available amenities
     */
    getAmenities: async (): Promise<Amenity[]> => {
        const response = await api.get<Amenity[]>('/amenities');
        return response.data;
    },

    /**
     * Get field amenities
     */
    getFieldAmenities: async (fieldId: number): Promise<Amenity[]> => {
        const response = await api.get<Amenity[]>(`/fields/${fieldId}/amenities`);
        return response.data;
    },

    /**
     * Update field amenities
     */
    updateFieldAmenities: async (fieldId: number, amenityIds: number[]): Promise<void> => {
        await api.put(`/fields/${fieldId}/amenities`, { amenityIds });
    },
};

export default fieldService;
