# nonnorocco

This site uses a modular Hugo structure that keeps content, media, layouts, and static files clearly separated.

## Project structure

- content/
  - Main pages and sections
  - gallery/, memories/, story/, timeline/
  - shared/ for cross-section content
  - per-section image folders for local media
- assets/
  - css/ for stylesheets
  - js/ for scripts
  - images/ for general image assets
  - media/ for larger media files such as uploads, videos, or downloadable files
- layouts/
  - partials/ for reusable template blocks
- static/
  - files that should be served as-is

## Media guidance

- Keep page-specific images close to the related section in content/.
- Put reusable visuals in assets/images/ or assets/media/.
- Use layouts/partials/ to avoid repeating template logic.
- Keep static/ limited to files that do not need processing.

## Maintenance principle

A good rule is: content belongs in content/, reusable assets belong in assets/, and shared presentation logic belongs in layouts/partials/.
