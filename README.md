# PUPIL — Program Uplift & Posture Improvement Ledger

Track and measure your cybersecurity program's maturity over time. PUPIL gives you a simple web interface to score your organization against the NIST Cybersecurity Framework 2.0 — all 106 subcategories — and see exactly where you are, where you want to be, and how you're trending.

No spreadsheets. No consultants required. Just open a browser, score your controls, and get a clear picture of your security posture.

**What it does:**
- Score your program across 6 security functions (Govern, Identify, Protect, Detect, Respond, Recover) on a 1–5 maturity scale
- Set target scores and visualize the gap between current and desired state
- Track improvement over multiple assessments to show progress to leadership
- Generate printable reports and CSV exports for board presentations or audits
- Share assessment URLs with your team for collaborative scoring
- Keep a full audit log of every score change — immutable history

---

## Table of Contents

1. [What you need before starting](#1-what-you-need-before-starting)
2. [Setup: Docker (recommended)](#2-setup-docker-recommended)
3. [Setup: Local development](#3-setup-local-development)
4. [Running your first assessment](#4-running-your-first-assessment)
5. [Understanding maturity scores](#5-understanding-maturity-scores)
6. [Exporting and sharing results](#6-exporting-and-sharing-results)
7. [Troubleshooting](#7-troubleshooting)
8. [For developers](#8-for-developers)

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
2. Give it a name (e.g. "Q2 2026 Baseline") and a date
3. Click **Create**

### Scoring subcategories

PUPIL loads all 106 NIST CSF 2.0 subcategories organized by Function and Category. For each one:

1. Read the subcategory description
2. Click the maturity tooltip (the **?** icon) to see what each score level means for that specific control
3. Select a score from **1** (ad-hoc, no formal process) to **5** (optimized, continuously improving)
4. Optionally add a note explaining your score
5. Move to the next subcategory

You don't have to score everything in one session — PUPIL saves automatically as you go.

### Setting targets

After scoring your current state, click **Set Targets** to define where you want to be. This creates the gap analysis view showing which categories need the most work.

---

## 5. Understanding maturity scores

PUPIL uses the CMMI (Capability Maturity Model Integration) 1–5 scale:

| Score | Level | What it means |
|---|---|---|
| **1** | Initial | Ad-hoc or nonexistent. Outcomes are unpredictable. |
| **2** | Managed | Basic processes exist but aren't consistently followed. |
| **3** | Defined | Documented, standardized processes followed across the organization. |
| **4** | Quantitatively Managed | Processes measured and controlled using metrics. |
| **5** | Optimizing | Continuous improvement based on performance data. |

Most organizations doing a first assessment land between 1 and 3. A score of 3 across the board is a solid, defensible security posture for most mid-size companies.

**The hover tooltips (the ? icons) are your best friend** — PUPIL includes 530 control-specific descriptors that tell you exactly what a 2 versus a 3 looks like for *that specific subcategory*, not just a generic definition.

---

## 6. Exporting and sharing results

**Print or save as PDF:**
Click **Print Report** from any assessment view. This generates a clean, formatted report suitable for board presentations or audit documentation.

**Export to CSV:**
Click **Export CSV** to download all scores as a spreadsheet. Useful for importing into other tools or creating your own charts.

**Shareable URL:**
Each assessment has a unique URL you can share with teammates so they can view or contribute scores.

---

## 7. Troubleshooting

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

PUPIL saves automatically — you should see a brief "Saved" indicator after each change. If you're not seeing that, check that the container is running and try refreshing the page.

---

## 8. For developers

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
app/          — Next.js App Router pages and API routes
components/   — React components
lib/          — Database access and scoring logic
data/         — SQLite database (created on first run)
```

### Running linting
```bash
npm run lint
```

---

## License

Apache 2.0 with Commons Clause. Free to use and modify for internal purposes; selling as a product requires permission. See [LICENSE](LICENSE) for full terms.
