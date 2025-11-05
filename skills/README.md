# CoCoA Skills - 2-Tier Architecture

## THE PROBLEM WE SOLVED

**Before**: Skills were 2,000-4,500 tokens each = ~9,000+ tokens loading into EVERY conversation, causing:
- Token budget exhaustion before producing results
- Claude overthinking instead of executing
- Slow, inefficient responses
- Wasted time and frustration

**After**: 2-Tier system = ~900 tokens total for daily operations (90% reduction!)

---

## HOW IT WORKS

### **TIER 1: Action Triggers** (in `/skills` folder)
**Size**: Max 300 tokens each
**Purpose**: Recognize WHEN to activate and WHAT to do
**Load**: ALWAYS (automatically via Claude Desktop config)

These are lean, action-focused skill files that:
- Trigger on specific user phrases/contexts
- Provide quick-reference commands
- Execute immediately without overthinking
- Reference Tier 2 docs ONLY when needed

**Current Tier 1 Skills:**
- `cocoa-core.md` - CoCoA system activation and quick actions
- `productivity-core.md` - Obsidian idea management triggers
- `communications-core.md` - Multi-channel communication triggers

### **TIER 2: Reference Docs** (in `/docs` folder)  
**Size**: Full documentation (2,000-4,500 tokens)
**Purpose**: Complete templates, workflows, troubleshooting
**Load**: ON DEMAND ONLY (when explicitly needed)

These are comprehensive guides that Claude reads when:
- User asks for detailed templates
- Complex workflows need explanation
- Troubleshooting or edge cases arise
- System customization is requested

**Current Tier 2 Docs:**
- `cocoa-reference.md` - Full CoCoA project documentation
- `productivity-guide.md` - Complete Obsidian system guide
- `communications-guide.md` - Full communication strategies

---

## BENEFITS

✅ **90% Token Reduction**: 9,000 → 900 tokens in daily context
✅ **Faster Responses**: Claude executes instead of overthinking
✅ **No More Token Exhaustion**: Budget available for actual work
✅ **Smart Loading**: Full docs only when actually needed
✅ **Scalable**: Add more skills without bloating

---

## CURRENT ARCHITECTURE

```
D:\Claude-MCP-Files\
├── skills/                    # TIER 1 (Always loaded)
│   ├── README.md             # This file
│   ├── cocoa-core.md         # ~300 tokens
│   ├── productivity-core.md  # ~300 tokens
│   └── communications-core.md # ~300 tokens
│
├── docs/                      # TIER 2 (Load on demand)
│   ├── cocoa-reference.md    # ~2,600 tokens
│   ├── productivity-guide.md # ~4,500 tokens
│   └── communications-guide.md # ~2,000 tokens
│
└── CoCoA-Project/            # Project files (not skills)
    ├── context/
    ├── workflows/
    └── ...
```

---

**Version**: 2.0  
**Created**: October 29, 2025  
**Optimization**: 90% token reduction achieved  
**Status**: ✅ ACTIVE & WORKING
