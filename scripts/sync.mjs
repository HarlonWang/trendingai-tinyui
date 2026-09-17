// Builds the pages and copies what TrendingAI commits: bytecode + manifest + source maps into its Compose
// resources, the host component schemas into its Kotlin sources. TrendingAI never runs Node (F-Droid builds it).
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tinyui = resolve(root, "../../KMPProjects/tinyui");
const app = resolve(root, "../TrendingAI");
const resources = resolve(app, "shared/src/commonMain/composeResources/files/tinyui");
const schemasKt = resolve(app, "shared/src/commonMain/kotlin/whl/trending/ai/tinyui/generated/HostSchemas.kt");
const dist = resolve(root, "dist");

// qjsc-kmp: $TINYUI_QJSC, else the host tool quickjs-kmp builds when tinyui's local.properties points at it
function qjsc() {
    if (process.env.TINYUI_QJSC) return process.env.TINYUI_QJSC;
    const props = resolve(tinyui, "local.properties");
    const dir = existsSync(props) ? readFileSync(props, "utf8").match(/^quickjs-kmp\.dir=(.+)$/m)?.[1]?.trim() : undefined;
    const bin = dir && resolve(tinyui, dir, "library/build/native/host-tools/bin/qjsc-kmp");
    if (!bin || !existsSync(bin)) throw new Error(`qjsc-kmp not found; set TINYUI_QJSC or build it: cd ${dir ?? "<quickjs-kmp>"} && ./gradlew :library:buildHostTools`);
    return bin;
}

const cli = resolve(root, "node_modules/@tiny-ui/cli/dist/bin.js");
const run = (...args) => execFileSync("node", [cli, ...args], { stdio: "inherit", cwd: root });

run("schema", "--entry", "schema/index.ts", "--ts", "src/generated/components.ts", "--kt", schemasKt, "--package", "whl.trending.ai.tinyui.generated", "--object", "HostSchemas");
rmSync(dist, { recursive: true, force: true });
run("build", "--root", root, "--out", dist, "--qjsc", qjsc());

// a removed page must not linger in the app
rmSync(resources, { recursive: true, force: true });
mkdirSync(resources, { recursive: true });
cpSync(dist, resources, { recursive: true, filter: (src) => !src.endsWith(".js") });
console.log(`synced → ${resources}\n       → ${schemasKt}`);
