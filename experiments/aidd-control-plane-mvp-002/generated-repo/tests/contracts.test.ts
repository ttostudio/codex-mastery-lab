import { describe, expect, it } from "vitest";
import { validateArtifact, validateContract, artifactDefinitions } from "../src/lib/contracts";
import { createInvalidJsonSample, createMissingRequiredSample, sampleArtifacts } from "../src/lib/samples";

describe("AIDD JSON契約検査", () => {
  it("4つのサンプル成果物が合格になる", () => {
    const result = validateContract(sampleArtifacts);

    expect(result.overallStatus).toBe("valid");
    expect(result.missingRequiredPaths).toEqual([]);
    expect(result.invalidJsonErrors).toEqual([]);
  });

  it("必須項目が欠けたpathを成果物名つきで返す", () => {
    const result = validateContract(createMissingRequiredSample());

    expect(result.overallStatus).toBe("missing_required");
    expect(result.missingRequiredPaths).toContain("AI Task Packet.product_brief.user_problem");
    expect(result.improvementSuggestions).toContain("AI Task Packet: product_brief.user_problem を追加してください。");
  });

  it("壊れたJSONをinvalid_jsonとして返す", () => {
    const result = validateContract(createInvalidJsonSample());

    expect(result.overallStatus).toBe("invalid_json");
    expect(result.invalidJsonErrors[0]).toContain("AI Task Packet");
    expect(result.invalidJsonErrors[0]).toContain("JSONの形式が正しくありません");
  });

  it("空のJSONはemptyとして必須pathを返す", () => {
    const taskPacketDefinition = artifactDefinitions.find((definition) => definition.key === "taskPacket");
    expect(taskPacketDefinition).toBeDefined();

    const result = validateArtifact(taskPacketDefinition!, "");

    expect(result.status).toBe("empty");
    expect(result.missingPaths).toContain("spec_version");
    expect(result.invalidJsonError).toBe("JSONが空です。");
  });
});
