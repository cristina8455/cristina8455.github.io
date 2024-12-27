// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Users, Calculator, Mail } from 'lucide-react';

const navigation = [
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Resources', href: '/resources', icon: Calculator },
    { name: 'Office Hours', href: '/office-hours', icon: Users },
    { name: 'Contact', href: '/contact', icon: Mail }
] as const;

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                        Cristina Sizemore
                    </Link>
                    <nav className="flex space-x-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm group"
                            >
                                <item.icon size={16} className="group-hover:scale-110 transition-transform duration-200" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}