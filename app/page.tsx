import type { Metadata } from "next";
import { Suspense } from "react";
import { subscribeAction, unsubscribeAction } from "@/app/actions/subscription";
import { ArticleCard } from "@/components/article-card";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";
import { BreakingNewsBanner } from "@/components/breaking-news-banner";
import { LoadingLink } from "@/components/navigation-feedback";
import { HeroSubscriptionSubmitButton } from "@/components/subscription-submit-buttons";
import { getArticles } from "@/lib/api";
import { getSubscriptionState } from "@/lib/subscription";

export const metadata: Metadata = {
	title: "Home",
	description: "Featured stories and breaking headlines from Vercel Daily.",
	openGraph: {
		title: "Home | Vercel Daily",
		description: "Featured stories and breaking headlines from Vercel Daily.",
	},
};

async function FeaturedArticles() {
	let featuredArticles = await getArticles({ featured: true, limit: 6 });

	if (featuredArticles.length < 6) {
		const fallbackArticles = await getArticles({ limit: 6 });
		const unique = new Map(
			featuredArticles.map((article) => [article.id, article])
		);

		for (const article of fallbackArticles) {
			if (unique.size >= 6) {
				break;
			}
			unique.set(article.id, article);
		}

		featuredArticles = Array.from(unique.values());
	}

	return (
		<div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
			{featuredArticles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	);
}

export default async function HomePage() {
	const subscription = await getSubscriptionState();
	const isSubscribed = subscription.isSubscribed;

	return (
		<>
			<Suspense
				fallback={
					<section className="border-b border-black bg-black py-3 text-transparent">
						.
					</section>
				}
			>
				<BreakingNewsBanner />
			</Suspense>

			<div className="mx-auto max-w-6xl px-6 py-16 text-[#0b0b0f]">
				<section className="max-w-4xl">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
						The Vercel Daily
					</p>

					<h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
						News and insights for modern web developers.
					</h1>

					<p className="mt-6 max-w-2xl text-lg text-neutral-600">
						Changelogs, engineering deep dives, customer stories, and community
						updates - all in one place.
					</p>

					<div className="mt-8 flex flex-wrap gap-4">
						<LoadingLink
							href="/search"
							className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
						>
							Browse articles
							<span aria-hidden>→</span>
						</LoadingLink>

						<form action={isSubscribed ? unsubscribeAction : subscribeAction}>
							<input type="hidden" name="redirectTo" value="/" />
							<HeroSubscriptionSubmitButton isSubscribed={isSubscribed} />
						</form>
					</div>
				</section>

				<section className="mt-20">
					<div className="flex items-end justify-between gap-4">
						<div>
							<h2 className="text-4xl font-bold tracking-tight sm:text-[44px]">
								Featured
							</h2>
							<p className="mt-2 text-neutral-600">
								Handpicked stories from the team.
							</p>
						</div>

						<LoadingLink
							href="/search"
							className="text-sm text-neutral-500 transition hover:text-black"
						>
							View all
						</LoadingLink>
					</div>

					<Suspense fallback={<ArticleGridSkeleton count={6} />}>
						<FeaturedArticles />
					</Suspense>
				</section>
			</div>
		</>
	);
}
