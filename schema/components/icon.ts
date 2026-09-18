import { color, defineComponent, dp, string } from "tinyui-cli/schema";

export default defineComponent("ta.Icon", {
    doc: "A Material icon picked by key; unknown keys fall back to a check mark (SubscriptionScreen's benefitIcon).",
    props: {
        name: string({ required: true }),
        tint: color({ default: "primary" }),
        size: dp({ default: 24 }),
    },
});
