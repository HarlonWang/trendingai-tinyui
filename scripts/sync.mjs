// Host component schemas into TrendingAI's Kotlin sources. The embedded package itself comes from `pnpm pull`.
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemasKt = resolve(root, "../TrendingAI/shared/src/commonMain/kotlin/whl/trending/ai/tinyui/generated/HostSchemas.kt");
const cli = resolve(root, "node_modules/tinyui-cli/dist/bin.js");

execFileSync("node", [cli, "schema", "--entry", "schema/index.ts", "--ts", "src/generated/components.ts", "--kt", schemasKt, "--package", "whl.trending.ai.tinyui.generated", "--object", "HostSchemas"], { stdio: "inherit", cwd: root });
console.log(`synced → ${schemasKt}`);
