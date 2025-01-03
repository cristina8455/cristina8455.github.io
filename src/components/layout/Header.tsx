// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Users, Calculator, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navigation = [
    { name: 'Courses', href: '/courses', icon: BookOpen, shortLabel: 'Courses' },
    { name: 'Resources', href: '/resources', icon: Calculator, shortLabel: 'Resources' },
    { name: 'Office Hours', href: '/office-hours', icon: Users, shortLabel: 'Hours' },
    { name: 'About', href: '/about', icon: User, shortLabel: 'About' }
] as const;

export default function Header() {
    return (
        <header className="bg-card border-b border-border">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                    >
                        Cristina Sizemore
                    </Link>
                    <nav className="flex items-center">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
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
                        </div>
                        {/* Mobile Navigation */}
                        <div className="flex md:hidden items-center ml-4 space-x-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-200 group"
                                >
                                    <item.icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                                    <span className="text-xs mt-0.5">{item.shortLabel}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="ml-1 sm:ml-6">
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}