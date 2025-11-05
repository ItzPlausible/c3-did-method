---
name: github-mcp
description: Comprehensive GitHub management for blockchain development. Load for repo operations, version control, collaboration workflows, and smart contract versioning.
---

# GitHub MCP (Blockchain Dev Focus)

## ACTIVATE WHEN
- User mentions: "github", "git", "repo", "commit", "branch", "version control"
- Initializing new blockchain projects
- Managing C3 Alliance or client repositories
- Smart contract deployment versioning
- Documentation updates requiring version tracking
- Multi-developer collaboration workflows

## CORE OPERATIONS

### Repository Management
```bash
# Initialize new repo
git init
git add .
git commit -m "Initial commit: [project-name]"
git branch -M main
git remote add origin [url]
git push -u origin main

# Clone existing
git clone [url]
cd [repo-name]
```

### Daily Workflows
```bash
# Status check
git status
git log --oneline -10

# Commit pattern (Conventional Commits)
git add [files]
git commit -m "feat: description"  # new feature
git commit -m "fix: description"   # bug fix
git commit -m "docs: description"  # documentation
git commit -m "refactor: description"  # code restructure
git commit -m "test: description"  # testing

# Sync
git pull origin main
git push origin main
```

### Branch Management
```bash
# Create & switch
git checkout -b feature/[name]
git checkout -b fix/[issue-number]
git checkout -b docs/[update-type]

# List branches
git branch -a

# Merge
git checkout main
git merge feature/[name]
git branch -d feature/[name]  # delete after merge

# Push branch
git push origin feature/[name]
```

### Collaboration
```bash
# Pull Request workflow
1. Create feature branch
2. Make changes & commit
3. Push branch to origin
4. Open PR on GitHub
5. Review & merge
6. Delete feature branch

# Handle conflicts
git pull origin main
# Resolve conflicts in files
git add [resolved-files]
git commit -m "fix: merge conflict resolution"
git push
```

## BLOCKCHAIN-SPECIFIC PATTERNS

### Smart Contract Versioning
```
contracts/
├── v1.0.0/
│   └── SmartContract.sol
├── v1.1.0/
│   └── SmartContract.sol
└── current/
    └── SmartContract.sol (symlink)

Tag releases: git tag -a v1.0.0 -m "Initial mainnet deployment"
```

### Multi-Chain Project Structure
```
repo-name/
├── README.md
├── .gitignore
├── docs/
│   ├── architecture.md
│   └── deployment.md
├── contracts/
│   ├── cardano/
│   ├── cosmos/
│   └── ethereum/
├── tests/
└── deployments/
    └── mainnet/
```

### C3 Alliance Documentation Pattern
```
- One repo per major component
- Semantic versioning (MAJOR.MINOR.PATCH)
- Tag each deployment
- Branch protection on main
- Required PR reviews for production
```

## GITHUB DESKTOP INTEGRATION

### Common Tasks
1. **New Repo**: File → New Repository
2. **Clone**: File → Clone Repository → URL
3. **Commit**: Write summary → Description → Commit to main
4. **Push**: Push origin (button top-right)
5. **Pull**: Fetch origin → Pull origin
6. **Branch**: Current Branch dropdown → New Branch

### Visual Workflow
- Changes tab = staging area
- History tab = commit log
- Branch selector = current branch
- Sync button = pull + push

## .GITIGNORE TEMPLATE (Blockchain)

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Build outputs
dist/
build/
*.js (if TypeScript project)

# Environment
.env
.env.local
.env.*.local
secrets/
*.key
*.pem

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Blockchain specific
.openzeppelin/
artifacts/
cache/
typechain/

# Logs
logs/
*.log
npm-debug.log*
```

## README TEMPLATE (Quick)

```markdown
# [Project Name]

Brief description of blockchain project.

## Tech Stack
- Blockchain: [Cardano/Cosmos/Ethereum]
- Language: [Plutus/Rust/Solidity]
- Framework: [Aiken/CosmWasm/Hardhat]

## Setup
\`\`\`bash
git clone [repo-url]
cd [project-name]
npm install  # or equivalent
\`\`\`

## Development
\`\`\`bash
npm run dev
npm test
\`\`\`

## Deployment
See `docs/deployment.md`

## License
[License Type]
```

## SEMANTIC VERSIONING

### Version Format: MAJOR.MINOR.PATCH
- **MAJOR**: Breaking changes (v1.0.0 → v2.0.0)
- **MINOR**: New features, backward compatible (v1.0.0 → v1.1.0)
- **PATCH**: Bug fixes (v1.0.0 → v1.0.1)

### Tagging Releases
```bash
git tag -a v1.0.0 -m "Initial mainnet deployment"
git push origin v1.0.0

# List tags
git tag -l

# Checkout tag
git checkout v1.0.0
```

## COMMON ISSUES & FIXES

### Merge Conflicts
```bash
git status  # identify conflicted files
# Edit files, resolve conflicts
git add [resolved-files]
git commit -m "fix: resolve merge conflicts"
```

### Undo Last Commit (not pushed)
```bash
git reset --soft HEAD~1  # keep changes staged
git reset --mixed HEAD~1  # keep changes unstaged
git reset --hard HEAD~1  # discard changes (dangerous!)
```

### Sync Fork with Upstream
```bash
git remote add upstream [original-repo-url]
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Large Files (Use Git LFS)
```bash
git lfs install
git lfs track "*.pdf"
git lfs track "*.zip"
git add .gitattributes
git commit -m "docs: add Git LFS tracking"
```

## GITHUB ACTIONS (Future CI/CD)

### Basic Workflow Template
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
```

## PRIORITY TOOLS (MCP)
1. **bash_tool** - Execute git commands
2. **filesystem** - Read/write repo files, .gitignore, README
3. **Windows-MCP** - GitHub Desktop automation if needed

## QUICK REFERENCE

### Status Check
```bash
git status && git log --oneline -5
```

### Full Sync
```bash
git pull origin main && git push origin main
```

### Create Feature Branch
```bash
git checkout -b feature/awesome-new-thing
```

### Complete Feature
```bash
git checkout main
git merge feature/awesome-new-thing
git push origin main
git branch -d feature/awesome-new-thing
```

## COMMUNICATION SHORTCUTS
- "init repo" → Initialize git repository
- "commit changes" → Stage all + commit with message
- "push" → Push to origin/main
- "new branch" → Create feature branch
- "merge" → Merge branch to main
- "tag release" → Create version tag

## CRITICAL RULES
1. **Never commit secrets** (.env, private keys, passwords)
2. **Always pull before push** (avoid conflicts)
3. **Meaningful commit messages** (future-you will thank you)
4. **Branch for features** (keep main stable)
5. **Tag releases** (track deployments)
6. **Protect main branch** (require PR reviews for production)

---
**Load Full Git Docs**: Run `git help [command]` for detailed reference
**GitHub Desktop Help**: https://docs.github.com/en/desktop
