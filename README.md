# A1 React frontend

React 19 + Vite + React Router, backed by Laravel/MySQL.

- `npm run dev`: frontend only at http://127.0.0.1:3000 (start backend separately).
- `npm run build`: production static files in dist.
- `npm run preview`: locally inspect the production build.
- Public backend URL: VITE_BACKEND_URL (baked into the build).

See ../README.md for local startup, migration limitations and Hostinger VPS deployment.
Client rendering replaces server rendering; page-specific metadata requires JavaScript.
