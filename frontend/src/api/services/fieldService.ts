// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { FieldProfile, FieldCalendar, FieldPricingRule, Amenity } from '../../types';
import { FieldStatus, CalendarStatus, DayOfWeek } from '../../types';

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

// --- Mock Data ---
const mockFieldProfile: FieldProfile = {
    fieldId: 1,
    ownerId: 1,
    fieldName: 'Green Valley Stadium',
    description: 'Premium 11-a-side football field with natural grass and floodlights',
    location: 'District 2, Ho Chi Minh City',
    latitude: 10.7869,
    longitude: 106.7518,
    defaultPricePerHour: 500000,
    capacity: 22,
    status: FieldStatus.VERIFIED,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-08-15T10:30:00Z',
};

const mockFieldProfiles: FieldProfile[] = [
    mockFieldProfile,
    {
        fieldId: 2,
        ownerId: 1,
        fieldName: 'City Arena 5v5',
        description: 'Artificial turf 5-a-side mini pitch',
        location: 'District 7, Ho Chi Minh City',
        latitude: 10.7324,
        longitude: 106.7217,
        defaultPricePerHour: 300000,
        capacity: 10,
        status: FieldStatus.VERIFIED,
        createdAt: '2024-03-20T09:00:00Z',
        updatedAt: '2024-09-01T14:00:00Z',
    },
    {
        fieldId: 3,
        ownerId: 2,
        fieldName: 'Sunrise Football Park',
        description: 'New facility with multiple pitches',
        location: 'Thu Duc City',
        defaultPricePerHour: 400000,
        capacity: 14,
        status: FieldStatus.PENDING,
        createdAt: '2024-11-01T07:00:00Z',
        updatedAt: '2024-11-01T07:00:00Z',
    },
];

const mockFieldCalendar: FieldCalendar[] = [
    {
        calendarId: 1,
        fieldId: 1,
        date: '2025-01-15',
        startTime: '06:00:00',
        endTime: '08:00:00',
        status: CalendarStatus.AVAILABLE,
    },
    {
        calendarId: 2,
        fieldId: 1,
        date: '2025-01-15',
        startTime: '08:00:00',
        endTime: '10:00:00',
        status: CalendarStatus.BOOKED,
        bookingId: 1,
    },
    {
        calendarId: 3,
        fieldId: 1,
        date: '2025-01-15',
        startTime: '10:00:00',
        endTime: '12:00:00',
        status: CalendarStatus.AVAILABLE,
    },
    {
        calendarId: 4,
        fieldId: 1,
        date: '2025-01-15',
        startTime: '12:00:00',
        endTime: '14:00:00',
        status: CalendarStatus.MAINTENANCE,
    },
    {
        calendarId: 5,
        fieldId: 1,
        date: '2025-01-15',
        startTime: '14:00:00',
        endTime: '16:00:00',
        status: CalendarStatus.AVAILABLE,
    },
];

const mockPricingRules: FieldPricingRule[] = [
    {
        pricingRuleId: 1,
        fieldId: 1,
        name: 'Weekend Premium',
        dayOfWeek: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
        startTime: '06:00:00',
        endTime: '22:00:00',
        pricePerHour: 700000,
        priority: 1,
        isActive: true,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-08-15T10:30:00Z',
    },
    {
        pricingRuleId: 2,
        fieldId: 1,
        name: 'Evening Rush',
        dayOfWeek: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
        startTime: '17:00:00',
        endTime: '21:00:00',
        pricePerHour: 600000,
        priority: 2,
        isActive: true,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-08-15T10:30:00Z',
    },
];

const mockAmenities: Amenity[] = [
    { amenityId: 1, name: 'Floodlights', description: 'LED floodlights for night games', icon: '💡', isActive: true },
    { amenityId: 2, name: 'Changing Rooms', description: 'Separate changing rooms with showers', icon: '🚿', isActive: true },
    { amenityId: 3, name: 'Parking', description: 'Free parking for 50 cars', icon: '🅿️', isActive: true },
    { amenityId: 4, name: 'Cafeteria', description: 'On-site food and drinks', icon: '☕', isActive: true },
    { amenityId: 5, name: 'First Aid', description: 'First aid station with trained staff', icon: '🏥', isActive: true },
];

export const fieldService = {
    /**
     * Create a new field profile
     */
    createField: async (data: CreateFieldRequest): Promise<FieldProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<FieldProfile>('/fields', data);
        // return response.data;
        // --- End Real API call ---

        return {
            fieldId: Math.floor(Math.random() * 1000) + 100,
            ownerId: 1, // Assume current user
            fieldName: data.fieldName,
            description: data.description,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
            defaultPricePerHour: data.defaultPricePerHour,
            capacity: data.capacity,
            status: FieldStatus.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Get field by ID
     */
    getFieldById: async (_fieldId: number): Promise<FieldProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldProfile>(`/fields/${fieldId}`);
        // return response.data;
        // --- End Real API call ---

        return mockFieldProfile;
    },

    /**
     * Update field profile
     */
    updateField: async ({ fieldId, ...data }: UpdateFieldRequest): Promise<FieldProfile> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<FieldProfile>(`/fields/${fieldId}`, data);
        // return response.data;
        // --- End Real API call ---

        return {
            ...mockFieldProfile,
            fieldId,
            ...data,
            updatedAt: new Date().toISOString(),
        };
    },

    /**
     * Get fields owned by user
     */
    getOwnerFields: async (_ownerId: number): Promise<FieldProfile[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldProfile[]>(`/fields/owner/${ownerId}`);
        // return response.data;
        // --- End Real API call ---

        return mockFieldProfiles.filter(f => f.ownerId === 1);
    },

    /**
     * Search fields
     */
    searchFields: async (params: FieldSearchParams): Promise<PaginatedResponse<FieldProfile>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<FieldProfile>>('/fields/search', { params });
        // return response.data;
        // --- End Real API call ---

        const page = params.page || 1;
        const limit = params.limit || 10;

        return {
            data: mockFieldProfiles,
            total: mockFieldProfiles.length,
            page,
            limit,
            totalPages: Math.ceil(mockFieldProfiles.length / limit),
        };
    },

    /**
     * Get available time slots for a field on a specific date
     */
    getAvailableSlots: async (_fieldId: number, _date: string): Promise<FieldCalendar[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldCalendar[]>(`/fields/${fieldId}/slots`, {
        //     params: { date },
        // });
        // return response.data;
        // --- End Real API call ---

        return mockFieldCalendar;
    },

    /**
     * Get field pricing rules
     */
    getFieldPricing: async (_fieldId: number): Promise<FieldPricingRule[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FieldPricingRule[]>(`/fields/${fieldId}/pricing`);
        // return response.data;
        // --- End Real API call ---

        return mockPricingRules;
    },

    /**
     * Update field pricing rules
     */
    updateFieldPricing: async (_fieldId: number, rules: Partial<FieldPricingRule>[]): Promise<FieldPricingRule[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.put<FieldPricingRule[]>(`/fields/${fieldId}/pricing`, { rules });
        // return response.data;
        // --- End Real API call ---

        return rules.map((rule, index) => ({
            ...mockPricingRules[0],
            ...rule,
            pricingRuleId: index + 1,
            updatedAt: new Date().toISOString(),
        }));
    },

    /**
     * Get all available amenities
     */
    getAmenities: async (): Promise<Amenity[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Amenity[]>('/amenities');
        // return response.data;
        // --- End Real API call ---

        return mockAmenities;
    },

    /**
     * Get field amenities
     */
    getFieldAmenities: async (_fieldId: number): Promise<Amenity[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<Amenity[]>(`/fields/${fieldId}/amenities`);
        // return response.data;
        // --- End Real API call ---

        return mockAmenities.slice(0, 3);
    },

    /**
     * Update field amenities
     */
    updateFieldAmenities: async (_fieldId: number, _amenityIds: number[]): Promise<void> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // await api.put(`/fields/${fieldId}/amenities`, { amenityIds });
        // --- End Real API call ---

        console.log('Mock: Field amenities updated successfully');
    },
};

export default fieldService;
