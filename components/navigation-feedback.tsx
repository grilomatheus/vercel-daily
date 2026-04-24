"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
	createContext,
	type ComponentProps,
	type MouseEvent,
	type ReactNode,
	Suspense,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type NavigationFeedbackContextValue = {
	pending: boolean;
	start: () => void;
	stop: () => void;
};

const NavigationFeedbackContext =
	createContext<NavigationFeedbackContextValue | null>(null);

function useNavigationFeedback() {
	const context = useContext(NavigationFeedbackContext);

	if (!context) {
		throw new Error(
			"useNavigationFeedback must be used inside NavigationFeedbackProvider."
		);
	}

	return context;
}

function RouteChangeObserver({ onChange }: { onChange: () => void }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const routeKey = `${pathname}?${searchParams.toString()}`;

	useEffect(() => {
		onChange();
	}, [routeKey, onChange]);

	return null;
}

function NavigationIndicator({ pending }: { pending: boolean }) {
	if (!pending) {
		return null;
	}

	return (
		<div
			aria-live="polite"
			aria-label="Loading page"
			className="fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden bg-neutral-200"
		>
			<div className="h-full w-1/3 animate-[route-progress_1s_ease-in-out_infinite] bg-black" />
		</div>
	);
}

export function NavigationFeedbackProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [pending, setPending] = useState(false);
	const start = useCallback(() => setPending(true), []);
	const stop = useCallback(() => setPending(false), []);

	useEffect(() => {
		if (!pending) {
			return;
		}

		const timeout = window.setTimeout(() => setPending(false), 10000);
		return () => window.clearTimeout(timeout);
	}, [pending]);

	const value = useMemo(
		() => ({
			pending,
			start,
			stop,
		}),
		[pending, start, stop]
	);

	return (
		<NavigationFeedbackContext.Provider value={value}>
			<Suspense fallback={null}>
				<RouteChangeObserver onChange={stop} />
			</Suspense>
			<NavigationIndicator pending={pending} />
			{children}
		</NavigationFeedbackContext.Provider>
	);
}

function shouldIgnoreClick(event: MouseEvent<HTMLAnchorElement>) {
	return (
		event.defaultPrevented ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey ||
		event.button !== 0
	);
}

export function LoadingLink({
	onClick,
	href,
	...props
}: ComponentProps<typeof Link>) {
	const { start } = useNavigationFeedback();

	function handleClick(event: MouseEvent<HTMLAnchorElement>) {
		onClick?.(event);

		if (!shouldIgnoreClick(event)) {
			start();
		}
	}

	return <Link href={href} onClick={handleClick} {...props} />;
}

export { useNavigationFeedback };
