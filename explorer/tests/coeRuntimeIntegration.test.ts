import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  ACTIVE_DOMAIN_PACK,
  getDomainPack,
  listDomainPacks,
  setActiveDomainPack,
} from "../src/domains/index.ts";

test("domain registry keeps COE generic while Railway remains an enabled domain pack", () => {
  const packs = listDomainPacks();
  assert.equal(ACTIVE_DOMAIN_PACK.id, "railway");
  assert.equal(getDomainPack("railway")?.apiBase, "/api/railway");
  assert.ok(packs.some((pack) => pack.id === "manufacturing" && pack.status === "planned"));
  assert.ok(packs.some((pack) => pack.id === "supply-chain" && pack.status === "planned"));
  assert.throws(() => setActiveDomainPack("manufacturing"), /not enabled/);
});

test("App exposes the nine COE product entries without removing Runtime safeguards", async () => {
  const appPath = fileURLToPath(new URL("../src/App.tsx", import.meta.url));
  const source = await readFile(appPath, "utf8");
  const labels = [
    "复杂组织体",
    "智能体中心",
    "模型与规则",
    "场景与推演",
    "优化决策",
    "决策分析",
    "报告中心",
    "数据与知识",
    "系统管理",
  ];

  for (const label of labels) {
    assert.ok(source.includes(`label: '${label}'`), `missing primary navigation: ${label}`);
  }

  assert.match(source, /MemoryWorkspace/);
  assert.match(source, /fetchAgentMemoryAvailability/);
  assert.match(source, /hasOntologyUrlState/);
  assert.match(source, /confirmDiscardExploreDraft/);
  assert.match(source, /onDirtyChange=\{setExploreDraftDirty\}/);
});
