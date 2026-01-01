import { useState, useMemo } from 'react';
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
import { Check, X } from 'lucide-react';
import type { RegisterRequest, User } from '@/types/auth';
import { useAxios } from '@/hooks';
import { useAuthStore } from '@/stores';
import { ENDPOINTS } from '@/configs';
import { handleError } from '@/utils/errorHandler';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { post } = useAxios();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = useMemo(() => {
    const { password } = formData;
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [formData.password]);

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const isFormValid = formData.username.length >= 3 && formData.email && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsLoading(true);

    try {
      const data = await post<{ message: string; user: User }>(ENDPOINTS.REGISTER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        ...(formData.full_name && { full_name: formData.full_name }),
      });

      setUser(data.user);
      toast.success(t('auth.register.success'));
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
          <CardTitle className="text-2xl font-bold">{t('auth.register.title')}</CardTitle>
          <CardDescription>{t('auth.register.description')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('auth.register.username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('auth.register.usernamePlaceholder')}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">{t('auth.register.fullName')}</Label>
              <Input
                id="full_name"
                type="text"
                placeholder={t('auth.register.fullNamePlaceholder')}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <PasswordInput
                id="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  {passwordRequirements.minLength ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'
                    }
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordRequirements.hasUppercase ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'
                    }
                  >
                    Contains uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordRequirements.hasLowercase ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'
                    }
                  >
                    Contains lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordRequirements.hasNumber ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'
                    }
                  >
                    Contains number
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
              {isLoading ? t('auth.register.creatingAccount') : t('auth.register.signUp')}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.register.signIn')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
