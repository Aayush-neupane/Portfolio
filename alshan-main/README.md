# Clay Portfolio

A single-page personal portfolio built with **React + Vite + Tailwind CSS v4**, styled as high-fidelity **claymorphism** — soft silicone surfaces, 4-layer shadows, candy-store colors and bouncy organic motion. Fully static output, made for **Cloudflare Pages**.

Sections: Hero · About · Skills · Projects (endless conveyor) · Education · Contact.

---

## Quick start

```bash
npm install
npm run dev        # start the dev server
npm run build      # production build -> /dist
npm run preview    # preview the production build locally
```

### Scripts

| Script              | What it does                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                                                     |
| `npm run build`     | Static production build into `/dist`                                         |
| `npm run preview`   | Serves `/dist` locally                                                       |
| `npm run lint`      | oxlint                                                                       |
| `npm run check:data`| Validates every icon key + asset path referenced by the JSON data files      |
| `npm run smoke`     | Server-renders the whole app and asserts all sections and data are present   |

---

## Make it yours (no code edits needed)

All content lives in JSON under `src/data/`:

| File               | Controls                                                              |
| ------------------ | --------------------------------------------------------------------- |
| `profile.json`     | Name, role, hero copy, bio, photo, résumé path, contact, stats, facts |
| `projects.json`    | Project cards: title, blurb, image, tech stack, links, featured flag  |
| `techStack.json`   | Skill categories and their chips                                      |
| `education.json`   | Timeline entries                                                      |

### Drop-in assets

| What              | Where                                  | Notes                                                        |
| ----------------- | -------------------------------------- | ------------------------------------------------------------ |
| Profile photo     | `public/images/profile.svg`            | Replace with your photo. Keep the name, or update `profile.json` → `"photo"` (e.g. `/images/profile.jpg`). |
| Project images    | `public/images/projects/*.svg`         | Same: drag-and-drop replace, or update `projects.json` → `"image"` per project. |
| Résumé / CV       | `public/resume.pdf`                    | The "Download CV" button points here. Replace the placeholder PDF. |

### EmailJS (contact form)

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Add an email service → copy the **Service ID**
3. Create a template that uses the variables `{{from_name}}`, `{{from_email}}`, `{{message}}` → copy the **Template ID**
4. Copy your **Public Key** from Account → General
5. Paste all three into `src/config/emailjs.js`

Until you do, the form shows a friendly "not configured" message instead of failing silently.

### Icons

Brand and favicon assets are generated from `public/favicon.png` and `public/brand/logo.png` with `npm run generate-assets`. The generated files are copied by Vite from `public/` and are never referenced from `dist/`.

### Page metadata

Update the `<title>`, description and Open Graph tags in `index.html` with your own name and links before deploying.

---

## Editing the design system

All clay tokens live in **`src/index.css`** (Tailwind v4):

- **Colors** — `--color-clay-*` (`canvas`, `text`, `muted`, `accent`, `pink`, `sky`, `emerald`, `amber`, `recess`…)
- **Radii** — `--radius-clay-container(-lg)`, `--radius-clay-card`, `--radius-clay-pill`, `--radius-clay-btn`
- **Shadows** — 4-layer stacks exposed as real utilities: `shadow-clayDeep`, `shadow-clayCard` / `shadow-clayCardHover`, `shadow-clayButton` / `shadow-clayButtonHover`, `shadow-clayChip` / `shadow-clayChipHover`, `shadow-clayPressed`, `shadow-clayPressedSoft`
- **Animation** — `animate-clay-float`, `-float-delayed`, `-float-slow`, `-breathe`, plus the `clay-marquee` conveyor

Conventions kept throughout:

- Headings/numbers use **Nunito** via the Tailwind `font-display` utility (mapped from `--font-display`); body text is **DM Sans**.
- Buttons compress on press (`active:scale-[0.92] active:shadow-clayPressed`), hover lifts (`hover:-translate-y-1`).
- Inputs are recessed (`shadow-clayPressed`) and pop out on focus.
- Background blobs drift on 8–12s loops and gently nudge away from the pointer.
- `prefers-reduced-motion: reduce` disables all animation; the projects conveyor becomes a manually scrollable row.

---

## Deploying to Cloudflare Pages

The build is 100% static — no server, no environment variables required.

**Option A — Git integration (recommended)**

1. Push this repo to GitHub/GitLab.
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Every push to `main` ships automatically.

**Option B — Wrangler CLI**

```bash
npm run build
npx wrangler pages deploy dist --project-name clay-portfolio
```

Because it's a single page with no client-side router, no SPA redirect rules are needed.

---

## Project structure

```
public/
  images/            profile + project placeholder art
  resume.pdf         placeholder CV
src/
  components/        Hero, About, Skills, Projects, Education, Contact, Navbar, Footer, BackgroundBlobs
  components/ui/     ClayButton, ClayCard, IconOrb, Reveal, SectionHeading
  config/emailjs.js  form credentials (fill these in)
  data/              profile / projects / techStack / education JSON
  hooks/             scroll spy, reveal-on-scroll, reduced-motion
  lib/               icon registry + clay tone helpers
scripts/             data validation + SSR smoke test
```
