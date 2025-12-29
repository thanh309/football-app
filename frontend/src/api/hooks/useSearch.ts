import { useQuery } from '@tanstack/react-query';
import {
    searchService,
    type TeamSearchParams,
    type FieldSearchParams,
    type PlayerSearchParams,
    type OwnerSearchParams
} from '../services/searchService';

export const searchKeys = {
    all: ['search'] as const,
    teams: (params: TeamSearchParams) => [...searchKeys.all, 'teams', params] as const,
    fields: (params: FieldSearchParams) => [...searchKeys.all, 'fields', params] as const,
    players: (params: PlayerSearchParams) => [...searchKeys.all, 'players', params] as const,
    owners: (params: OwnerSearchParams) => [...searchKeys.all, 'owners', params] as const,
};

export function useSearchTeams(params: TeamSearchParams) {
    return useQuery({
        queryKey: searchKeys.teams(params),
        queryFn: () => searchService.searchTeams(params),
        enabled: !!params.query || !!params.location || !!params.skillLevel,
    });
}

export function useSearchFields(params: FieldSearchParams) {
    return useQuery({
        queryKey: searchKeys.fields(params),
        queryFn: () => searchService.searchFields(params),
        enabled: !!params.query || !!params.location || !!(params.amenityIds?.length),
    });
}

export function useSearchPlayers(params: PlayerSearchParams) {
    return useQuery({
        queryKey: searchKeys.players(params),
        queryFn: () => searchService.searchPlayers(params),
        enabled: !!params.query || !!params.position,
    });
}

export function useSearchOwners(params: OwnerSearchParams) {
    return useQuery({
        queryKey: searchKeys.owners(params),
        queryFn: () => searchService.searchOwners(params),
        enabled: !!params.query || !!params.location,
    });
}
