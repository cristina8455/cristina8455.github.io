import type { MetadataRoute } from 'next';
import { getAllCourses } from '@/lib/courses';
import { getCoursePages } from '@/lib/canvas-api';
import { siteUrl } from '@/lib/site';

/**
 * Generated from Canvas, so new courses appear without anyone editing a list.
 *
 * This doubles as the source of truth for cache warming: the daily workflow
 * reads sitemap.xml and requests every URL in it, which replaces the
 * hand-maintained set of term-specific paths it used to carry.
 */

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/courses`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/office-hours`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  let courses;
  try {
    courses = await getAllCourses();
  } catch {
    // Canvas unreachable — still emit the static routes rather than 500.
    return staticRoutes;
  }

  const perCourse = await Promise.all(
    courses.map(async (course): Promise<MetadataRoute.Sitemap> => {
      if (!course.term) return [];
      const prefix = `${base}/courses/${course.term.slug}/${course.slug}`;

      const entries: MetadataRoute.Sitemap = [
        { url: prefix, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${prefix}/syllabus`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      ];

      // One bad course shouldn't empty the whole sitemap.
      try {
        const pages = await getCoursePages(course.id);
        for (const page of pages) {
          entries.push({
            url: `${prefix}/${page.url}`,
            lastModified: page.updated_at ? new Date(page.updated_at) : now,
            changeFrequency: 'weekly',
            priority: 0.5,
          });
        }
      } catch {
        // Course pages unavailable; the course and syllabus entries still stand.
      }

      return entries;
    })
  );

  return [...staticRoutes, ...perCourse.flat()];
}
