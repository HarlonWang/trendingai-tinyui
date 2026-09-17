// Host components TrendingAI registers on top of the built-ins; `pnpm schema` generates the TS types here
// and `pnpm sync` the Kotlin schemas into TrendingAI.
import Icon from "./components/icon.ts";
import Loading from "./components/loading.ts";

export default [Icon, Loading];
