import Link from "next/link";
import { getBreakingNews } from "@/lib/api";

function AlertIcon() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			className="h-4 w-4 text-white"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 3 21 19H3L12 3Z" />
			<path d="M12 9v5" />
			<circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
		</svg>
	);
}

export async function BreakingNewsBanner() {
	let headline = "Vercel Daily is loading the latest headlines.";
	let slug: string | undefined;

	try {
		const breakingNews = await getBreakingNews();
		headline = breakingNews.headline;
		slug = breakingNews.slug;
	} catch {
		// Keep fallback text if API is unavailable.
	}

	return (
		<section className="border-b border-black bg-black text-white">
			<div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3 text-[15px]">
				<AlertIcon />
				<span className="rounded bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
					Breaking
				</span>
				{slug ? (
					<Link href={`/articles/${slug}`} className="truncate hover:underline">
						{headline}
					</Link>
				) : (
					<p className="truncate">{headline}</p>
				)}
			</div>
		</section>
	);
}
