import { ApiError, ApiResponse, api } from '@/api.client';
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogSearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

interface DogSearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

// Query keys
const dogsKeys = {
  breeds: ['breeds'] as const,
  all: ['dogs'] as const,
  search: () => [...dogsKeys.all, 'search'] as const,
  searchFilters: (filters: DogSearchParams) => [...dogsKeys.search(), filters] as const,
  details: (id: string) => [...dogsKeys.all, 'detail', id] as const
};

// GET dog breeds
export const useGetBreeds = (): UseQueryResult<string[], ApiError> => {
  return useQuery({
    queryKey: dogsKeys.breeds,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<string[]>>('/dogs/breeds');
      return data;
    }
  });
};

export const useSearchDogs = (
  params: DogSearchParams
): UseQueryResult<DogSearchResponse, ApiError> => {
  return useQuery({
    queryKey: dogsKeys.searchFilters(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DogSearchResponse>>('/dogs/search', { params });
      return data;
    }
  });
};

export const useGetDogDetails = (): UseMutationResult<Dog[], ApiError, string[]> => {
  return useMutation({
    mutationFn: async (dogIds: string[]) => {
      const { data } = await api.post('/dogs', dogIds);
      return data;
    }
  });
};
