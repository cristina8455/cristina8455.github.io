# Canvas HTML Restrictions Reference

Canvas LMS uses a server-side HTML sanitizer that strips disallowed tags and attributes. This document outlines what's allowed and blocked when creating or updating Canvas pages via the API or Rich Content Editor.

**Last verified:** January 2026

## Blocked (Stripped by Sanitizer)

| Category | Details |
|----------|---------|
| **JavaScript** | No `<script>` tags, no inline event handlers (`onclick`, `onload`, `onerror`, `onmouseover`, etc.) |
| **Forms** | No `<form>`, `<input>`, `<button>`, `<select>`, `<textarea>` |
| **Document structure** | No `<html>`, `<head>`, `<body>`, `<meta>`, `<link>` |
| **Style blocks** | No `<style>` tags (inline `style=""` attribute IS allowed) |
| **Dangerous protocols** | Only `http`, `https`, `mailto`, `ftp`, `skype` allowed in `href` attributes |
| **Some CSS properties** | `user-select`, `-webkit-user-select`, and others (see CSS section below) |

## Allowed HTML Tags

### Structural
`div`, `span`, `section`, `article`, `header`, `footer`, `nav`, `aside`

### Headings & Text
`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `br`, `hr`

### Text Formatting
`a`, `b`, `strong`, `i`, `em`, `u`, `strike`, `del`, `ins`, `small`, `sub`, `sup`, `abbr`, `mark`, `code`, `pre`, `kbd`, `samp`, `var`, `tt`, `dfn`, `acronym`, `bdo`, `big`

### Lists
`ul`, `ol`, `li`, `dl`, `dt`, `dd`

### Blocks & Quotes
`blockquote`, `q`, `address`, `cite`

### Tables
`table`, `thead`, `tbody`, `tfoot`, `tr`, `td`, `th`, `caption`, `col`, `colgroup`

Supported attributes: `border`, `cellpadding`, `cellspacing`, `width`, `summary`, `colspan`, `rowspan`, `align`, `valign`

### Media
`img`, `video`, `audio`, `source`, `track`, `picture`, `iframe`, `embed`, `object`, `param`

**iframe restrictions:** Domain must be in Canvas's allowed list (YouTube, Vimeo, etc.). Custom domains require admin configuration.

### Interactive (CSS-only)
`details`, `summary` - Native HTML5 collapsible sections that work without JavaScript!

### Semantic
`figure`, `figcaption`, `time`, `ruby`, `rt`, `rp`, `legend`, `map`, `area`

### MathML
Full MathML support: `math`, `mrow`, `msub`, `msup`, `mfrac`, `mi`, `mo`, `mn`, `mtext`, `mspace`, `msqrt`, `mroot`, `mover`, `munder`, `mtable`, `mtr`, `mtd`, and more.

## Allowed Attributes

### Global (all elements)
- `style` - Inline CSS (subject to CSS allowlist)
- `class` - CSS classes (must be defined elsewhere or by admin)
- `id` - Element IDs
- `title` - Tooltips
- `role` - ARIA roles
- `lang`, `dir` - Language and text direction
- `data-*` - Custom data attributes (most are preserved)
- ARIA attributes (`aria-label`, `aria-hidden`, `aria-expanded`, etc.)

### Element-specific
- `<a>`: `href`, `target`, `name`, `rel`
- `<img>`: `src`, `alt`, `width`, `height`, `usemap`, `longdesc`, `align`
- `<video>`, `<audio>`: `src`, `controls`, `muted`, `poster`, `playsinline`, `autoplay`, `loop`
- `<iframe>`: `src`, `width`, `height`, `sandbox`, `allow`, `allowfullscreen`, `loading`
- `<td>`, `<th>`: `colspan`, `rowspan`, `align`, `valign`, `width`, `height`

## Allowed CSS Properties

### Layout
- Display: `display`, `visibility`, `overflow`, `float`, `clear`
- Position: `position`, `top`, `right`, `bottom`, `left`, `z-index`
- Box model: `width`, `height`, `min-*`, `max-*`, `margin`, `padding`

### Flexbox
`flex`, `flex-direction`, `flex-wrap`, `flex-flow`, `flex-grow`, `flex-shrink`, `flex-basis`, `justify-content`, `align-items`, `align-content`, `align-self`, `order`

### CSS Grid
`grid`, `grid-template-columns`, `grid-template-rows`, `grid-template-areas`, `grid-column`, `grid-row`, `grid-gap`, `gap`

### Typography
`font`, `font-family`, `font-size`, `font-weight`, `font-style`, `line-height`, `text-align`, `text-decoration`, `text-indent`, `text-transform`, `letter-spacing`, `word-spacing`, `white-space`, `color`

### Backgrounds & Borders
`background`, `background-color`, `background-image`, `background-position`, `background-repeat`, `background-size`, `border`, `border-radius`, `box-shadow` (may require admin CSS)

### Other
`list-style`, `list-style-type`, `vertical-align`, `cursor`, `opacity`

### NOT Allowed CSS
- `user-select`, `-webkit-user-select`
- `content` (for `::before`/`::after`)
- CSS animations (`@keyframes`, `animation-*`)
- CSS transitions (partially supported)
- Custom properties (`--var-name`)

## Practical Implications

### What You CAN Do
1. **Collapsible sections** - Use `<details>` and `<summary>` for expandable content
2. **Modern layouts** - Flexbox and CSS Grid work
3. **Styled tables** - Full table support with borders, colors, spacing
4. **Embedded media** - YouTube, Vimeo, and other allowed iframe sources
5. **Math notation** - Full MathML and KaTeX/MathJax rendered content
6. **Custom styling** - Inline styles for colors, fonts, spacing, etc.
7. **Accessibility** - ARIA attributes for screen readers
8. **Link behavior** - `target="_blank"` works (what we use for new tab links)

### What You CAN'T Do (workarounds)
| Want | Limitation | Workaround |
|------|------------|------------|
| Interactive forms | No form elements | Use Canvas Quizzes/Assignments |
| Click handlers | No JavaScript | Use `<details>` for expand/collapse |
| Hover effects | Limited CSS | Some `:hover` works in inline styles |
| Custom fonts | Must be web-safe or admin-added | Use system fonts or request admin CSS |
| Embedded apps | iframe domain restrictions | Request admin to allowlist domain |

## References

- [Canvas HTML Editor Allowlist (Instructure Community)](https://community.instructure.com/t5/Canvas-Resource-Documents/Canvas-HTML-Editor-Allowlist/ta-p/387066)
- [Canvas sanitizer source code (GitHub)](https://github.com/instructure/canvas-lms/blob/master/gems/canvas_sanitize/lib/canvas_sanitize/canvas_sanitize.rb)
- [Canvas Content Security Policy API](https://canvas.instructure.com/doc/api/content_security_policy_settings.html)
- [GitHub issue: CSS user-select not whitelisted](https://github.com/instructure/canvas-lms/issues/2466)
- [GitHub issue: details/summary elements](https://github.com/instructure/canvas-lms/issues/1502)

## Keeping This Updated

Canvas occasionally updates their allowlist. To check for changes:

1. Review the [official allowlist document](https://community.instructure.com/t5/Canvas-Resource-Documents/Canvas-HTML-Editor-Allowlist/ta-p/387066)
2. Check the [canvas_sanitize.rb source](https://github.com/instructure/canvas-lms/blob/master/gems/canvas_sanitize/lib/canvas_sanitize/canvas_sanitize.rb)
3. Test in Canvas's Rich Content Editor - if it survives save/reload, it's allowed
