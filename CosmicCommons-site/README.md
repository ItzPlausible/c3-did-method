# Cosmic Commons Investor Portal

**C3 Alliance** | Plausible Potentials Consulting DAO LLC

$3.6B Exit-to-Cooperative investment ecosystem across six Pinnacle Peaks.

## Architecture

```
cosmiccommons-portal/
├── public/                    # Static assets (served by Cloudflare Pages)
│   ├── index.html            # Main investor portal homepage
│   └── peaks/                # Individual Peak landing pages
│       ├── shared/
│       │   └── pinnacle-peaks.css
│       ├── fulmina.html      # Energy Infrastructure
│       ├── horizonta.html    # Autonomous Mobility
│       ├── rikolta.html      # Agriculture & Food
│       ├── fajruja.html      # Construction & Housing
│       ├── vekiga.html       # Longevity Science
│       └── kerna.html        # Privacy & Sovereign Compute
├── functions/                 # Cloudflare Pages Functions (serverless API)
│   └── api/
│       ├── inquiry.js        # POST - Submit investor inquiry
│       └── inquiries.js      # GET/PATCH - Admin inquiry management
├── wrangler.toml             # Cloudflare configuration
└── package.json
```

## Cloudflare Services

| Service | Purpose | Binding |
|---------|---------|---------|
| **Pages** | Static hosting + Functions | - |
| **D1** | Investor inquiries database | `DB` |
| **R2** | Document storage | `DOCUMENTS` |

## Database Schema

```sql
CREATE TABLE investor_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  peak TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  accredited_status TEXT,
  investment_range TEXT,
  message TEXT,
  referral_source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new',
  notes TEXT
);
```

## API Endpoints

### `POST /api/inquiry`
Submit investor inquiry form.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@family-office.com",
  "peak": "kerna",
  "organization": "Doe Family Office",
  "accredited_status": "qualified_purchaser",
  "investment_range": "5m-25m",
  "message": "Interested in privacy infrastructure...",
  "referral_source": "Conference"
}
```

### `GET /api/inquiries`
List all inquiries (admin).

**Query Parameters:**
- `status` - Filter by status (new, contacted, qualified, etc.)
- `peak` - Filter by peak
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset

### `PATCH /api/inquiries`
Update inquiry status (admin).

```json
{
  "id": 1,
  "status": "contacted",
  "notes": "Initial call scheduled for Monday"
}
```

## Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Deploy to Cloudflare Pages
npm run deploy

# List recent inquiries
npm run db:list
```

## Deployment

### GitHub Integration

1. Push to GitHub repository
2. Connect repo to Cloudflare Pages
3. Set build command: (none - static files)
4. Set output directory: `public`
5. Add D1 binding in Pages settings

### Manual Deploy

```bash
wrangler pages deploy public
```

## Environment

- **D1 Database ID:** `d1d0dae3-cdea-4019-84cd-40a7ecc435ee`
- **R2 Bucket:** `cosmiccommons-investor-portal`
- **Account ID:** `d90dcd7b745fd3d5fe182073b3f2ad54`

## The Six Pinnacle Peaks

| Peak | Focus | Allocation |
|------|-------|------------|
| **Fulmina** | Energy Infrastructure | $600MM |
| **Horizonta** | Autonomous Mobility | $600MM |
| **Rikolta** | Agriculture & Food | $600MM |
| **Fajruja** | Construction & Housing | $600MM |
| **Vekiĝa** | Longevity Science | $600MM |
| **Kerna** | Privacy & Sovereign Compute | $600MM |

## Design System

### Brand Colors (Barbre Family Crest)
- Crimson: `#DC143C`
- Royal Blue: `#4169E1`
- Purple: `#800080`
- Gold: `#FFD700`

### Typography
- Display: Cormorant Garamond
- Body: Outfit
- Mono: Space Mono

---

*Cosmic Commons Communities Alliance*  
*"Sovereign Stewardship as a Service"*
