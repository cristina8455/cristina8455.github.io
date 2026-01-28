# Academic Website

Public-facing academic website that automatically syncs course content from Canvas LMS.

**Live site:** [cristina8455.vercel.app](https://cristina8455.vercel.app)

## How It Works

```
Canvas LMS (source of truth)
    ↓ API
Website (auto-updated mirror)
```

The instructor updates course content in Canvas. The website automatically reflects those changes within 24 hours (or immediately on the next visit after cache expires).

**Zero manual content updates required.**

## Features

- **Auto-sync from Canvas** - Courses, pages, and syllabi pulled from Canvas API
- **Course discovery** - New courses automatically appear when added in Canvas
- **ISR caching** - Fast page loads with 24-hour cache refresh
- **Dark mode** - System preference detection with manual toggle
- **Mobile responsive** - Works on all devices

## Pages

| Route | Content |
|-------|---------|
| `/` | Current semester courses |
| `/courses` | All courses (current + archive) |
| `/courses/[term]/[course]` | Course homepage (Notes & Assignments) |
| `/courses/[term]/[course]/syllabus` | Course syllabus |
| `/courses/[term]/[course]/[page]` | Individual Canvas pages |
| `/office-hours` | Office hours schedule |
| `/resources` | Student resources |
| `/about` | About page |

## Development

### Prerequisites

- Node.js 20+
- Canvas API token (see [scripts/README.md](scripts/README.md))

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your Canvas credentials

# Run dev server
npm run dev
```

### Environment Variables

```bash
# .env.local
CANVAS_BASE_URL=https://clcillinois.instructure.com
CANVAS_API_TOKEN=<token>
```

### Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

Deployed on Vercel with automatic deploys from `main` branch.

**Environment variables required in Vercel:**
- `CANVAS_BASE_URL`
- `CANVAS_API_TOKEN`

**GitHub repository variable (for cache warming):**
- `SITE_URL` - Production URL (e.g., `https://cristina-sizemore.vercel.app`)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── courses/            # Course routes
│   ├── office-hours/       # Office hours page
│   ├── resources/          # Student resources
│   └── about/              # About page
├── components/             # React components
│   ├── layout/             # Header, footer, layouts
│   ├── theme/              # Dark mode toggle
│   └── ui/                 # Base UI components
├── lib/                    # Core libraries
│   ├── canvas-api.ts       # Canvas API client
│   └── courses.ts          # Course utilities
└── data/                   # Static data (office hours)

scripts/                    # Canvas utility scripts
```

## Canvas Utility Scripts

Scripts for programmatically updating Canvas content. See [scripts/README.md](scripts/README.md).

```bash
# Update links to open in new tabs
npx tsx scripts/update-canvas-links.ts 57795 notes-and-assignments --dry-run
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting with ISR support
- [Canvas LMS API](https://canvas.instructure.com/doc/api/) - Content source
