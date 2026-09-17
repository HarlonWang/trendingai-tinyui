// Typed face of what SubscriptionScreen.kt registers as HostServices.capabilities; names and shapes must match there.
import { host } from "@tiny-ui/native";

export type Plan = "annual" | "monthly";

export interface Prices {
    /** both plans priced; otherwise the page shows no number at all */
    available: boolean;
    annual: { formatted: string } | null;
    monthly: { formatted: string } | null;
    savingsPercent: number | null;
}

export const billing = {
    prices: () => host.call<Prices>("billing.prices"),
};

export const checkout = {
    /** Creates the transaction and opens the checkout; rejects when the transaction could not be created. */
    start: (plan: Plan) => host.call("checkout.start", { plan }),
};

export const auth = {
    signIn: (source: string) => host.call("auth.signIn", { source }),
};

export const analytics = {
    checkoutStep: (kind: "plan_selected", plan: Plan) => host.call("analytics.checkoutStep", { kind, plan }),
};

export const ui = {
    snackbar: (message: string) => host.call("ui.snackbar", { message }),
};
