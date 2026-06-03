# HireHub Onboarding Portal

A modern onboarding portal for HireHub, built with React 18+ and Vite. Candidates can submit their interest, and admins can manage submissions through a simple dashboard.

## Features

- **Landing Page**: Welcome and introduction to HireHub.
- **Candidate Interest Form**: Collects name, email, phone, position, and message.
- **Admin Dashboard**: View, edit, and delete candidate submissions.
- **Admin Authentication**: Simple session-based login for admin access.
- **Persistent Storage**: Uses browser `localStorage` and `sessionStorage`.
- **Responsive Design**: Works on desktop and mobile.
- **No Backend Required**: All data is stored in the browser.

## Tech Stack

- **React 18+**
- **Vite**
- **React Router v6**
- **PropTypes**
- **CSS (custom, no frameworks)**
- **JSDoc for utilities**

## Folder Structure

```
.
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── EditModal.jsx
│   │   ├── Header.jsx
│   │   ├── InterestForm.jsx
│   │   ├── LandingPage.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── SubmissionTable.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```
   git clone <repo-url>
   cd hirehub-onboarding-portal
   ```

2. **Install dependencies:**

   ```
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser:**

   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production

```
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```
npm run preview
# or
yarn preview
```

## Usage

- **Landing Page**: `/`
- **Apply as Candidate**: `/apply`
- **Admin Dashboard**: `/admin` (requires login)
- **Admin Login**: `/admin/login`

#### Admin Credentials

- **Username**: `admin`
- **Password**: `admin`

> _Note: This is a demo portal. All data is stored in the browser and will be lost if localStorage/sessionStorage is cleared._

## Testing

This project uses [Vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/).

To run tests:

```
npm test
# or
yarn test
```

## Deployment

- The app is ready for static hosting (e.g., Vercel, Netlify).
- `vercel.json` is included for Vercel rewrites.

## License

Private

---

**HireHub Onboarding Portal** — For internal use only.