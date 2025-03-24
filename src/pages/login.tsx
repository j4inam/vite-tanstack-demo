import LoginForm from '@/components/forms/login-form';
import { PawPrint } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { useLoginUser } from '@/hooks/Users';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

const loginSchema = z
  .object({
    name: z.string(),
    email: z.string().email('Invalid email address')
  })
  .required();

const LoginPage = () => {
  const {
    mutate: loginUser,
    isPending: isLoginPending,
    isSuccess: isLoginSuccess
  } = useLoginUser();
  const navigate = useNavigate();

  if (!isLoginPending && isLoginSuccess) {
    navigate({ to: '/search' });
  }

  const loginForm = useForm({
    defaultValues: {
      name: '',
      email: ''
    },
    onSubmit: async ({ value }) => {
      loginUser(value);
    },
    validators: {
      onChange: loginSchema
    }
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <PawPrint className="size-6 md:size-8" />
            </div>
            Dog Fetch
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm loginForm={loginForm} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login-image.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
      </div>
    </div>
  );
};

export default LoginPage;
