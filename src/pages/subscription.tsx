import { Box, Button, Column, For, observable, RadioButton, resource, Row, Show, Spacer, Text } from "@tiny-ui/core";
import { store } from "@tiny-ui/native";
import { ta } from "../generated/components.ts";
import { analytics, auth, billing, checkout, ui, type Plan } from "../host/index.ts";

/** Everything worded: resolved by Kotlin from the remote `pro_paywall` with the string resources as fallback. */
export interface SubscriptionProps {
    content: {
        title: string;
        subtitle: string;
        benefits: { icon: string | null; text: string }[];
        benefitsFallback: string;
        ctaSubscribe: string;
        ctaSignIn: string;
        ctaViewPrice: string;
        refundNote: string;
        alreadyPro: string;
        checkoutFailed: string;
    };
    plans: Record<Plan, { title: string; unit: string }>;
    /** `{percent}` stands for the number */
    savingsBadge: string;
}

export default function Subscription(props: SubscriptionProps) {
    const content = props.content;
    const [prices] = resource(() => billing.prices());
    const state = observable({ plan: "annual" as Plan, checkingOut: false });
    const loggedIn = store.watch<boolean>("auth.loggedIn");
    const isPro = store.watch<boolean>("pro.isPro");

    function selectPlan(plan: Plan) {
        if (state.plan === plan) return;
        analytics.checkoutStep("plan_selected", plan);
        state.plan = plan;
    }

    async function onCta() {
        if (!loggedIn()) {
            auth.signIn("paywall");
            return;
        }
        if (state.checkingOut) return;
        state.checkingOut = true;
        try {
            await checkout.start(state.plan);
        } catch {
            ui.snackbar(content.checkoutFailed);
        } finally {
            state.checkingOut = false;
        }
    }

    const ctaText = () => (!loggedIn() ? content.ctaSignIn : prices()?.available ? content.ctaSubscribe : content.ctaViewPrice);
    const badge = () => {
        const percent = prices()?.savingsPercent;
        return percent == null ? undefined : props.savingsBadge.replace("{percent}", `${percent}%`);
    };

    return (
        <Column width="fill" height="fill" scroll padding={16}>
            <Text text={content.title} style="headlineMedium" align="center" width="fill" />
            <Spacer height={8} />
            <Text text={content.subtitle} style="bodyMedium" color="onSurfaceVariant" align="center" width="fill" />

            <Spacer height={24} />
            <Show when={content.benefits.length > 0} fallback={() => <Text text={content.benefitsFallback} style="bodyLarge" align="center" width="fill" />}>
                {() => (
                    <Column gap={16}>
                        <For each={content.benefits} key={(b) => b.text}>
                            {(benefit) => (
                                <Row align="center" gap={16}>
                                    <ta.Icon name={benefit().icon ?? ""} />
                                    <Text text={benefit().text} style="bodyLarge" />
                                </Row>
                            )}
                        </For>
                    </Column>
                )}
            </Show>

            <Spacer height={24} />
            <Show when={prices() !== undefined} fallback={() => <Box width="fill" padding={24} align="center"><ta.Loading /></Box>}>
                {() => (
                    <Column gap={8}>
                        <PlanCard
                            title={props.plans.annual.title}
                            unit={props.plans.annual.unit}
                            price={prices()?.annual?.formatted}
                            badge={badge()}
                            selected={state.plan === "annual"}
                            onClick={() => selectPlan("annual")}
                        />
                        <PlanCard
                            title={props.plans.monthly.title}
                            unit={props.plans.monthly.unit}
                            price={prices()?.monthly?.formatted}
                            badge={undefined}
                            selected={state.plan === "monthly"}
                            onClick={() => selectPlan("monthly")}
                        />
                    </Column>
                )}
            </Show>

            <Spacer height={16} />
            <Show when={isPro()} fallback={() => (
                <Button width="fill" enabled={!state.checkingOut} onClick={() => onCta()} text={ctaText()}>
                    <Show when={state.checkingOut}>{() => <ta.Loading color="onPrimary" />}</Show>
                </Button>
            )}>
                {() => <Text text={content.alreadyPro} style="bodyMedium" color="onSurfaceVariant" />}
            </Show>

            <Spacer height={12} />
            <Text text={content.refundNote} style="bodySmall" color="onSurfaceVariant" />
            <Spacer height={8} />
        </Column>
    );
}

interface PlanCardProps {
    title: string;
    unit: string;
    price: string | undefined;
    badge: string | undefined;
    selected: boolean;
    onClick: () => void;
}

/** Annual is preselected and carries the savings badge; monthly sits beside it, never folded away. */
function PlanCard(p: PlanCardProps) {
    return (
        <Row
            width="fill"
            align="center"
            padding={12}
            cornerRadius={12}
            background={p.selected ? "secondaryContainer" : "surfaceContainer"}
            borderWidth={p.selected ? 2 : 0}
            borderColor="primary"
            onClick={() => p.onClick()}
        >
            <RadioButton selected={p.selected} onClick={() => p.onClick()} />
            <Column weight={1}>
                <Row align="center" gap={8}>
                    <Text text={p.title} style="titleSmall" />
                    <Show when={p.badge}>
                        {() => (
                            <Box background="primary" cornerRadius={4} paddingHorizontal={6} paddingVertical={2}>
                                <Text text={p.badge ?? ""} style="labelSmall" color="onPrimary" />
                            </Box>
                        )}
                    </Show>
                </Row>
                <Show when={p.price}>{() => <Text text={`${p.price} · ${p.unit}`} style="bodyMedium" color="onSurfaceVariant" />}</Show>
            </Column>
        </Row>
    );
}
