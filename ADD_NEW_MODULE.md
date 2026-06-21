# Adding a New Module

The app is modular: every module is a separate HTML page loaded into the main iframe.

## 1. Create the HTML page
`pages/my_module.html` — use this template:

```html
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="../css/styles.css">
<script src="../js/config.js"></script>
<script src="../js/common.js"></script>
</head><body>
<div class="page">
  <h1 class="h1">My Module</h1>
  <div class="card"> ... </div>
</div>
<script type="module">
import { sb } from "../js/supabase.js";
const { data, error } = await sb.from("my_table").select("*");
if (error) toast(error.message,"err");
// render data ...
</script>
</body></html>
```

## 2. Add a sidebar item
In `app.html`, inside `<aside class="sidebar">`:
```html
<a class="navitem" data-page="pages/my_module.html"><span class="ic">🧩</span> My Module</a>
```
That's it — clicking it loads the page in the iframe.

## 3. Connect to Supabase
- Use `sb` exported from `js/supabase.js`.
- All RLS policies in `schema.sql` allow any authenticated user (single-admin model).

## 4. Add a new database table
Edit `sql/schema.sql` and run the new statements in Supabase SQL editor.
**Always** add these after `create table`:
```sql
grant select, insert, update, delete on public.my_table to authenticated;
alter table public.my_table enable row level security;
create policy "admin all my_table" on public.my_table
  for all to authenticated using (true) with check (true);
```

## 5. Add a report
Open `pages/reports.html`, add an `<option>` to the `#rep` select and add a case
in the `run` button handler that builds `head` + `body` arrays and calls `show(head, body, title)`.
Excel/PDF/Print are already wired.

## 6. Coding standards
- Vanilla ES modules. No build step.
- Use semantic tokens from `css/styles.css` — no inline colors.
- Use `toast(msg, "ok"|"err")` for user feedback.
- Use helpers: `fmtINR`, `monthName`, `todayISO`, `thisYM`.
- Keep one concern per file.

## 7. Naming conventions
- Files: `snake_case.html`, `kebab-case.css`, `camelCase` JS variables.
- Tables: `snake_case`, plural.
- Columns: `snake_case`.

## 8. Folder rules
- HTML pages live in `/pages` (except `index.html` and `app.html`).
- Shared JS modules in `/js`.
- All SQL in `/sql`.
- Static assets in `/icons` or `/assets`.

## 9. Cache busting after updates
Bump the `CACHE` version in `service-worker.js` (e.g. `suhrid-v2`) when you ship changes,
otherwise users will get the old cached files until the worker updates.

## 10. Deployment
Commit & push to `main`. GitHub Pages redeploys automatically (1–2 min).
