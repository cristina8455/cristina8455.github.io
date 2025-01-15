// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="max-w-xl mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center text-primary hover:text-primary/80"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}