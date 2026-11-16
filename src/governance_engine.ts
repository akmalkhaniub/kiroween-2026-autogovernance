import crypto from "node:crypto";

export interface AgentAction {
  actionId: string;
  agentId: string;
  toolName: string;
  parameters: Record<string, unknown>;
  estimatedCostUSD: number;
}

export type Decision = "AUTO_APPROVED" | "REQUIRES_HITL" | "BLOCKED_SPEC_VIOLATION";

export interface GovernanceResult {
  actionId: string;
  decision: Decision;
  reason: string;
  approvalToken?: string;
  traceHash: string;
  timestamp: string;
}

export class KiroGovernanceEngine {
  constructor(
    public maxAutonomousSpendUSD: number = 50.0,
    public blockedTools: Set<string> = new Set(["delete_database", "revoke_root_iam", "drain_prod_cluster"])
  ) {}

  evaluateAction(action: AgentAction): GovernanceResult {
    const timestamp = new Date().toISOString();
    const tracePayload = JSON.stringify({ actionId: action.actionId, tool: action.toolName, timestamp });
    const traceHash = crypto.createHash("sha256").update(tracePayload).digest("hex");

    // 1. Invariant Guard: Block critical destructive operations
    if (this.blockedTools.has(action.toolName)) {
      return {
        actionId: action.actionId,
        decision: "BLOCKED_SPEC_VIOLATION",
        reason: `Tool '${action.toolName}' is strictly prohibited by Kiro Steering Spec.`,
        traceHash,
        timestamp
      };
    }

    // 2. Spend Limit Guard: Exceeding autonomous budget triggers HITL
    if (action.estimatedCostUSD > this.maxAutonomousSpendUSD) {
      const approvalToken = `hitl_kiro_${crypto.randomBytes(4).toString("hex")}`;
      return {
        actionId: action.actionId,
        decision: "REQUIRES_HITL",
        reason: `Estimated cost ($${action.estimatedCostUSD}) exceeds autonomous limit ($${this.maxAutonomousSpendUSD}).`,
        approvalToken,
        traceHash,
        timestamp
      };
    }

    // 3. Fast-Path: Allow autonomous execution
    return {
      actionId: action.actionId,
      decision: "AUTO_APPROVED",
      reason: `Action compliant with Kiro Governance Spec (Cost: $${action.estimatedCostUSD} <= $${this.maxAutonomousSpendUSD}).`,
      traceHash,
      timestamp
    };
  }
}
