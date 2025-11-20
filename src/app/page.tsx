import Link from 'next/link';
import { Construction, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
          Forum en construction
        </h1>

        {/* Description */}
        <p className="text-xl text-white/70 mb-4 max-w-2xl">
          Notre forum est actuellement en développement progressif avec une architecture{' '}
          <span className="text-purple-300 font-semibold">Clean Architecture</span> et{' '}
          <span className="text-pink-300 font-semibold">Domain-Driven Design</span>.
        </p>

        <p className="text-lg text-white/50 mb-12 max-w-xl">
          Chaque fonctionnalité est développée avec soin, testée et documentée avant d'être déployée.
        </p>

        {/* CTA Button */}
        <Link
          href="/signup"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
        >
          Créer un compte
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
  );
}
