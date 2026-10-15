# FormBuilder

A full-stack form builder. Sign in with Google, design forms with a drag-and-drop editor, share a public link, collect responses (including file uploads), and export everything to CSV.

## Features

- **Google sign-in** with Better Auth. Each user only sees their own forms and responses.
- **Drag-and-drop builder** with live preview, duplicate, reorder, required toggle, and unsaved-changes indicator (`Ctrl/Cmd + S` to save).
- **8 field types**: short text, long text, email, number, dropdown, radio, checkbox, file upload.
- **Public form pages** at `/f/[id]` with client and server validation.
- **File uploads** (images, documents, any file) via UploadThing.
- **Responses table** with search, clickable file links, per-row delete, and CSV export.
- **Skeleton loaders**, toast notifications (Sonner), and a responsive UI built with Tailwind CSS.

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React, TypeScript |
| Styling | Tailwind CSS v4, lucide-react icons |
| Database | PostgreSQL + Prisma ORM |
| Auth | Better Auth (Google OAuth) |
| HTTP client | Axios with request/response interceptors |
| File uploads | UploadThing |
| Drag and drop | dnd-kit |
| Notifications | Sonner |

## Project structure

```
app/
├─ (dashboard)/            # navbar + footer layout
│  ├─ layout.tsx
│  └─ dashboard/page.tsx   # list of the user's forms
├─ (editor)/               # navbar-only layout
│  ├─ layout.tsx
│  └─ builder/[id]/
│     ├─ page.tsx          # form builder
│     └─ submissions/page.tsx
├─ api/
│  ├─ auth/[...all]/route.ts
│  ├─ forms/route.ts                          # list + create
│  ├─ forms/[id]/route.ts                     # get + update + delete
│  ├─ forms/[id]/submit/route.ts              # public submit
│  ├─ forms/[id]/submissions/route.ts         # list responses
│  ├─ forms/[id]/submissions/[submissionId]/route.ts
│  └─ uploadthing/{core.ts,route.ts}
├─ f/[id]/page.tsx         # public form
├─ login/page.tsx
├─ privacy/page.tsx
├─ terms/page.tsx
├─ layout.tsx
└─ page.tsx                # landing page
components/
├─ builder/{FieldSettings.tsx,SortableFieldCard.tsx}
├─ FieldRenderer.tsx
├─ FileUpload.tsx
├─ Footer.tsx
├─ Navbar.tsx
└─ UserMenu.tsx
lib/
├─ auth.ts                 # Better Auth server config
├─ auth-client.ts          # Better Auth client
├─ axios.ts                # Axios instance + interceptors
├─ prisma.ts               # Prisma client singleton
├─ session.ts              # getSession() helper for API routes
├─ uploadthing.ts
└─ validate.ts             # validation shared by browser and server
prisma/schema.prisma
proxy.ts                   # protects /dashboard and /builder
types/form.ts
```

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Google sign-in |
| `/f/[id]` | Public | Fill in a published form |
| `/dashboard` | Private | Your forms |
| `/builder/[id]` | Private | Form editor |
| `/builder/[id]/submissions` | Private | Responses table |

## Getting started

### 1. Prerequisites

- Node.js 20 or newer
- A PostgreSQL database (local, Neon, or Supabase)
- A Google Cloud OAuth client
- An UploadThing account

### 2. Install

```bash
git clone <your-repo-url>
cd form-builder
npm install
```

### 3. Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/formbuilder"

BETTER_AUTH_SECRET="generate with: openssl rand -base64 32"
BETTER_AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

UPLOADTHING_TOKEN="your_uploadthing_token"
```

### 4. Google OAuth setup

1. Open the [Google Cloud Console](https://console.cloud.google.com) and create a project.
2. Configure the **OAuth consent screen** (External) and add your account as a test user.
3. Create **Credentials → OAuth client ID → Web application** with:
   - Authorized JavaScript origin: `http://localhost:3000`
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Secret into `.env`.

### 5. Database

```bash
npx prisma migrate dev
npx prisma generate
```

Open `npx prisma studio` any time to inspect your data.

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the code |
| `npx prisma studio` | Browse the database |
| `npx prisma migrate dev` | Create and apply a migration |

## How it works

- **Forms** are stored in PostgreSQL. The field definitions are a JSON array on the `Form` row, and each response is a `Submission` row with a JSON object of `{ fieldId: value }`.
- **Validation** lives in `lib/validate.ts` and runs in the browser and again in the submit API route, so it cannot be bypassed by calling the API directly.
- **Security**: `proxy.ts` is a fast first check for a session cookie. The real protection is in the API routes, which verify the session and that the signed-in user owns the form.
- **Publishing**: saving a form in the builder sets `published: true`. Unpublished forms are visible only to their owner.
- **Axios interceptors** attach auth headers, redirect on `401`, and show error toasts in one place, so pages don't repeat error handling.
- **File uploads**: file fields store an array of `{ name, url, size, type }` in the submission. Uploads are anonymous, so file size and count limits in `app/api/uploadthing/core.ts` are your abuse protection.

## Troubleshooting

- **`redirect_uri_mismatch`**: the redirect URI in Google Cloud must be exactly `http://localhost:3000/api/auth/callback/google`.
- **"Access blocked" from Google**: add your account under Test users on the consent screen.
- **`Property 'user' does not exist on type 'never'`**: set `"strict": true` (or `"strictNullChecks": true`) in `tsconfig.json`.
- **"Blocking Route" errors for `useParams`, `usePathname`, or `new Date()`**: remove `cacheComponents` from `next.config.ts`, or wrap the component in `<Suspense>`.
- **`Unknown at rule: @theme`**: Tailwind isn't running. Install `@tailwindcss/postcss`, add `postcss.config.mjs`, and start `app/globals.css` with `@import "tailwindcss";`.
- **Hydration mismatch after editing layouts**: stop the server, delete `.next`, and restart.
- **Prisma client import errors**: if you set a custom `output` in `schema.prisma` (for example `app/generated/prisma`), import the client from there in `lib/prisma.ts`.

## Roadmap

- [ ] Deploy to Vercel with a hosted PostgreSQL database
- [ ] Delete files from UploadThing when responses or forms are deleted
- [ ] Rate limiting or captcha on the public submit endpoint
- [ ] Pagination for large response lists
- [ ] Real Privacy Policy and Terms of Service pages
- [ ] More field types (date, rating, multi-select)

## License

MIT, or replace with your own license.