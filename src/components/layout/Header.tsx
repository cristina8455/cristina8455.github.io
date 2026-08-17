// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navigation = [
    { name: 'Courses', href: '/courses' },
    { name: 'Teaching', href: '/teaching' },
    { name: 'Resources', href: '/resources' },
    { name: 'Office Hours', href: '/office-hours', short: 'Hours' },
    { name: 'About', href: '/about' },
] as const;

/**
 * A masthead rather than an app bar.
 *
 * The previous version had an icon beside every link, which is a product-UI
 * convention: it suits a toolbar of actions and reads as noise on a site whose
 * items are all just pages. Set in type, with a rule under it, this behaves
 * like the top of a publication.
 */
export default function Header() {
    return (
        <header className="border-b border-border">
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
                <div className="flex items-center justify-between gap-6 h-14 sm:h-16">
                    <Link
                        href="/"
                        className="font-serif text-lg sm:text-xl font-semibold tracking-[-0.015em]
                                   text-foreground hover:text-primary transition-colors
                                   whitespace-nowrap"
                    >
                        Cristina Sizemore
                    </Link>

                    <nav className="flex items-center gap-4 sm:gap-6 min-w-0">
                        {navigation.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[13px] sm:text-sm text-muted-foreground
                                           hover:text-foreground transition-colors whitespace-nowrap"
                            >
                                <span className="sm:hidden">{'short' in item ? item.short : item.name}</span>
                                <span className="hidden sm:inline">{item.name}</span>
                            </Link>
                        ))}
                        <span className="ml-1 sm:ml-2">
                            <ThemeToggle />
                        </span>
                    </nav>
                </div>
            </div>
        </header>
    );
}
