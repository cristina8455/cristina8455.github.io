# Academic Website

Personal academic website built with Next.js, featuring course materials and resources for College of Lake County students.

## Features

- Course materials and resources
- Office hours information
- Student resources
- Archive of past courses
- Mobile-responsive design
- Dynamic course routing
- Centralized course data management

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
├── components/      # Reusable components
│   ├── layout/     # Layout components
│   ├── courses/    # Course-related components
│   └── shared/     # Shared UI components
├── content/        # Markdown content for courses
└── data/          # Data files for courses
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

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.