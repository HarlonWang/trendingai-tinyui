// Builds the pages and copies what TrendingAI commits: bytecode + manifest + source maps into its Compose
// resources, the host component schemas into its Kotlin sources. TrendingAI never runs Node (F-Droid builds it).
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = resolve(root, "../TrendingAI");
// one directory per package (tinyui docs/updates.md §3)
const resources = resolve(app, "shared/src/commonMain/composeResources/files/tinyui/trendingai");
const schemasKt = resolve(app, "shared/src/commonMain/kotlin/whl/trending/ai/tinyui/generated/HostSchemas.kt");
const dist = resolve(root, "dist");

const cli = resolve(root, "node_modules/tinyui-cli/dist/bin.js");
const run = (...args) => execFileSync("node", [cli, ...args], { stdio: "inherit", cwd: root });

run("schema", "--entry", "schema/index.ts", "--ts", "src/generated/components.ts", "--kt", schemasKt, "--package", "whl.trending.ai.tinyui.generated", "--object", "HostSchemas");
rmSync(dist, { recursive: true, force: true });
run("build", "--root", root, "--out", dist);

// a removed page must not linger in the app
rmSync(resources, { recursive: true, force: true });
mkdirSync(resources, { recursive: true });
cpSync(dist, resources, { recursive: true, filter: (src) => !src.endsWith(".js") });
console.log(`synced → ${resources}\n       → ${schemasKt}`);
