# HireHub Onboarding Portal — Changelog

## [1.0.0] — Initial Release

### Added

- Landing page with HireHub branding and feature highlights
- Candidate Interest Form: collects name, email, phone, position, and message
- Admin Dashboard: view, edit, and delete candidate submissions
- Admin Authentication: session-based login (`admin` / `admin`)
- Persistent storage using browser `localStorage` and `sessionStorage`
- Responsive design for desktop and mobile
- No backend required: all data stored in browser
- Header navigation with Home, Apply, Admin links
- Form validation for required fields, email, phone
- Duplicate email prevention for candidate submissions
- Edit modal for updating candidate submissions
- Stats cards in admin dashboard (total, unique positions, last submission)
- Logout functionality for admin session
- Simple error and loading states for async actions
- JSDoc comments for utilities
- PropTypes for component prop validation
- Custom CSS (no frameworks)
- Vite + React 18 setup
- React Router v6 for routing
- Folder structure as documented in README
- Vercel config for static hosting
- Basic test setup with Vitest and Testing Library

### Setup

- Node.js v16+ required
- `npm install` for dependencies
- `npm run dev` for development server
- `npm run build` for production build

---

**HireHub Onboarding Portal** — For internal use only.