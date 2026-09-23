// Before an App release: what production points at becomes TrendingAI's embedded package (tinyui docs/updates.md §1.4).
// TrendingAI never runs Node (F-Droid builds it), so the result is committed there.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = resolve(root, "../TrendingAI");
// the host owns its version; read it rather than keep a copy that could drift
const hostKt = readFileSync(resolve(app, "shared/src/commonMain/kotlin/whl/trending/ai/tinyui/TrendingTinyUI.kt"), "utf8");
const hostVersion = hostKt.match(/^const val HOST_VERSION = "(\d+)"$/m)?.[1];
if (!hostVersion) throw new Error("HOST_VERSION not found in TrendingTinyUI.kt");
const out = resolve(app, "shared/src/commonMain/composeResources/files/tinyui/trendingai");
const channel = process.argv[2] ?? "production";

execFileSync("node", [resolve(root, "node_modules/tinyui-cli/dist/bin.js"), "pull", "--app", "trendingai", "--channel", channel, "--host-version", hostVersion, "--out", out], { stdio: "inherit", cwd: root });
