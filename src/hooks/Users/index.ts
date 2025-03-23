import { ApiError, api } from '@/api.client';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

interface LoginUserProps {
  name: string;
  email: string;
}

// Authenticate User
export const useLoginUser = (): UseMutationResult<void, ApiError, LoginUserProps> => {
  return useMutation({
    mutationFn: async (props: LoginUserProps) => {
      await api.post('/auth/login', props);
    }
  });
};
