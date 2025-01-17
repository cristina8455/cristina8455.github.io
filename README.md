# Academic Website

Personal academic website built with Next.js, featuring course materials and resources for College of Lake County students.

## Features

- Course materials and resources
- Office hours information
- Student resources page with curated learning materials
- About page with professional background
- Comprehensive course archive with institutional history
- Mobile-responsive design with compact navigation
- Dynamic course routing
- Centralized course data management
- Dark mode support with system preference detection and enhanced contrast
- Canvas LMS integration:
  - Direct embedding support for course pages
  - Theme-aware embedded layout with persistent course context
  - Seamless navigation between course and shared pages
  - Automatic context preservation in Canvas
  - Responsive layout optimized for Canvas embedding
  - Shared resources across courses with proper navigation
- Custom 404 page
- Canvas content sync with build-time processing
- LaTeX math support
- Automated content transformation from Canvas

## Quick Start Guide for Updates

### Updating Office Hours
Edit `src/data/office-hours.ts`:
- Modify weekly schedule
- Update room location
- Change virtual meeting information

### Adding/Editing Courses
1. Update course information in `src/data/courses.ts`:
   - Add new courses
   - Modify course details (title, code, schedule)
   - Change current term
   - Add historical courses to the archive

2. Add course content in `src/content/courses/[term-year]/[course]/`:
   - Create new term folder if needed (e.g., `2025-spring`)
   - Add course folder (e.g., `mth122`)
   - Add content files (syllabus, assignments, etc.)

### Canvas Integration

#### Content Syncing
1. Configure Canvas integration in `.env.local`:
   ```
   CANVAS_BASE_URL=https://[institution].instructure.com
   CANVAS_API_TOKEN=[your-token]
   SYNC_COURSE_IDS=id1,id2
   COURSE_MAPPINGS=[{"canvasId":"id","term":"term-slug","courseCode":"code"}]
   ```

2. Run sync process:
   ```bash
   # Sync Canvas content only
   npm run sync-canvas

   # Build site with fresh Canvas content
   npm run build-with-sync
   ```

#### Embedding Pages in Canvas
Course pages can be embedded directly in Canvas using iframes:
1. Pages auto-detect Canvas embedding
2. Provide simplified navigation in Canvas context
3. Maintain theme support and dark mode
4. Support all course content types
5. Preserve course context across shared pages

### Common Tasks
- Update current term: Edit `currentTerm` in `src/data/courses.ts`
- Modify site header: Edit `src/components/layout/Header.tsx`
- Change home page content: Edit `src/app/page.tsx`
- Edit resources: Update `src/app/resources/page.tsx`
- Update about/contact info: Edit `src/app/about/page.tsx`
- Modify theme colors: Update `src/app/globals.css`
- Add/edit historical courses: Update `historicalCourses` in `src/data/courses.ts`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Sync Canvas content
npm run sync-canvas

# Build static site
npm run build

# Build with fresh Canvas content
npm run build-with-sync
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
src/
├── app/             # App router pages
│   ├── office-hours/  # Office hours page
│   ├── resources/     # Resources page
│   ├── about/         # About/contact page
│   ├── courses/       # Course pages
│   │   ├── archive/     # Course archive
│   │   └── [term]/     # Dynamic course routes
│   └── not-found.tsx   # Custom 404 page
├── components/      # Reusable components
│   ├── layout/       # Layout components
│   │   ├── Header.tsx  # Main navigation
│   │   ├── RootLayout.tsx # Layout switcher
│   │   └── CanvasLayout.tsx # Canvas-embedded layout
│   ├── courses/      # Course-related components
│   ├── office-hours/ # Office hours components
│   ├── theme/        # Theme components
│   ├── ui/           # Base UI components
│   └── shared/       # Shared UI components
├── utils/          # Utility functions
│   └── canvas.ts   # Canvas detection utilities
├── content/        # Markdown content for courses
├── data/          # Data files and types
│   └── courses.ts  # Centralized course data
├── sync/          # Canvas integration
│   ├── types.ts     # Sync type definitions
│   ├── canvas-sync.ts # Core sync logic
│   ├── run-sync.ts   # Sync script
│   ├── providers/    # Data providers
│   │   ├── canvas.ts   # Canvas API
│   │   └── website.ts  # Local content
│   └── transform/    # Content transformation
│       └── markdown.ts # HTML to Markdown
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Content Management

Course content is managed through:
1. Central course data in `src/data/courses.ts`
2. Markdown content in `content/courses/[term]/[course]`
3. Dynamic routing via `app/courses/[term]/[courseId]`
4. Canvas sync for automatic content updates

### Canvas Integration

The site supports:
1. Content syncing from Canvas:
   - Build-time sync compatible with static hosting
   - Converts Canvas pages to markdown
   - Handles LaTeX equations and formatting
   - Maintains existing content structure

2. Direct embedding in Canvas:
   - Automatic iframe detection
   - Context-aware navigation with course state preservation
   - Shared pages support (resources, etc.) with proper navigation
   - Theme-aware layout with custom styling for Canvas
   - Dark mode support with smooth transitions
   - Optimized responsive layout for embedded view

### Updating for New Terms

1. Update `src/data/courses.ts` with new course information
2. Create term folder: `content/courses/[term-year]`
3. Add course subfolders with markdown content
4. Previous term courses automatically move to archive

## Course Archive

The site includes a comprehensive course archive system:
- Historical teaching record by institution
- Accordion-based navigation by institution and term
- Chronological organization with year ranges
- Maintains detailed information for recent courses
- Preserves teaching history across institutions

### Managing Archive Content

The archive distinguishes between two types of courses:
1. Recent courses (full details, content, and materials)
2. Historical courses (basic information and context)

Update archive content in `src/data/courses.ts`:
- Add historical courses to `historicalCourses` array
- Recent courses automatically transition to archive when term ends

## Theme System

The site includes a comprehensive theme system with:
- Automatic system preference detection
- Manual theme toggle accessible on all devices
- Consistent color palette across components
- Smooth transitions between themes
- Semantic color variables for maintainability
- Enhanced contrast for text and UI elements in dark mode
- Proper dark mode support for dynamic course content
- Theme support in Canvas-embedded context

### Customizing Theme Colors

Theme colors can be modified in two places:
1. `src/app/globals.css` for CSS variables and dark mode configuration
2. `tailwind.config.ts` for Tailwind configuration

## Planned Enhancements

### Calendar Integration
- Office 365 calendar integration for office hours
- Course-specific calendars for important dates
- Exam schedules and review sessions
- Support for schedule exceptions and changes

### Canvas Integration Enhancements
- Real-time content updates
- Two-way sync capability
- Automatic build triggers
- Content version control
- Enhanced embedded layouts
- Canvas-specific styling options

### Additional Features
- Enhanced resource library organization
- Improved student engagement features
- Archive filtering and search capabilities

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.