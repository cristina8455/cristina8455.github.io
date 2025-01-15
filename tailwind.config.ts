// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            h2: {
              color: 'hsl(var(--foreground))',
              fontWeight: '700',
              fontSize: '1.75rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              color: 'hsl(var(--foreground))',
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h4: {
              color: 'hsl(var(--foreground))',
              fontWeight: '500',
              fontSize: '1.1rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            p: {
              color: 'hsl(var(--foreground))',
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            li: {
              color: 'hsl(var(--foreground))',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            'ul > li': {
              paddingLeft: '1.5rem',
            },
            'ul > li::before': {
              backgroundColor: 'hsl(var(--foreground))',
              opacity: 0.5,
            },
            strong: {
              color: 'hsl(var(--foreground))',
              fontWeight: '600',
            },
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.8,
              },
            },
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;