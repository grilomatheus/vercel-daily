import { cookies } from "next/headers";
import { getSubscription } from "@/lib/api";
import { SUBSCRIPTION_COOKIE } from "@/lib/constants";

export { SUBSCRIPTION_COOKIE };

export type SubscriptionState = {
	isSubscribed: boolean;
	token?: string;
};

export async function getSubscriptionTokenFromCookie() {
	const cookieStore = await cookies();
	return cookieStore.get(SUBSCRIPTION_COOKIE)?.value;
}

export async function getSubscriptionState(): Promise<SubscriptionState> {
	const token = await getSubscriptionTokenFromCookie();

	if (!token) {
		return { isSubscribed: false };
	}

	try {
		const subscription = await getSubscription(token);
		return {
			isSubscribed: subscription?.status === "active",
			token,
		};
	} catch {
		return { isSubscribed: false, token };
	}
}
