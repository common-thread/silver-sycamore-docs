# Silver Sycamore Document Library

Operational documentation for Silver Sycamore Venue and Pine Street Cafe.

---

## Quick Start

**[INITIATIVES.md](INITIATIVES.md)** - Current priorities and action items

**[INDEX.md](INDEX.md)** - Complete document catalog (68 documents)

---

## Repository Structure

```
silver-sycamore-docs/
├── INITIATIVES.md               # Priority initiatives (start here)
├── INDEX.md                     # Complete document catalog
│
├── services/                    # What we provide
│   ├── wedding-packages/        # 5 wedding package options
│   ├── event-packages/          # Reception hall, parties, corporate
│   ├── catering/                # Full menu + off-premise
│   └── add-ons/                 # Upgrades, enhancements
│
├── clients/                     # Client-facing materials
│   ├── booking/                 # Booking forms, contracts
│   ├── planning/                # Checklists, planning sheets
│   ├── day-of/                  # Timelines, processionals, music
│   └── layouts/                 # Room configurations by venue
│       ├── hall/
│       ├── saloon/
│       ├── town/
│       ├── tea-room/
│       └── open-house/
│
├── staff/                       # Employee materials
│   ├── training/                # Onboarding, sales scripts
│   ├── procedures/              # Service protocols, closing
│   └── hr/                      # Time-off, warnings
│
├── operations/                  # Running the business
│   ├── forms/                   # Appointment forms
│   ├── bar/                     # Alcohol tracking
│   ├── catering/                # Sign-up sheets
│   └── facilities/              # Maintenance, venue layout
│
├── deliverables/                # Projects we're building
│   └── recipe-app/              # Pine Street Cafe Recipe App
│
└── archive/                     # Superseded versions
```

---

## Key Resources

### Services
| Category | Documents |
|----------|-----------|
| [Wedding Packages](services/wedding-packages/) | 5 package options |
| [Event Packages](services/event-packages/) | Reception hall, parties |
| [Catering](services/catering/) | Wedding and off-premise menus |
| [Add-Ons](services/add-ons/) | Upgrades and extras |

### Clients
| Category | Documents |
|----------|-----------|
| [Booking Forms](clients/booking/) | Wedding, corporate, party booking |
| [Planning](clients/planning/) | Checklists, planning sheets |
| [Day-Of](clients/day-of/) | Timelines, processionals |
| [Room Layouts](clients/layouts/) | Hall, Saloon, Town, Tea Room |

### Staff
| Category | Documents |
|----------|-----------|
| [Training](staff/training/) | Programs, scripts, schedules |
| [Procedures](staff/procedures/) | Service protocols, closing |
| [HR](staff/hr/) | Forms for time-off, warnings |

### Operations
| Category | Documents |
|----------|-----------|
| [Forms](operations/forms/) | Appointment forms |
| [Bar](operations/bar/) | Inventory, event lists |
| [Facilities](operations/facilities/) | Maintenance, venue layout |

### Deliverables
| Project | Status |
|---------|--------|
| [Recipe App](deliverables/recipe-app/) | Live at [pine-street-cafe-recipes.vercel.app](https://pine-street-cafe-recipes.vercel.app) |

---

## Development

This repo contains **two systems**:

| System | Purpose | Location | Deployment |
|--------|---------|----------|------------|
| **Jekyll** | Static docs site | Root (`/`) | GitHub Pages |
| **Next.js** | Dynamic app with Convex | `app/` | Vercel |

### Repo Structure

```
silver-sycamore-docs/
├── _config.yml, _layouts/, Gemfile    # Jekyll (GitHub Pages)
├── docs/                               # Shared markdown content
├── app/                                # Next.js application
│   ├── src/                           # React components & pages
│   ├── convex/                        # Backend (database, queries)
│   ├── e2e/                           # Playwright tests
│   └── package.json                   # Dependencies
└── .github/workflows/pages.yml        # Deploys Jekyll to GitHub Pages
```

### Commands

```bash
# Next.js development (from app/)
cd app
bun install          # Install dependencies
bun dev              # Run dev server (localhost:3001)
bun run build        # Production build
bun run import-docs  # Import docs/ into Convex database

# Jekyll (from root)
bundle install       # Install Ruby dependencies
bundle exec jekyll serve  # Local preview (localhost:4000)
```

### Deployments

- **GitHub Pages** (Jekyll): Auto-deploys on push to `main` via GitHub Actions
- **Vercel** (Next.js): Configured with `app/` as root directory

### Environment Variables

For Next.js development, create `app/.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://calculating-vole-961.convex.cloud
```

---

## About

Documentation captured during January 2026 consulting engagement.

**Not included here:**
- Vendor credentials (stored in Convex database)
- Recipe database (278 recipes in Recipe App)

---

**Last Updated:** January 14, 2026
