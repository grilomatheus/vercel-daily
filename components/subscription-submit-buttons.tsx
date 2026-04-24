"use client";

import { useFormStatus } from "react-dom";

function Spinner({ className }: { className: string }) {
	return (
		<span
			aria-hidden
			className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
		/>
	);
}

export function HeroSubscriptionSubmitButton({
	isSubscribed,
}: {
	isSubscribed: boolean;
}) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex min-w-32 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-50 disabled:cursor-wait disabled:opacity-70"
		>
			{pending ? (
				<>
					<Spinner className="h-3.5 w-3.5" />
					{isSubscribed ? "Updating" : "Subscribing"}
				</>
			) : isSubscribed ? (
				"Subscribed"
			) : (
				"Subscribe"
			)}
		</button>
	);
}

export function HeaderSubscriptionSubmitButton({
	isSubscribed,
	children,
}: {
	isSubscribed: boolean;
	children: React.ReactNode;
}) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			title={isSubscribed ? "Unsubscribe" : "Subscribe"}
			aria-label={isSubscribed ? "Unsubscribe" : "Subscribe"}
			className="inline-flex h-7 w-7 items-center justify-center rounded-md p-1 transition hover:bg-neutral-100 disabled:cursor-wait disabled:opacity-70"
		>
			{pending ? <Spinner className="h-4 w-4 text-neutral-500" /> : children}
		</button>
	);
}
