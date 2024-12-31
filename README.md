# Academic Website

Personal academic website built with Next.js, featuring course materials and resources for College of Lake County students.

## Features

- Course materials and resources
- Office hours information
- Student resources page with curated learning materials
- About page with professional background
- Archive of past courses
- Mobile-responsive design
- Dynamic course routing
- Centralized course data management
- Custom 404 page

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

2. Add course content in `src/content/courses/[term-year]/[course]/`:
   - Create new term folder if needed (e.g., `2025-spring`)
   - Add course folder (e.g., `mth122`)
   - Add content files (syllabus, assignments, etc.)

### Common Tasks
- Update current term: Edit `currentTerm` in `src/data/courses.ts`
- Modify site header: Edit `src/components/layout/Header.tsx`
- Change home page content: Edit `src/app/page.tsx`
- Edit resources: Update `src/app/resources/page.tsx`
- Update about/contact info: Edit `src/app/about/page.tsx`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
src/
├── app/             # App router pages
│   ├── office-hours/  # Office hours page
│   ├── resources/     # Resources page
│   ├── about/         # About/contact page
│   └── _not-found/   # Custom 404 page
├── components/      # Reusable components
│   ├── layout/     # Layout components
│   ├── courses/    # Course-related components
│   ├── office-hours/ # Office hours components
│   └── shared/     # Shared UI components
├── content/        # Markdown content for courses
├── data/          # Data files and types
│   └── courses.ts  # Centralized course data
├── types/         # TypeScript type definitions
└── pages/         # Special Next.js pages
    └── _document.tsx  # Custom document component
```

## Content Management

Course content is managed through three main areas:

1. Central course data in `src/data/courses.ts`
2. Markdown content in `content/courses/[term]/[course]`
3. Dynamic routing via `app/courses/[term]/[courseId]`

### Updating for New Terms

1. Update `src/data/courses.ts` with new course information
2. Create term folder: `content/courses/[term-year]`
3. Add course subfolders with markdown content
4. No changes needed to app routing structure

## Planned Enhancements

### Calendar Integration
- Office 365 calendar integration for office hours
- Course-specific calendars for important dates
- Exam schedules and review sessions
- Support for schedule exceptions and changes

### Canvas Integration
- Seamless access to course materials
- Grade information
- Announcements integration

### Additional Features
- Enhanced resource library organization
- Improved student engagement features
- Dark mode support

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.