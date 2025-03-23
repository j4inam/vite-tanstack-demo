import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const LoginForm = ({ loginForm }: { loginForm: any }) => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your name and email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              loginForm.handleSubmit();
            }}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <loginForm.Field
                  name="name"
                  children={(field: any) => (
                    <>
                      <div className="flex items-center">
                        <Label htmlFor={field.name}>Name</Label>
                      </div>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="John Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                    </>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <loginForm.Field
                  name="email"
                  children={(field: any) => (
                    <>
                      <Label htmlFor={field.name}>Email</Label>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="me@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                    </>
                  )}
                />
              </div>
              <loginForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Login'}
                  </Button>
                )}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
