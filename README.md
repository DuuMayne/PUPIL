# PUPIL

**Program Uplift & Posture Improvement Ledger** — an information security maturity measurement and tracking application.

PUPIL is a lightweight, self-hosted web app for running, tracking, and reporting on cybersecurity program maturity assessments. It ships with the **NIST CSF 2.0** framework (6 Functions, 22 Categories, 106 Subcategories) and uses the **CMMI 1–5** maturity scale to score each control.

---

## Why this exists

Most maturity tracking lives in a security analyst's head, a stale spreadsheet, or a $50k GRC tool that nobody enjoys using. PUPIL aims for the middle ground:

- **Measure** current maturity at the subcategory level with control-specific guidance for each CMMI level.
- **Plan** by setting target maturity levels for each control.
- **Visualise** the gap between current and target state.
- **Track** improvement across multiple assessments over time.
- **Share** the results — printable reports, CSV export, and direct shareable URLs.

The data model is framework-agnostic. NIST CSF 2.0 ships in the seed; SOC 2 / ISO 27001 / others can be added by inserting their taxonomy into the `controls` table.

---

## Features

- **Assessments** — create draft assessments, score each subcategory (1–5 plus 0.5 half-steps), capture a rationale per control, then publish. Published assessments can be unlocked for editing or deleted.
- **CMMI tooltips** — every full-level button has a rich tooltip showing the CMMI label, the generic level description, and a control-specific descriptor describing what systems / processes / procedures are expected at that level for that subcategory (530 descriptors total: 106 controls × 5 levels).
- **Targets** — set a target maturity per subcategory; per-function quick-set buttons make filling in baseline targets fast.
- **Gap Analysis** — function / category / subcategory bars showing current vs. target vs. delta.
- **Trends** — line chart of average maturity per CSF function across all published assessments.
- **Reports** — printable per-assessment report at `/assessments/<id>/report`, with executive summary, function-level table, full detail, Copy-Link button, Print/Save-PDF, and CSV export.
- **Audit log** — every create / update / delete is recorded in an `audit_log` table inside the same SQLite transaction as the change. Structured JSON logs are also emitted to stdout for CloudWatch / Loki / etc.
- **Single binary feel** — Next.js standalone output + SQLite. One container, one volume.

---

## Architecture at a glance

| Layer | Tech |
| --- | --- |
| UI | Next.js 16 App Router (React 19), Tailwind CSS 4 |
| Charts | Recharts |
| API | Next.js Route Handlers |
| Storage | SQLite via `better-sqlite3` (WAL mode, foreign keys on) |
| Logging | Structured JSON to stdout/stderr |
| Container | Multi-stage Node 20 Alpine, non-root, standalone output |

The schema lives in [`src/lib/db.ts`](src/lib/db.ts). The NIST CSF 2.0 seed is in [`src/lib/seed.ts`](src/lib/seed.ts). Control-level CMMI descriptors are in [`src/lib/descriptors.ts`](src/lib/descriptors.ts).

---

## Quick start (Docker)

The fastest way to try it.

```bash
git clone https://github.com/DuuMayne/PUPIL.git
cd PUPIL
docker compose up -d --build
```

Then open <http://localhost:3001>.

The DB is persisted in the `pupil-data` named volume mounted at `/app/data` inside the container. Drop the volume to reset:

```bash
docker compose down -v
```

> **Note** — the compose file maps to host port `3001` (port `3000` is reserved for a sibling project on the author's setup). If you want it on `3000`, edit the `ports:` line in `docker-compose.yml`.

### Running with `docker run` directly

```bash
docker build -t pupil .
docker run -d \
  --name pupil \
  -p 3000:3000 \
  -v pupil-data:/app/data \
  -e DB_PATH=/app/data/pupil.db \
  pupil
```

---

## Local development

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The dev server hot-reloads on save. The SQLite DB is created at `./data/pupil.db` on first request and seeded with the NIST CSF 2.0 taxonomy.

### Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Run Next.js dev server (Turbopack) |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

---

## Configuration

PUPIL is configured entirely through environment variables. There are no required secrets out of the box.

| Variable | Default | Purpose |
| --- | --- | --- |
| `DB_PATH` | `./data/pupil.db` (dev) / `/app/data/pupil.db` (container) | Absolute path to the SQLite file. Point at a mounted volume for persistence. |
| `PORT` | `3000` | Port the Next.js server binds to. |
| `HOSTNAME` | `0.0.0.0` | Bind host. |
| `NODE_ENV` | `production` (in container) | Standard. |
| `NEXT_TELEMETRY_DISABLED` | `1` (in container) | Opts out of Next telemetry. |

For deployments where the DB lives on shared storage (EFS, NFS), make sure `DB_PATH` points at that mount.

---

## Using PUPIL

1. **Create an assessment.** From `/assessments`, click *New Assessment*. Give it a title, optional date, optional assessor, and optional description.
2. **Score it.** You land on the scoring page, grouped by CSF Function in the left sidebar. For each subcategory, hover any of the 1–5 buttons to see what that level looks like for that specific control. Click to set the score; click again to clear. Use the smaller half-step buttons (1.5 / 2.5 / 3.5 / 4.5) when you're between levels. Add an optional rationale per control.
3. **Save / Publish.** *Save Draft* persists progress without changing status. *Publish* marks the assessment as the source-of-truth current state. Published assessments are read-only by default — use *Edit (unpublish)* if you need to amend.
4. **Set targets.** From `/targets`, walk each function and define the target maturity for each subcategory. Use the per-function "Quick set all to N" row to fill in a baseline you can then refine.
5. **See the gap.** `/gap` shows current (latest published assessment) vs. target at every level of the hierarchy.
6. **Track trends.** `/trends` plots per-function average maturity across every published assessment over time.
7. **Share or export.** Each assessment has a printable report at `/assessments/<id>/report` with three actions:
   - **Copy Link** — direct URL for sharing internally.
   - **Export CSV** — full subcategory-level dump (`/api/assessments/<id>/export?format=csv`).
   - **Print / Save PDF** — uses the browser's print dialog. The action bar is hidden in print.

   JSON export is also available at `/api/assessments/<id>/export?format=json`.

---

## API reference (high level)

All endpoints accept and return JSON unless noted.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/assessments` | `GET`, `POST` | List assessments; create a new one. `?include_counts=1` joins scored counts. |
| `/api/assessments/[id]` | `GET`, `PUT`, `DELETE` | Read, update (incl. status), delete an assessment. |
| `/api/assessments/[id]/scores` | `GET`, `PUT`, `POST` | Read all scores; upsert one (`PUT`) or many (`POST`). |
| `/api/assessments/[id]/export` | `GET` | `?format=csv` (default) or `?format=json`. |
| `/api/controls` | `GET` | List controls; filter by `?level=`, `?parent_id=`, `?framework_id=`. |
| `/api/targets` | `GET`, `PUT`, `POST` | Read targets; upsert one or many. |
| `/api/notes` | `GET`, `POST` | Free-form notes attached to any entity. |
| `/api/inputs` | `GET`, `POST` | Stakeholder input/evidence per control. |

---

## Data model

```
frameworks ─┬─ controls (function | category | subcategory, self-referential parent_id)
            │
            ├─ assessments ─── assessment_scores (one row per scored control)
            │
            └─ targets (one target_score per control)

stakeholder_inputs   notes   audit_log     (cross-cutting)
```

- `score` and `target_score` are stored as `REAL` so half-steps round-trip cleanly.
- `assessment_scores` cascades on `assessments` delete.
- Every API write inserts an `audit_log` row inside the same transaction as the change, so you can never end up with an unaudited mutation.

---

## Production notes

- **Persistence.** The container expects a writable volume at whatever path `DB_PATH` points to. SQLite WAL mode means three files (`*.db`, `*.db-wal`, `*.db-shm`) — keep them on the same volume.
- **Backups.** The single SQLite file makes backup trivial: stop traffic, `cp` the file (or use `sqlite3 .backup`), restart.
- **Logging.** All API mutations emit a single-line JSON log to stdout/stderr, which CloudWatch, Loki, Vector, or Fluent Bit will pick up natively.
- **Authentication.** PUPIL has no built-in auth. Run it behind your reverse proxy / SSO (Cloudflare Access, oauth2-proxy, ALB + Cognito, Tailscale, etc.). It is designed for trusted internal networks.
- **Concurrency.** SQLite is fine for the kinds of write rates a maturity-tracking app generates (one assessor at a time, batches of upserts). If you ever outgrow it, the schema ports cleanly to Postgres.

A sample ECS task definition with EFS persistence is included at [`deploy/ecs-task-definition.example.json`](deploy/ecs-task-definition.example.json) (this lineage is from a sister project, but the volume / env-var pattern applies).

---

## Roadmap

- Additional frameworks (SOC 2, ISO 27001) seeded alongside CSF 2.0.
- Per-control evidence attachments (file uploads).
- Diff view between two assessments.
- Weighted targets and risk-based prioritisation.
- Optional auth provider integrations.

PRs welcome.

---

## License

MIT — see `LICENSE` (add one before shipping public if not already present).
