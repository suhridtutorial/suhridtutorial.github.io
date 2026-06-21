# Suhrid Tutorial — Tuition Management (PWA)

Vanilla HTML/CSS/JS Progressive Web App. Backend: Supabase. Hosted on GitHub Pages.

## Features
- Login (single admin)
- Dashboard with KPIs + charts
- Students CRUD with filters, pagination, Excel/PDF export
- Fee Collection with **advance payment auto-allocation**
- Fee Revision history (no overwrite of historical fees)
- Per-student Month-wise Ledger & Profile (PDF/Print)
- History, Reports (Daily/Monthly/Yearly/Student/Class/Board/Outstanding/Inactive/Left)
- Dark/Light theme (persists)
- Installable PWA + offline app shell

## 1. Supabase setup
1. Create a project on supabase.com.
2. SQL editor → paste & run `sql/schema.sql`.
3. Authentication → Users → **Add user**:
   - Email: `admin@suhrid.local`
   - Password: *(your choice)*
   - **Auto-confirm user: ON**
4. Project settings → API → copy **Project URL** and **anon public key**.

## 2. Configure the app
Edit `js/config.js`:
```js
window.SUPABASE_URL  = "https://YOUR-PROJECT.supabase.co";
window.SUPABASE_ANON = "YOUR-ANON-PUBLIC-KEY";
```

## 3. Deploy on GitHub Pages
1. Create a repo, e.g. `suhrid-tutorial`.
2. Push all files (or upload the ZIP contents) to the `main` branch.
3. Repo → **Settings → Pages** → Source: `main` / `/ (root)` → Save.
4. Open `https://<user>.github.io/suhrid-tutorial/`.
5. Log in with **User ID:** `admin` and the password you set in step 1.3.

> Service worker requires HTTPS — GitHub Pages provides this automatically.

## 4. Login
- User ID box accepts plain `admin` — the app appends `@suhrid.local` before calling Supabase Auth.
- You can also create more admins (any email) and log in with the full email.

## 5. Folder structure
```
/                 index.html, app.html, manifest.json, service-worker.js
/css              styles.css
/js               config.js, common.js, supabase.js, fees-lib.js
/pages            dashboard, students, fee_collection, history, reports,
                  student_profile, settings  (each is a separate HTML page)
/icons            app icons
/sql              schema.sql
/docs             ADD_NEW_MODULE.md, DEPLOYMENT.md
```

See `docs/ADD_NEW_MODULE.md` for how to add a new module/page/report.
