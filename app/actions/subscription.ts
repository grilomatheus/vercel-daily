"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	activateSubscription,
	createSubscriptionToken,
	deactivateSubscription,
} from "@/lib/api";
import { SUBSCRIPTION_COOKIE } from "@/lib/constants";

function resolveRedirectPath(formData: FormData) {
	const raw = formData.get("redirectTo");

	if (typeof raw !== "string") {
		return "/";
	}

	if (!raw.startsWith("/") || raw.startsWith("//")) {
		return "/";
	}

	return raw;
}

function revalidateAppShell() {
	revalidatePath("/", "layout");
	revalidatePath("/");
	revalidatePath("/search");
}

export async function subscribeAction(formData: FormData) {
	const cookieStore = await cookies();
	const redirectTo = resolveRedirectPath(formData);

	let token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

	if (!token) {
		token = await createSubscriptionToken();
	}

	await activateSubscription(token);

	cookieStore.set(SUBSCRIPTION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});

	revalidateAppShell();
	redirect(redirectTo);
}

export async function unsubscribeAction(formData: FormData) {
	const cookieStore = await cookies();
	const redirectTo = resolveRedirectPath(formData);
	const token = cookieStore.get(SUBSCRIPTION_COOKIE)?.value;

	if (token) {
		try {
			await deactivateSubscription(token);
		} catch (error) {
			console.error("Failed to deactivate remote subscription:", error);
		}
	}

	cookieStore.delete(SUBSCRIPTION_COOKIE);

	revalidateAppShell();
	redirect(redirectTo);
}
