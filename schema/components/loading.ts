import { color, defineComponent, dp } from "tinyui-cli/schema";

export default defineComponent("ta.Loading", {
    doc: "M3 Expressive LoadingIndicator, the app-wide loading indicator (TrendingAI CLAUDE.md).",
    props: {
        size: dp({ default: 24 }),
        color: color({ default: "primary" }),
    },
});
