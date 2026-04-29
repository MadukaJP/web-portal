# Insighta Labs+ Web Portal

**Live Project**: [https://insighta-labs-portal.netlify.app](https://insighta-labs-portal.netlify.app)  
**Live Backend**: [https://name-classify-api.fastapicloud.dev](https://name-classify-api.fastapicloud.dev)

React web portal for Insighta Labs+. The portal is the non-technical interface for analysts and internal stakeholders, backed by the same FastAPI service used by the CLI.

## Tech Stack

- **React 19** with TypeScript
- **Vite** as build tool and dev server
- **React Router v7** for client-side routing
- **TanStack React Query** for server state management
- **Axios** for HTTP requests
- **Tailwind CSS v4** for styling
- **shadcn/ui** (Radix UI primitives + CVA) for component library
- **Lucide React** for icons

## Pages

- `/login`: GitHub OAuth entry point
- `/dashboard`: basic profile metrics and recent profiles
- `/profiles`: filters, sorting, pagination, CSV export, admin create form. Clicking any profile in the list navigates to its detail page.
- `/profiles/$id`: profile detail view with full information and admin-only delete action
- `/search`: natural language profile search
- `/account`: authenticated user profile and logout

## Configuration

Create `.env` from `.env.example`:

```env
VITE_API_URL=https://name-classify-api.fastapicloud.dev
VITE_API_VERSION=1
```

In development, Vite proxies `/auth` and `/api` to the backend so cookie auth works as same-origin traffic. In production, set `VITE_API_URL` to the deployed backend origin.

## Authentication

The login page links to `GET /auth/github`. The backend handles GitHub OAuth with PKCE, then redirects back to `/dashboard` after setting HTTP-only `access_token` and `refresh_token` cookies.

Tokens are never stored in browser JavaScript. The portal calls backend APIs through Axios and React Query, forwarding the incoming `cookie` header to the backend.

## CSRF Protection

The backend sets a readable `csrf_token` cookie alongside the HTTP-only auth cookies. Cookie-authenticated unsafe requests must include:

```http
X-CSRF-Token: <csrf_token cookie value>
```

The portal sends this header for:

- logout
- profile creation
- profile deletion

The shared Axios client also attaches the CSRF header for browser-side unsafe requests such as token refresh retries.

## Role Enforcement

The backend is the final authority for roles:

- `analyst`: read/search/export only
- `admin`: create and delete profiles

The portal mirrors this behavior in the UI by hiding create/delete controls from analysts, but backend RBAC still protects the endpoint.

## Development

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

## Deployment

The app is configured for Netlify. The submitted deployment should include the live portal URL and the deployed backend URL.
