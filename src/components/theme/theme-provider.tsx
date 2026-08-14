// src/components/theme/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

/** Cross-tab theme changes arrive as `storage` events. */
function subscribeToStorage(onChange: () => void): () => void {
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
}

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = 'ui-theme',
    ...props
}: ThemeProviderProps) {
    // The saved theme lives in localStorage, which does not exist during SSR.
    // Reading it through useSyncExternalStore gives React an explicit server
    // snapshot (null -> defaultTheme) instead of syncing it in an effect, and
    // subscribing to `storage` keeps other tabs in step for free.
    const stored = useSyncExternalStore(
        subscribeToStorage,
        () => localStorage.getItem(storageKey),
        () => null
    );

    // A choice made in this tab wins over what is currently in storage.
    const [override, setOverride] = useState<Theme | null>(null);
    const theme = override ?? (stored as Theme | null) ?? defaultTheme;

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            if (theme === 'system') {
                const systemTheme = mediaQuery.matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(theme);
            }
        };

        // Apply theme immediately
        applyTheme();

        // Listen for system theme changes
        const listener = (event: MediaQueryListEvent) => {
            if (theme === 'system') {
                root.classList.remove('light', 'dark');
                root.classList.add(event.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', listener);

        return () => {
            mediaQuery.removeEventListener('change', listener);
        };
    }, [theme]);

    const value = {
        theme,
        setTheme: (next: Theme) => {
            localStorage.setItem(storageKey, next);
            setOverride(next);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};