/**
 * @file tests/unit/lib/audit-engine.test.ts
 * @description Unit tests for the StackAudit audit engine.
 *
 * Run: npm test
 * (Requires: npm install -D jest @types/jest ts-jest)
 */

import { runAudit } from "../../../lib/audit-engine";
import type { AuditInput } from "../../../lib/audit-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const singleDevCursorAndCopilot: AuditInput = {
  teamSize: 1,
  subscriptions: [
    { toolId: "cursor", planId: "pro", seats: 1, monthlySpend: 20 },
    { toolId: "github-copilot", planId: "individual", seats: 1, monthlySpend: 10 },
  ],
};

const chatgptTeamSingleSeat: AuditInput = {
  teamSize: 1,
  subscriptions: [
    { toolId: "chatgpt", planId: "team", seats: 1, monthlySpend: 30 },
  ],
};

const lowUsageClaude: AuditInput = {
  teamSize: 2,
  subscriptions: [
    { toolId: "claude", planId: "pro", seats: 2, monthlySpend: 40, usageLevel: "low" },
  ],
};

const excessSeats: AuditInput = {
  teamSize: 5,
  subscriptions: [
    {
      toolId: "cursor",
      planId: "pro",
      seats: 10,
      monthlySpend: 200,
      activeSeats: 4,
    },
  ],
};

const tripleChatOverlap: AuditInput = {
  teamSize: 3,
  subscriptions: [
    { toolId: "chatgpt", planId: "plus", seats: 1, monthlySpend: 20 },
    { toolId: "claude", planId: "pro", seats: 1, monthlySpend: 20 },
    { toolId: "gemini", planId: "advanced", seats: 1, monthlySpend: 19.99 },
  ],
};

const fullyOptimized: AuditInput = {
  teamSize: 2,
  subscriptions: [
    // Pro plan, 2/2 seats active, high usage — no rules should fire
    {
      toolId: "cursor",
      planId: "pro",
      seats: 2,
      monthlySpend: 40,
      activeSeats: 2,
      usageLevel: "high",
    },
  ],
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("runAudit", () => {
  describe("input validation", () => {
    it("throws on missing subscriptions", async () => {
      await expect(
        runAudit({ teamSize: 1, subscriptions: undefined as never })
      ).rejects.toThrow();
    });

    it("throws on negative team size", async () => {
      await expect(
        runAudit({ teamSize: -1, subscriptions: [] })
      ).rejects.toThrow();
    });

    it("throws on invalid monthlySpend", async () => {
      await expect(
        runAudit({
          teamSize: 1,
          subscriptions: [{ toolId: "cursor", planId: "pro", seats: 1, monthlySpend: -10 }],
        })
      ).rejects.toThrow();
    });
  });

  describe("result structure", () => {
    it("returns a valid AuditResult shape", async () => {
      const result = await runAudit(fullyOptimized);
      expect(result).toHaveProperty("auditId");
      expect(result).toHaveProperty("generatedAt");
      expect(result).toHaveProperty("totalCurrentMonthlySpend");
      expect(result).toHaveProperty("totalMonthlySavings");
      expect(result).toHaveProperty("totalAnnualSavings");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("recommendations");
      expect(result).toHaveProperty("summary");
    });

    it("score is between 0 and 100", async () => {
      const result = await runAudit(singleDevCursorAndCopilot);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("annual savings = monthly savings × 12", async () => {
      const result = await runAudit(singleDevCursorAndCopilot);
      expect(result.totalAnnualSavings).toBeCloseTo(result.totalMonthlySavings * 12, 1);
    });

    it("subscriptionsEvaluated matches input length", async () => {
      const result = await runAudit(tripleChatOverlap);
      expect(result.subscriptionsEvaluated).toBe(3);
    });
  });

  describe("rule: single-seat-team-plan", () => {
    it("flags ChatGPT Team with 1 seat", async () => {
      const result = await runAudit(chatgptTeamSingleSeat);
      const rec = result.recommendations.find((r) => r.ruleId === "single-seat-team-plan");
      expect(rec).toBeDefined();
      expect(rec?.monthlySavings).toBe(10); // $30 team → $20 plus
    });

    it("saves $10/month on ChatGPT team → plus downgrade", async () => {
      const result = await runAudit(chatgptTeamSingleSeat);
      expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(10);
    });
  });

  describe("rule: low-seat-utilization", () => {
    it("flags seats when utilization < 70%", async () => {
      const result = await runAudit(excessSeats);
      const rec = result.recommendations.find((r) => r.ruleId === "low-seat-utilization");
      expect(rec).toBeDefined();
      expect(rec?.monthlySavings).toBeGreaterThan(0);
    });
  });

  describe("rule: claude-pro-to-api-low", () => {
    it("flags Claude Pro with low usage", async () => {
      const result = await runAudit(lowUsageClaude);
      const rec = result.recommendations.find((r) => r.ruleId === "claude-pro-to-api-low");
      expect(rec).toBeDefined();
      expect(rec?.confidence).toBe("medium");
    });
  });

  describe("rule: multiple-coding-tools", () => {
    it("flags two coding tools as overlap", async () => {
      const result = await runAudit(singleDevCursorAndCopilot);
      const rec = result.recommendations.find((r) => r.ruleId === "multiple-coding-tools");
      expect(rec).toBeDefined();
      expect(rec?.severity).toBe("high");
    });
  });

  describe("rule: triple-chat-overlap", () => {
    it("flags three chat tools", async () => {
      const result = await runAudit(tripleChatOverlap);
      const rec = result.recommendations.find((r) => r.ruleId === "triple-chat-overlap");
      expect(rec).toBeDefined();
      expect(rec?.affectedToolIds).toContain("chatgpt");
      expect(rec?.affectedToolIds).toContain("claude");
      expect(rec?.affectedToolIds).toContain("gemini");
    });

    it("correctly calculates savings as most expensive tool cost", async () => {
      const result = await runAudit(tripleChatOverlap);
      const rec = result.recommendations.find((r) => r.ruleId === "triple-chat-overlap");
      // Most expensive of the three is $20 (chatgpt or claude)
      expect(rec?.monthlySavings).toBe(20);
    });
  });

  describe("optimized input", () => {
    it("returns score of 100 when no savings found", async () => {
      const result = await runAudit(fullyOptimized);
      expect(result.score).toBe(100);
      expect(result.recommendations).toHaveLength(0);
    });

    it("summary mentions no savings for optimized input", async () => {
      const result = await runAudit(fullyOptimized);
      expect(result.summary).toMatch(/optimized|no significant/i);
    });
  });

  describe("recommendations ordering", () => {
    it("sorts recommendations by monthlySavings descending", async () => {
      const result = await runAudit(tripleChatOverlap);
      for (let i = 1; i < result.recommendations.length; i++) {
        expect(result.recommendations[i - 1]!.monthlySavings).toBeGreaterThanOrEqual(
          result.recommendations[i]!.monthlySavings
        );
      }
    });
  });
});
