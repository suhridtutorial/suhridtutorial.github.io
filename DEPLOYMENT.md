# Deployment Guide

## Prerequisites
- Supabase account
- GitHub account

## A. Supabase
1. New project → wait for provisioning.
2. SQL Editor → paste `sql/schema.sql` → Run.
3. Authentication → Providers → **Email**: enable, disable "Confirm email".
4. Authentication → Users → Add user `admin@suhrid.local` (Auto Confirm ON).
5. Settings → API → copy `Project URL` and `anon public key`.

## B. App configuration
Edit `js/config.js` with the values from step A.5. Do NOT commit the service-role key — only the anon public key is safe in the browser.

## C. GitHub Pages
1. `git init && git add . && git commit -m "init"`.
2. Create a GitHub repo and push.
3. Repo → Settings → Pages → Source = `main`, folder = `/`.
4. Wait 1–2 min, then open the published URL.

## D. PWA install
- Chrome/Edge desktop: install icon appears in address bar after first visit; or use the **Install App** button in the sidebar.
- iOS Safari: Share → Add to Home Screen.

## E. Custom domain (optional)
Repo → Settings → Pages → Custom domain. Add a `CNAME` DNS record pointing to `<user>.github.io`.

## F. Troubleshooting
| Symptom | Fix |
|---|---|
| 401 / "Invalid API key" | Check `js/config.js` values. |
| Login fails | Confirm user exists & is "Confirmed" in Supabase Auth. |
| "permission denied for table" | Re-run the GRANT lines from `sql/schema.sql`. |
| Old UI after update | Bump `CACHE` in `service-worker.js`, hard-reload (Ctrl+Shift+R). |
| Service worker not registered | Must be served over HTTPS (GitHub Pages OK; `file://` not OK). |
| CORS error on Supabase calls | Add your Pages URL in Supabase → Auth → URL Configuration → Site URL & Redirect URLs. |
