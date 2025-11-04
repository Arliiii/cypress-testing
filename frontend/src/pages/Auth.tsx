import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-accent to-black p-12 flex-col justify-between text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">StatFlow</span>
          </div>
          <LanguageSwitcher />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            {t('auth.hero.title')}
            <br />
            <span className="text-primary">{t('auth.hero.highlight')}</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md">
            {t('auth.hero.subtitle')}
          </p>
        </div>

        <div className="text-sm text-gray-400">
          {t('common.copyright')}
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">StatFlow</span>
            </div>
            <h2 className="text-3xl font-bold">{isLogin ? t('auth.signIn') : t('auth.createAccount')}</h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? t('auth.welcomeBack')
                : t('auth.joinUs')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">{t('auth.fullName')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-12"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12"
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('auth.rememberMe')}
                  </label>
                </div>
                <Button variant="link" className="text-primary px-0">
                  {t('auth.forgotPassword')}
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold">
              {isLogin ? t('auth.signInButton') : t('auth.createAccountButton')}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {isLogin ? t('auth.newUser') : t('auth.existingUser')}
            </span>
            <Button
              variant="link"
              className="text-primary px-1"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? t('auth.createAccountButton') : t('auth.signInButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
