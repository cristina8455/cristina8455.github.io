// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Users, Calculator, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navigation = [
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Resources', href: '/resources', icon: Calculator },
    { name: 'Office Hours', href: '/office-hours', icon: Users },
    { name: 'About', href: '/about', icon: User }
] as const;

export default function Header() {
    return (
        <header className="bg-card border-b border-border">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                    >
                        Cristina Sizemore
                    </Link>
                    <nav className="flex items-center space-x-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm group"
                            >
                                <item.icon size={16} className="group-hover:scale-110 transition-transform duration-200" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}