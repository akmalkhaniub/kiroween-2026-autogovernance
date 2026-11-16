# Kiro Agent Steering Specification: AutoGovernance Mesh

## 1. Intent & Purpose
This project is an autonomous specification-driven governance engine for AI agents operating in production cloud environments. It uses Kiro hooks and specs to enforce deterministic policy checks, preventing unauthorized spend and unverified code changes.

## 2. Agent Roles
1. **SpecAuditorAgent**: Evaluates real-time agent tool calls against formal machine-readable YAML/JSON specifications.
2. **DeterministicGate**: Blocks any action exceeding risk budgets (e.g. >$50 spend, delete actions, root IAM privileges).
3. **TraceEmitter**: Emits cryptographically signed execution traces for continuous compliance audits.

## 3. Mandatory Invariants
- All agent actions must correlate with an existing Issue or WorkSpec ID.
- Any unverified action automatically routes to a Human-in-the-Loop (HITL) approval gate.
