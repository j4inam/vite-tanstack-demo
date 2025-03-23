import { ApiError, api } from '@/api.client';
import { BaseStorage, LocalStorage } from '@/utils/storage';
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface LoginUserProps {
  name: string;
  email: string;
}

interface AddToUserFavoritesProps {
  dogId: string;
  email?: string;
}

const storage: BaseStorage = new LocalStorage();

const userKeys = {
  user: ['user'] as const,
  favorites: (email: string) => [...userKeys.user, email, 'favorites'] as const
};

// Authenticate User
export const useLoginUser = (): UseMutationResult<void, ApiError, LoginUserProps> => {
  return useMutation({
    mutationFn: async (props: LoginUserProps) => {
      await api.post('/auth/login', props);
      storage.set('user', JSON.stringify(props));
    }
  });
};

export const useCurrentUser = (): UseQueryResult<LoginUserProps | null, void> => {
  return useQuery({
    queryKey: userKeys.user,
    queryFn: () => {
      const storedUser = storage.get('user');
      return storedUser ? JSON.parse(storedUser) : null;
    },
    staleTime: 1000 * 60 * 60 // Since login token expires in 1 hour
  });
};

export const useGetUserFavorites = (email?: string): UseQueryResult<string[], void> => {
  return useQuery({
    queryKey: userKeys.favorites(email || ''),
    queryFn: () => {
      const userStorage: BaseStorage = new LocalStorage({ keySuffix: email });
      const favorites = userStorage.get('favorites');
      return favorites ? JSON.parse(favorites) : [];
    },
    enabled: !!email
  });
};

export const useToggleUserFavorites = (): UseMutationResult<
  AddToUserFavoritesProps,
  void,
  AddToUserFavoritesProps
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (props: AddToUserFavoritesProps) => {
      const userStorage: BaseStorage = new LocalStorage({
        keySuffix: props.email
      });
      const currentFavorites = userStorage.get('favorites');
      const currentFavoritesArray = currentFavorites ? JSON.parse(currentFavorites) : [];
      if (currentFavoritesArray.includes(props.dogId)) {
        currentFavoritesArray.splice(currentFavoritesArray.indexOf(props.dogId), 1);
      } else {
        currentFavoritesArray.push(props.dogId);
      }
      userStorage.set('favorites', JSON.stringify(currentFavoritesArray));
      return props; // Return the props to be used in the onSuccess callback
    },
    onSuccess: (props) => {
      queryClient.invalidateQueries({ queryKey: userKeys.favorites(props?.email || '') });
    }
  });
};
