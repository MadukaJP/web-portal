# Insighta Labs+ Web Portal

React/TanStack Start web portal for Insighta Labs+. The portal is the non-technical interface for analysts and internal stakeholders, backed by the same FastAPI service used by the CLI.

## Pages

- `/login`: GitHub OAuth entry point
- `/dashboard`: basic profile metrics and recent profiles
- `/profiles`: filters, sorting, pagination, CSV export, admin create form
- `/profiles/$id`: profile detail view, admin-only delete action
- `/search`: natural language profile search
- `/account`: authenticated user profile and logout

## Configuration

Create `.env`:

```env
VITE_API_VERSION=1
VITE_API_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:8000
VITE_ENV=development
```

In development, Vite proxies `/auth` and `/api` to `VITE_BACKEND_URL` so cookie auth can work as same-origin traffic. In production, configure `VITE_API_URL` to the deployed backend origin or same-origin proxy.

## Authentication

The login page links to `GET /auth/github`. The backend handles GitHub OAuth with PKCE, then redirects back to `/dashboard` after setting HTTP-only `access_token` and `refresh_token` cookies.

Tokens are never stored in browser JavaScript. The portal calls backend APIs through TanStack server functions and forwards the incoming `cookie` header to the backend.

## CSRF Protection

The backend sets a readable `csrf_token` cookie alongside the HTTP-only auth cookies. Cookie-authenticated unsafe requests must include:

```http
X-CSRF-Token: <csrf_token cookie value>
```

The portal sends this header from server functions for:

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

The app is configured for Netlify through `netlify.toml` and the Netlify TanStack Start plugin. The submitted deployment should include the live portal URL and the deployed backend URL.
