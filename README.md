# Tesla Energy Site Layout

A site layout tool for configuring Industrial Energy Battery sites. Users select battery quantities, view cost/energy/land summaries, and see an auto-generated 2D site layout.

**Live demo**: https://melywong.github.io/tesla-energy-site-layout-app/

## Features

- **Battery Selection** — Choose quantities for MegapackXL, Megapack2, Megapack, and PowerPack
- **Auto Transformers** — 1 transformer is auto-added for every 2 batteries (rounded up)
- **Site Summary** — Real-time total cost, energy output, transformer count, and land dimensions
- **2D Site Layout** — SVG visualization with row-packing algorithm (max 100ft width)
- **Session Persistence** — Shareable URL links (survive cache clears) + backend database storage for local dev
- **Responsive** — Sidebar + content layout adapts to screen size

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Mantine UI
- **Backend**: Python + FastAPI + SQLAlchemy + SQLite
- **Testing**: Vitest + React Testing Library (frontend), pytest (backend)
- **Deployment**: GitHub Pages via GitHub Actions

## Quick Start

Run both frontend and backend with one command:

```bash
bash start.sh
```

- Frontend: http://localhost:8000
- Backend API: http://localhost:8001

### Manual Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8001 --reload
```

## Running Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
pytest
```

## Device Specifications

| Device | Dimensions | Energy | Cost |
|---|---|---|---|
| MegapackXL | 40ft x 10ft | 4 MWh | $120,000 |
| Megapack2 | 30ft x 10ft | 3 MWh | $80,000 |
| Megapack | 30ft x 10ft | 2 MWh | $50,000 |
| PowerPack | 10ft x 10ft | 1 MWh | $10,000 |
| Transformer | 10ft x 10ft | -0.5 MWh | $10,000 |

## Session Persistence

- **Local dev**: Sessions are saved to the backend SQLite database via the API
- **GitHub Pages**: Click "Copy Shareable Link" to encode your configuration into the URL. Bookmark or share the link to restore the layout later. This survives cache clears since the state is in the URL itself.

## Project Structure

```
frontend/          React + TypeScript + Vite
  src/
    components/    DeviceSelector, SiteSummary, SiteLayout, SessionManager
    utils/         calculations, layoutEngine, api client
    data/          device catalog
    __tests__/     unit + component tests

backend/           Python + FastAPI
  main.py          API routes + CORS
  models.py        SQLAlchemy models
  database.py      DB setup
  test_main.py     API tests
```
