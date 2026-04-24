import { subscribeAction, unsubscribeAction } from "@/app/actions/subscription";
import { LoadingLink } from "@/components/navigation-feedback";
import { HeaderSubscriptionSubmitButton } from "@/components/subscription-submit-buttons";
import { getSubscriptionState } from "@/lib/subscription";

function BellIcon({ subscribed }: { subscribed: boolean }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			className={`h-5 w-5 transition ${
				subscribed ? "text-black" : "text-neutral-500"
			}`}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
			<path d="M9 17a3 3 0 0 0 6 0" />
		</svg>
	);
}

function LogoMark() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 20 20"
			className="h-4 w-4 text-black"
			fill="currentColor"
		>
			<path d="M10 2.8 18 17.2H2L10 2.8Z" />
		</svg>
	);
}

export async function Header() {
	const subscription = await getSubscriptionState();
	const isSubscribed = subscription.isSubscribed;

	return (
		<header className="border-b border-[var(--border)] bg-white text-black">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div className="flex items-center gap-9">
					<LoadingLink
						href="/"
						className="flex items-center gap-2 text-lg font-semibold"
					>
						<LogoMark />
						<span className="text-lg">Vercel Daily</span>
					</LoadingLink>

					<nav className="flex items-center gap-7 text-sm text-neutral-500">
						<LoadingLink className="transition hover:text-black" href="/">
							Home
						</LoadingLink>
						<LoadingLink className="transition hover:text-black" href="/search">
							Search
						</LoadingLink>
					</nav>
				</div>

				<div className="relative">
					{isSubscribed ? (
						<form action={unsubscribeAction}>
							<input type="hidden" name="redirectTo" value="/" />
							<HeaderSubscriptionSubmitButton isSubscribed>
								<BellIcon subscribed />
							</HeaderSubscriptionSubmitButton>
						</form>
					) : (
						<form action={subscribeAction}>
							<input type="hidden" name="redirectTo" value="/" />
							<HeaderSubscriptionSubmitButton isSubscribed={false}>
								<BellIcon subscribed={false} />
							</HeaderSubscriptionSubmitButton>
						</form>
					)}

					{isSubscribed ? (
						<span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-black" />
					) : null}
				</div>
			</div>
		</header>
	);
}
