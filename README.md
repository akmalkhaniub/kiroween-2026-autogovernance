# 🎃 Kiro AutoGovernance Mesh — Kiroween 2026

[![TypeScript: strict](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Event: Kiroween 2026](https://img.shields.io/badge/Devpost-Kiroween%202026-orange.svg)](https://devpost.com)
[![Kiro Specs](https://img.shields.io/badge/Kiro-Spec%20Engine-purple.svg)](./.kiro)
[![Tests: Passing](https://img.shields.io/badge/Tests-3%2F3%20Passed-emerald.svg)](./test)

> **Built for [Kiroween 2026 (Devpost)](https://devpost.com)**  
> *Timeline: October 30 – December 4, 2026 • Prize Pool: $100,000*

Kiro AutoGovernance Mesh is a specification-driven execution harness for autonomous cloud and enterprise agents. Powered by Kiro steering specs (`/.kiro/specs`), it enforces deterministic spending caps, prevents unvetted destructive actions, and gates anomalous operations behind cryptographic Human-in-the-Loop (HITL) approval tokens.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    User["👤 Human Principal\n(Sets Kiro Steering Specs)"] --> Spec["📜 /.kiro/specs/governance_spec.md"]
    
    subgraph Kiro_Harness ["🛡️ Kiro Governance Mesh"]
        Spec --> Engine["⚖️ Policy & Spend Evaluation Gate"]
        Agent["🤖 Autonomous Cloud Agent\n(Tool Invocation)"] --> Engine
        
        Engine -->|"< $50 & Safe Action"| FastPath["⚡ Cryptographic Fast-Path Execution"]
        Engine -->|"> $50 Spend"| HITL["🛑 Human-in-the-Loop Gate\n(Approval Token Issued)"]
        Engine -->|"Destructive Action"| Block["🚫 Blocked: Spec Invariant Violation"]
    end
    
    FastPath --> Cloud["☁️ Cloud Provider / Tool Execution"]
    HITL -->|"Principal Sign-Off"| Cloud
    
    classDef kiro fill:#1e1e2e,stroke:#cba6f7,stroke-width:2px,color:#fff;
    classDef gate fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    class Engine,FastPath,HITL,Block gate;
    class Spec,Agent,Cloud kiro;
```

---

## 🚀 Quickstart & Verification

```bash
# 1. Run automated verification suite
npm test

# 2. Build production distribution
npm run build
```
