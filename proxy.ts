import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUBSCRIPTION_COOKIE } from "@/lib/constants";

export function proxy(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);
	const hasSubscriptionCookie = Boolean(
		request.cookies.get(SUBSCRIPTION_COOKIE)?.value
	);

	requestHeaders.set(
		"x-vercel-daily-access",
		hasSubscriptionCookie ? "subscriber" : "guest"
	);

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: ["/articles/:path*"],
};
