import { test } from "node:test";
import assert from "node:assert";
import { KiroGovernanceEngine } from "../src/governance_engine.js";

test("KiroGovernanceEngine: auto-approves safe actions under spending cap", () => {
  const engine = new KiroGovernanceEngine(50.0);
  const result = engine.evaluateAction({
    actionId: "act-01",
    agentId: "agent-infra-scaler",
    toolName: "scale_replica_set",
    parameters: { replicas: 3 },
    estimatedCostUSD: 14.20
  });

  assert.strictEqual(result.decision, "AUTO_APPROVED");
  assert.ok(result.traceHash.length === 64, "Generates SHA-256 trace hash");
});

test("KiroGovernanceEngine: triggers HITL approval token for actions over budget", () => {
  const engine = new KiroGovernanceEngine(50.0);
  const result = engine.evaluateAction({
    actionId: "act-02",
    agentId: "agent-gpu-provisioner",
    toolName: "launch_h100_instance",
    parameters: { hours: 24 },
    estimatedCostUSD: 180.00
  });

  assert.strictEqual(result.decision, "REQUIRES_HITL");
  assert.ok(result.approvalToken?.startsWith("hitl_kiro_"), "Issues cryptographic HITL token");
});

test("KiroGovernanceEngine: blocks destructive tool actions per Kiro spec", () => {
  const engine = new KiroGovernanceEngine(50.0);
  const result = engine.evaluateAction({
    actionId: "act-03",
    agentId: "agent-rogue",
    toolName: "delete_database",
    parameters: { db: "production-users" },
    estimatedCostUSD: 0
  });

  assert.strictEqual(result.decision, "BLOCKED_SPEC_VIOLATION");
});
