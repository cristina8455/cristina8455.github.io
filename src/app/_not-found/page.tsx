// src/app/_not-found/page.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-xl mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-6">
                    Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}