
# MemoryPress — Memoirs/Books Starter (Next.js + Tailwind + shadcn)

A clean starter to publish memoirs and books—now with chapters, audio, a photo gallery, and a simple filesystem CMS.

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Chapters, audio, gallery
- Books live in `content/books/<slug>/_book.json`
- Chapters are Markdown files in `content/books/<slug>/chapters/<number>.md` with frontmatter:
  ```yaml
  ---
  title: "Chapter title"
  audio: "https://.../narration.mp3"   # optional
  images:
    - "https://.../photo1.jpg"
    - "https://.../photo2.jpg"
  ---
  ```
- The site renders:
  - Chapter navigation (prev/next)
  - An HTML5 audio player if `audio` is set
  - A lightbox image gallery

## Pages & routing
- `/books` — library index
- `/books/:slug` — book detail (lists chapters)
- `/books/:slug/chapters/:number` — chapter page

## Newsletter (Mailchimp or ConvertKit)
Copy `.env.example` → `.env.local` and fill ONE provider:

**Mailchimp**
```env
MAILCHIMP_API_KEY=xxxxxxxx-us21
MAILCHIMP_LIST_ID=abcd1234
```

**ConvertKit**
```env
CONVERTKIT_API_KEY=ck_xxx
CONVERTKIT_FORM_ID=123456
```

## Stripe Checkout (Buy buttons)
```env
STRIPE_SECRET_KEY=sk_test_...
PRICE_ID_RIVER_YEARS=price_...
PRICE_ID_LETTERS_TO_THE_PRESENT=price_...
PRICE_ID_ONE_ROAD_ONE_SPIRIT=price_...
```

## Deploy to Vercel
1. Push to GitHub.
2. Import the repo on Vercel and Deploy.
3. Add the same environment variables in Project → Settings → Environment Variables.

## Optional hosted CMS
The default **filesystem CMS** needs no keys. If you want a hosted CMS:

**Sanity (outline)**
- `npm i next-sanity @sanity/client`
- Create a project; define `book` and `chapter` schemas.
- Add envs: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_READ_TOKEN` (optional)
- Replace fs calls with Sanity queries in `app/books/*` pages.

**Notion (outline)**
- `npm i @notionhq/client`
- Create a database with fields: Book, Number, Title, Audio, Images, Body.
- Add envs: `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- Write a `lib/notion.ts` mapper and use it in pages.

**Contentlayer (outline)**
- `npm i -D contentlayer next-contentlayer`
- Add `contentlayer.config.ts` and wrap `next.config.js` with `withContentlayer()`.
- Convert `/content` to MDX and import from `contentlayer/generated`.

