import Link from 'next/link';
import { SignUpForm } from '@/components/app/auth/SignUpForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Inscription | Forum',
  description: 'Créez votre compte pour participer aux discussions',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        {/* Back button */}
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour</span>
        </Link>

        {/* Signup Card with Glassmorphism */}
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-white/60 text-base">
              Inscrivez-vous pour participer aux discussions du forum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/50">Déjà un compte ?</span>
              </div>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium hover:underline underline-offset-4"
              >
                Se connecter →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="absolute bottom-8 text-center text-xs text-white/40">
          En créant un compte, vous acceptez les conditions d'utilisation
        </p>
    </div>
  );
}
