import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LoginRequest, User } from '@/types/auth';
import { useAxios } from '@/hooks';
import { useAuthStore } from '@/stores';
import { ENDPOINTS } from '@/configs';
import { handleError } from '@/utils/errorHandler';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { post } = useAxios();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = formData.email && formData.password.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const data = await post<{ message: string; user: User }>(ENDPOINTS.LOGIN, formData);

      setUser(data.user);
      toast.success(t('auth.login.success'));
      navigate('/');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('auth.login.title')}</CardTitle>
          <CardDescription>{t('auth.login.description')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <PasswordInput
                id="password"
                placeholder={t('auth.login.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
              {isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
