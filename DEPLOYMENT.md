# HireHub Onboarding Portal — Deployment Guide

This document describes how to deploy the HireHub Onboarding Portal for production, including static hosting, environment variables, Vercel configuration, and CI/CD notes.

---

## 1. Production Build

The app is a static React (Vite) site. To build for production:

```sh
npm run build
# or
yarn build
```

The output will be in the `dist/` folder.

---

## 2. Static Hosting

You can host the contents of the `dist/` folder on any static hosting provider, such as:

- **Vercel** (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

---

## 3. Vercel Deployment

### Steps

1. **Push your code to a Git repository** (GitHub, GitLab, Bitbucket).
2. **Import the repo into Vercel** ([vercel.com/import](https://vercel.com/import)).
3. **Configure the project:**
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Deploy.**

### Vercel Routing

The included `vercel.json` ensures client-side routing works:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This allows React Router to handle all routes.

---

## 4. Environment Variables

- All environment variables must be prefixed with `VITE_` to be accessible in the app.
- Create a `.env.production` file in the project root for production-only variables.
- Example:

  ```
  VITE_API_URL=https://your-api.example.com
  ```

- **Note:** The default app does not require any environment variables for basic operation.

---

## 5. CI/CD Notes

- **Vercel:** Automatically builds and deploys on every push to the main branch.
- **Other Providers:** You can use GitHub Actions or your provider’s CI/CD to run `npm run build` and deploy the `dist/` folder.
- **Testing:** (If enabled) Run tests before deploying:

  ```sh
  npm test
  ```

---

## 6. Custom Domain

- Set up a custom domain in your hosting provider’s dashboard.
- For Vercel, follow the [custom domain guide](https://vercel.com/docs/concepts/projects/custom-domains).

---

## 7. Notes

- **No backend required:** All data is stored in the browser (`localStorage`/`sessionStorage`).
- **Admin credentials:** See `README.md` for demo login.
- **Data persistence:** Clearing browser storage will remove all candidate data.

---

**Questions?**  
Contact the HireHub engineering team.