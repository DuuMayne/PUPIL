# PUPIL — Program Uplift & Posture Improvement Ledger

Track and measure your cybersecurity program's maturity over time. PUPIL gives you a simple web interface to score your organization against the NIST Cybersecurity Framework 2.0 — all 106 subcategories — and the CIS Critical Security Controls v8.1 — all 153 safeguards — and see exactly where you are, where you want to be, and how you're trending, in either framework or both at once.

No spreadsheets. No consultants required. Just open a browser, score your controls, and get a clear picture of your security posture.

**What it does:**
- Score your program against NIST CSF 2.0 (106 subcategories across 6 functions) or CIS Controls v8.1 (153 safeguards across 18 controls) — same tool, either framework
- For CIS, pick a target Implementation Group (IG1, IG2, or IG3) and have target scores populate automatically across every in-scope safeguard — fine-tune any individual one afterward
- Get an auto-generated Strategic Roadmap: a radar chart of current vs. target maturity plus a prioritized, plain-English action list, written directly from your scores — no manual write-up required
- See where NIST and CIS overlap using CIS's own official crosswalk to NIST CSF 2.0 — related requirements are linked automatically wherever one exists
- Set target scores and visualize the gap between current and desired state
- Track improvement over multiple assessments, and generate printable reports or CSV exports for board presentations or audits
- Keep a full audit log of every score change — immutable history

---

## Table of Contents

1. [What you need before starting](#1-what-you-need-before-starting)
2. [Setup: Docker (recommended)](#2-setup-docker-recommended)
3. [Setup: Local development](#3-setup-local-development)
4. [Running your first assessment](#4-running-your-first-assessment)
5. [Setting targets](#5-setting-targets)
6. [Understanding maturity scores](#6-understanding-maturity-scores)
7. [The Strategic Roadmap](#7-the-strategic-roadmap)
8. [Exporting and sharing results](#8-exporting-and-sharing-results)
9. [Troubleshooting](#9-troubleshooting)
10. [For developers](#10-for-developers)

---

## 1. What you need before starting

**For Docker setup (recommended):**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

**For local development:**
- Node.js 18 or later — check with `node --version`
- npm (comes with Node.js)

No API keys, no external accounts, no configuration files. PUPIL is completely self-contained.

---

## 2. Setup: Docker (recommended)

Docker packages everything into a container so you don't need to install Node.js or manage any dependencies.

### Step 1 — Install Docker Desktop

Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/). Once installed, open it and confirm the whale icon appears in your menu bar (macOS) or system tray (Windows).

### Step 2 — Clone or download PUPIL

If you have Git:
```bash
git clone https://github.com/DuuMayne/PUPIL.git
cd PUPIL
```

Or download the ZIP from GitHub and unzip it, then open a terminal in that folder.

### Step 3 — Start PUPIL

```bash
docker compose up -d --build
```

- **`--build`** — builds the image on first run (takes 2–3 minutes)
- **`-d`** — runs in the background

### Step 4 — Open PUPIL

Go to **[http://localhost:3001](http://localhost:3001)** in any browser.

That's it. Your assessment data is stored in a Docker volume and persists between restarts.

**To stop PUPIL:**
```bash
docker compose down
```

**To start it again later (fast, no rebuild needed):**
```bash
docker compose up -d
```

**To update to the latest version:**
```bash
git pull
docker compose up -d --build
```

---

## 3. Setup: Local development

Use this if you want to modify the code or run PUPIL without Docker.

### Step 1 — Install Node.js

Download the LTS version from [nodejs.org](https://nodejs.org). Run `node --version` after installation to confirm it worked.

### Step 2 — Install dependencies

```bash
cd PUPIL
npm install
```

### Step 3 — Start the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

The development server auto-reloads when you make code changes.

**To build and run a production version locally:**
```bash
npm run build
npm start
```

---

## 4. Running your first assessment

When you open PUPIL for the first time, you'll land on the dashboard with an empty assessment.

### Creating a new assessment

1. Click **New Assessment** in the top right
2. Choose a framework — **NIST CSF 2.0** or **CIS Controls v8.1**
3. Give it a name (e.g. "Q2 2026 Baseline") and a date
4. Click **Create & Start Scoring**

> **Which framework should I use?** NIST CSF 2.0 is outcomes-based (six functions, 106 subcategories) and works well for board-level risk conversations and maturity storytelling over time. CIS Controls v8.1 is a prioritized, checklist-style set of 153 technical safeguards, and works well for "what do we actually need to implement" conversations — especially if you're targeting a specific Implementation Group (IG1/2/3) for a cyber insurance requirement or client questionnaire. You don't have to pick one: PUPIL's [Strategic Roadmap](#7-the-strategic-roadmap) shows a combined view across both.

### Scoring your controls

PUPIL loads every subcategory (NIST) or safeguard (CIS) for the framework you chose, organized by Function and Category (NIST) or by Control (CIS). For each one:

1. Read the description
2. Click the maturity tooltip (the **?** icon) to see what each score level means
3. Select a score from **1** (ad-hoc, no formal process) to **5** (optimized, continuously improving)
4. Optionally add a note explaining your score
5. Move to the next item

You don't have to score everything in one session — click **Save Draft** any time, and **Publish** when the assessment is ready to count toward your dashboard and reports.

> For CIS safeguards, the tooltip shows the general maturity scale rather than a control-specific description — CIS defines safeguards as implemented or not, not a five-stage maturity ladder the way NIST does. Treat the score as "how fully and consistently is this safeguard implemented."

---

## 5. Setting targets

### NIST CSF 2.0

Go to **Targets** in the navigation and set a desired score for each subcategory individually, or use **Quick set all** to apply one score across an entire function. This feeds the NIST Gap Analysis and Roadmap views.

### CIS Controls v8.1

Go to **CIS Controls** in the navigation. Instead of setting each safeguard by hand, pick your **Target Implementation Group** — IG1, IG2, or IG3 — and PUPIL automatically sets a target for every safeguard at or below that group. Implementation Groups are cumulative: IG2 includes everything in IG1, and IG3 includes everything in IG1 and IG2.

You can still fine-tune any individual safeguard afterward — its target selector on the same page overrides whatever the Implementation Group set, without needing to re-run the bulk selection.

---

## 6. Understanding maturity scores

PUPIL uses the CMMI (Capability Maturity Model Integration) 1–5 scale for both frameworks:

| Score | Level | What it means |
|---|---|---|
| **1** | Initial | Ad-hoc or nonexistent. Outcomes are unpredictable. |
| **2** | Managed | Basic processes exist but aren't consistently followed. |
| **3** | Defined | Documented, standardized processes followed across the organization. |
| **4** | Quantitatively Managed | Processes measured and controlled using metrics. |
| **5** | Optimizing | Continuous improvement based on performance data. |

Most organizations doing a first assessment land between 1 and 3. A score of 3 across the board is a solid, defensible security posture for most mid-size companies.

**For NIST, the hover tooltips (the ? icons) are your best friend** — PUPIL includes 530 control-specific descriptors that tell you exactly what a 2 versus a 3 looks like for *that specific subcategory*, not just a generic definition. CIS safeguards don't have this per-level ladder (CIS itself doesn't define one), so target scores for CIS default to **3 (Defined)** — meaning "implemented as documented policy" — when an Implementation Group is selected.

---

## 7. The Strategic Roadmap

Go to **Roadmap** in the navigation for an executive-level view that turns your scores into a prioritized plan, generated automatically — no manual write-up required. It has three tabs:

- **NIST CSF 2.0** — a radar chart comparing current vs. target maturity across the six functions, plus your gaps grouped into **Urgent**, **High Priority**, and **Planned** by how far each subcategory is from its target. Each item includes a specific recommendation pulled from PUPIL's control-specific descriptors — what it actually takes to reach the next level.
- **CIS Controls v8.1** — the same idea without the radar (CIS is a checklist, not a maturity ladder): every in-scope safeguard below target, with the safeguard's own official CIS description of what "implemented" looks like.
- **Combined** — one radar and one priority list blending both frameworks by security function (Govern, Identify, Protect, Detect, Respond, Recover), so you can see your overall posture regardless of which framework you used to assess a given area.

Wherever CIS's own official crosswalk connects a NIST subcategory to a CIS safeguard, you'll see a **Related** note pointing to the corresponding item in the other framework — so a gap doesn't show up as two unrelated line items when it's really one piece of work.

---

## 8. Exporting and sharing results

**Print or save as PDF:**
Open any assessment's report and click **Print / Save PDF**. This generates a clean, formatted report suitable for board presentations or audit documentation — for either framework.

**Export to CSV:**
Click **Export CSV** on the report page to download all scores as a spreadsheet. Useful for importing into other tools or creating your own charts.

**Shareable URL:**
Click **Copy Link** on the report page to copy a URL you can share with anyone who has access to the same running instance.

---

## 9. Troubleshooting

### "This site can't be reached" at localhost:3001

The container isn't running. Check:
```bash
docker compose ps
```
If `pupil` isn't listed as `Up`, start it:
```bash
docker compose up -d
```

### Data disappeared after updating

Your data is stored in a Docker volume called `pupil-data`. Volumes persist through restarts and rebuilds — data only disappears if you explicitly run `docker compose down -v` (the `-v` flag removes volumes). For regular updates, just use `docker compose up -d --build`.

### "npm: command not found" for local setup

Node.js isn't installed. Download it from [nodejs.org](https://nodejs.org) and try again.

### Port 3001 is already in use

Another application is using port 3001. Either stop the other application or change PUPIL's port by editing `docker-compose.yml`: change `"3001:3000"` to `"3002:3000"` (or any free port) and restart.

### Scores aren't saving

PUPIL saves when you click **Save Draft** or **Publish** — if changes aren't appearing after a refresh, confirm the container is running and that you clicked one of those buttons before navigating away.

### Selecting an Implementation Group on the CIS page didn't seem to do anything

Give it a moment — selecting an IG triggers a bulk update across up to 153 safeguards. Check the **In Scope** count at the top of the CIS Controls page; it should match the count shown next to the IG you selected. If it hasn't changed, refresh the page.

---

## 10. For developers

### Tech stack
- **Next.js 16** (App Router, React 19)
- **SQLite** via better-sqlite3 (WAL mode for concurrent reads)
- **Tailwind CSS 4**
- **Recharts** for score visualizations

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `DB_PATH` | `./data/pupil.db` | SQLite database file path |
| `PORT` | `3000` | HTTP server port |

### Project structure
```
src/app/          — Next.js App Router pages and API routes
  cis/            — CIS Controls v8.1 browse, IG selection, and gap view
  roadmap/        — Strategic Roadmap (NIST / CIS / Combined tabs)
src/components/   — React components
src/lib/
  descriptors.ts  — NIST CSF 2.0 control-specific maturity descriptors
  cis-data.ts     — CIS Controls v8.1 dataset (Controls, Safeguards, NIST crosswalk), sourced from official CIS spreadsheets
  roadmap.ts      — Roadmap data: gap calculation, prioritization, and recommendation generation for both frameworks
data/             — SQLite database (created on first run)
```

### Multi-framework data model

Both frameworks live in the same `controls` table, distinguished by `framework_id`. NIST CSF 2.0 is a strict three-level tree (Function → Category → Subcategory). CIS Controls v8.1 is a two-level tree (Control → Safeguard) — CIS Controls don't nest under a single security function the way NIST categories do, so each Safeguard instead carries a `function_code` tag (its officially mapped NIST function) used for cross-framework rollups without forcing CIS into NIST's shape.

### Running linting
```bash
npm run lint
```

---

## License

| What | License |
|---|---|
| Source code | [Elastic License 2.0](LICENSE) |
| Documentation & templates | [CC BY-NC 4.0](LICENSE-docs) |

Free for anyone to use, fork, and build on — including commercially within your own organization. The one restriction: you cannot offer this software as a paid hosted or managed service. See [LICENSE](LICENSE) for full terms.

Copyright 2026 Adam Duman