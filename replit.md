# InversionesFácilessss

A Spanish financial education website — **inversionesfacil.es** — that teaches people how to invest simply and accessibly.

## Architecture

- **Frontend**: React + Vite (port 5000)
- **Backend**: Express.js API server (port 3001)
- **Database**: Replit PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6

## Pages

- `/` — Home page with hero, stats, features
- `/por-que-invertir` — Why you should invest
- `/aprende` — Learn: FAQ-style accordion with financial concepts
- `/empieza` — Get started: Platform comparison (MyInvestor & Trade Republic)
- `/foro` — Community forum: create posts, reply, like

## Key Files

- `src/App.jsx` — App root, routing
- `src/pages/` — All page components
- `src/components/layout/` — Navbar, Footer, PageLayout
- `src/components/MarketCharts.jsx` — Live market chart widget (Yahoo Finance via allorigins proxy)
- `src/api/forumClient.js` — Forum API client (calls `/api/forum/*`)
- `server/index.js` — Express API server for forum CRUD

## Database Schema

- `forum_posts` — id, title, content, category, author_name, is_anonymous, likes, created_date
- `forum_replies` — id, post_id (FK), content, author_name, is_anonymous, created_date

## Running

```bash
npm run dev   # Starts both the API server (port 3001) and Vite dev server (port 5000)
```

## Notes

- Migrated from Base44 to Replit. All Base44 SDK dependencies removed.
- The forum is the only feature backed by a real database; all other pages are static content.
- Market charts use Yahoo Finance via the `allorigins.win` CORS proxy.
