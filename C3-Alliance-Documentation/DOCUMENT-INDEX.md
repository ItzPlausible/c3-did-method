# C3 Alliance Documentation Index

## Document Versions & Status

### Governance Documents
| Document | Version | Status | Location |
|----------|---------|--------|----------|
| Bill of Rights | v2.1 | ✅ Current | `docs/governance/` |
| Bill of Rights | v2.0 | 📦 Archive | `docs/governance/` |
| Articles of Organization (LCA) | v2.1 | ✅ Current | `docs/governance/` |
| Local Charter Template | v1.0 | ✅ Current | `docs/governance/` |

### Technical Documents
| Document | Version | Status | Location |
|----------|---------|--------|----------|
| Smart Contract Architecture | v2.2 | ✅ Current | `docs/technical/` |
| Journey Builder Whitepaper | v1.0 | ✅ Current | `docs/technical/` |

### Legal Documents
| Document | Version | Status | Location |
|----------|---------|--------|----------|
| SECO Operating Agreement | v1.0 | ✅ Current | `docs/legal/` |
| SECO Articles of Organization | v1.2 | ✅ Current | `docs/legal/` |
| SECO Framework | v1.1 | ✅ Current | `docs/legal/` |

## Version Naming Convention

**Format**: `Document-Name-vMAJOR_MINOR_PATCH.docx`

**Examples**:
- `C3-Bill-of-Rights-v2_1_0.docx`
- `SECO-Operating-Agreement-v1_0_0.docx`

**Versioning Rules**:
- **MAJOR (X.0.0)**: Complete rewrites, breaking changes
- **MINOR (0.X.0)**: New sections, significant additions
- **PATCH (0.0.X)**: Corrections, clarifications, typo fixes

## Document Dependencies

```
Bill of Rights v2.1
├── Referenced by: Articles of Organization v2.1
├── Referenced by: Local Charter v1.0
└── Referenced by: SECO Operating Agreement v1.0

Articles of Organization v2.1
├── References: Bill of Rights v2.1
└── Referenced by: Local Charter v1.0

Smart Contract Architecture v2.2
├── Implements: Journey Builder Whitepaper
└── References: Bill of Rights v2.1

SECO Framework v1.1
├── Implements: Operating Agreement v1.0
├── Implements: Articles of Organization v1.2
└── References: Articles of Organization v2.1
```

## Change Log

### 2025-11-04 - Initial Repository Setup
- Created repository structure
- Organized documents by category
- Established version tracking system
- Prepared for first commit

### Future Updates
- Track all version updates here
- Note breaking changes
- Document dependencies
- Link to commit hashes for traceability

---

**Maintained By**: Plausible Potentials Consulting (PPC)  
**Last Updated**: November 4, 2025  
**Next Review**: When any document reaches new version milestone
