// src/components/theme/theme-toggle.tsx
'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <button
            onClick={cycleTheme}
            className="relative w-8 h-8 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            <div className="relative h-full w-full flex items-center justify-center">
                <Sun
                    className={`h-4 w-4 absolute transition-all ${theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
                        }`}
                />
                <Moon
                    className={`h-4 w-4 absolute transition-all ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
                        }`}
                />
                <Monitor
                    className={`h-4 w-4 absolute transition-all ${theme === 'system' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
                        }`}
                />
            </div>
        </button>
    );
}