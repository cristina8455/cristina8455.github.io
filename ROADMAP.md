# Roadmap

## Completed

### Phase 1: Canvas-First Architecture (Jan 2026)

Transformed the site from manually-maintained content to automatic Canvas sync.

**What was done:**
- Created Canvas API client (`src/lib/canvas-api.ts`)
- Built course data layer (`src/lib/courses.ts`)
- Implemented dynamic routes for courses, pages, and syllabi
- Set up ISR caching (24-hour revalidation)
- Deployed to Vercel
- Added GitHub Action for daily cache warming

**What was removed:**
- Manual course data files (`src/data/courses.ts`, `src/data/course-content/`)
- Local markdown content (`src/content/courses/`, `src/content/syllabi/`)
- Build-time Canvas sync scripts (`src/sync/`)
- Duplicate component libraries

**Result:** ~70% less code. Zero manual content updates needed.

### Phase 2: Course Filtering (Jan 2026)

- Filter out courses before Fall 2024
- Exclude non-teaching courses (Math Dept Resources)
- Support multiple naming conventions ("Notes and Assignments" + "Calendar and Daily Notes")

### Phase 3: Canvas API Tooling (Jan 2026)

- Script to update page links to open in new tabs (single page)
- Bulk script to update all courses/pages at once (with backup option)
- Script to analyze links on a page
- Updated 71 pages / 170 links across Spring 2026 courses
- Foundation for more Canvas automation

### Phase 4: Office Hours Sync (Jan 2026)

- Auto-parse office hours from Canvas course front page
- Extract schedule (virtual/in-person), room, Zoom link
- Tries multiple courses to find most complete data
- Graceful fallback if parsing fails
- Removed static office hours data files

---

## Next Steps

### Near-term (Low Effort, High Value)

**1. ~~Bulk link updates~~** ✅ Completed
`bulk-update-links.ts` updates all Notes & Assignments + Day pages across configured courses.

**2. Course template script**
Script to set up a new course from a template:
- Create standard pages (Notes & Assignments, Exam Info)
- Apply consistent formatting
- Set up assignment structure

**3. Date shifting script**
Shift all assignment due dates by N days for new semester setup.

### Medium-term (Moderate Effort)

**4. Cross-section sync**
When teaching multiple sections of the same course, push content updates to all sections at once.

**5. Content validation**
Audit script that checks for:
- Broken links
- Missing due dates
- Empty pages
- Inconsistent formatting

**6. Backup to git**
Export course content to version-controlled markdown:
- Track changes over time
- Diff between semesters
- Disaster recovery

### Long-term (Larger Effort)

**7. Course generation from schedule**
Define semester schedule in spreadsheet/JSON, generate all Day pages automatically.

**8. Style enforcement**
Apply consistent styling across all pages:
- Headers, fonts, colors
- Navigation elements
- Accessibility improvements

**9. Two-way sync exploration**
Investigate whether editing content locally and pushing to Canvas is viable (vs. always editing in Canvas directly).

---

## Not Planned

These were considered but intentionally deferred:

- **Front page syncing** - Not important enough to add complexity
- **Real-time sync** - 24-hour cache is sufficient for this use case
- **Canvas embedding** - The old architecture supported this; not needed with direct site access
- **Historical course archival** - Canvas retains courses for years; if needed later, can add git-based backup

---

## Reference Documentation

- [docs/canvas-html-restrictions.md](docs/canvas-html-restrictions.md) - What HTML/CSS Canvas allows and blocks. Consult before building Canvas page automation.

## Technical Debt

Minor items to address when convenient:

- [ ] Remove unused jsdom dependency (was for link updates, switched to regex)
- [ ] Add `.env.example` file
- [ ] Consider adding error boundaries for Canvas API failures

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| ISR over static export | Need dynamic Canvas fetching; Vercel handles ISR well |
| 24-hour cache | Balance between freshness and API load; daily cache warming covers it |
| Regex over JSDOM for link updates | JSDOM was hanging; regex is faster and sufficient |
| No front page sync | YAGNI - adds complexity for "not super important" content |
| Filter pre-Fall 2024 | Before instructor started at CLC; no relevant content |
