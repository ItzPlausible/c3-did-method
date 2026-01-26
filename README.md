# Plausible Potentials Consulting (PPC)

**Master Repository for all PPC projects and assets**

Managing Director: JW Barbre  
Entity: Plausible Potentials Consulting DAO LLC  
Location: Houston, Texas

---

## Directory Structure

```
D:\PPC\
├── _config/          # Global configs, env templates, shared settings
├── _docs/            # Master documentation
│   ├── legal/        # Articles, bylaws, agreements
│   ├── whitepapers/  # Technical & economic papers
│   └── brand/        # Logos, crest, style guides
│
├── c3-alliance/      # C3 Alliance main site + infrastructure
├── c3dex/            # Decentralized exchange project
├── cocoa/            # Claude Cooperative Assistant (CoCoA)
├── corp2coop/        # Exit-to-Cooperative platform
├── cyber-mutualism/  # Cyber-mutualism educational site
├── jwb/              # Personal JWB site
│
├── _archive/         # Deprecated projects, old versions
└── _sandbox/         # Experiments, testing
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Project folders | lowercase-hyphenated | `c3-alliance` |
| Meta folders | underscore prefix | `_docs`, `_config` |
| Config files | lowercase, dot notation | `wrangler.toml`, `.env.example` |
| Documentation | UPPERCASE or Title Case | `README.md`, `CHANGELOG.md` |

---

## Cloudflare Resource Mapping

| Project | Worker | D1 Database | R2 Bucket | KV Namespace |
|---------|--------|-------------|-----------|--------------|
| c3-alliance | `c3-alliance` | - | `c3-alliance-documents` | - |
| c3dex | `c3dex` | - | - | `__c3dex-workers_sites_assets` |
| cocoa | `cocoa-mvp` | `cocoa-mvp-db` | - | `cocoa-mvp-COCOA_SESSIONS` |
| corp2coop | `corp2coop`, `corp2coop-api` | `corp2coop-leads` | `corp2coop-pdfs` | - |
| cyber-mutualism | `cyber-mutualism` | - | - | - |
| jwb | `jwb` | - | - | - |

---

## Blockfrost API (Cardano)

- **Mainnet:** `mainnetyMcURINjP40kV05A2I5DaxiQKzpHId3Y`
- **PreProd:** `preprodCU0fTLOVeFEfmoa95ESuVTAmHfmvLakS`

---

## Quick Commands

```bash
# Deploy any project
cd D:\PPC\[project-name]
npx wrangler deploy

# Run local dev
npx wrangler dev
```

---

*Last updated: 2026-01-26*
