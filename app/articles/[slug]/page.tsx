import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { subscribeAction } from "@/app/actions/subscription";
import { ArticleContent } from "@/components/article-content";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";
import { TrendingArticles } from "@/components/trending-articles";
import { getArticleBySlug } from "@/lib/api";
import { getSubscriptionState } from "@/lib/subscription";

type ArticlePageProps = {
	params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

function getTeaserText(article: Awaited<ReturnType<typeof getArticleBySlug>>) {
	if (article.teaser) {
		return article.teaser;
	}

	const firstParagraph = article.contentBlocks?.find(
		(block) => block.type === "paragraph"
	);

	if (firstParagraph && "text" in firstParagraph) {
		return firstParagraph.text;
	}

	return article.body?.split(/\n{2,}/)[0] ?? "Subscribe to read this article.";
}

export async function generateMetadata({
	params,
}: ArticlePageProps): Promise<Metadata> {
	const { slug } = await params;

	try {
		const article = await getArticleBySlug(slug);
		const description = article.teaser ?? "Read the full story on Vercel Daily.";

		return {
			title: article.headline,
			description,
			openGraph: {
				title: article.headline,
				description,
				images: article.image ? [{ url: article.image }] : undefined,
				type: "article",
			},
		};
	} catch {
		return {
			title: "Article",
			description: "Read this story on Vercel Daily.",
		};
	}
}

export default async function ArticlePage({ params }: ArticlePageProps) {
	const { slug } = await params;
	let article: Awaited<ReturnType<typeof getArticleBySlug>>;

	try {
		article = await getArticleBySlug(slug);
	} catch (error) {
		if (error instanceof Error && error.message === "NOT_FOUND") {
			notFound();
		}
		throw error;
	}

	const requestHeaders = await headers();
	const accessHint = requestHeaders.get("x-vercel-daily-access");
	const subscription = accessHint === "subscriber"
		? await getSubscriptionState()
		: { isSubscribed: false };
	const isSubscribed = subscription.isSubscribed;
	const teaser = getTeaserText(article);
	const articlePath = `/articles/${slug}`;

	return (
		<div className="mx-auto grid max-w-6xl gap-14 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
			<article>
				<p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
					{article.category} {" · "} {formatDate(article.publishDate)}
				</p>
				<h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
					{article.headline}
				</h1>
				{article.author ? (
					<p className="mt-3 text-sm text-neutral-600">By {article.author}</p>
				) : null}

				<div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={article.image}
						alt={article.headline}
						className="h-full w-full object-cover"
					/>
				</div>

				<div className="mt-10">
					{isSubscribed ? (
						<ArticleContent article={article} />
					) : (
						<div className="space-y-8">
							<p className="text-lg leading-8 text-neutral-800">{teaser}</p>
							<div className="rounded-2xl border border-neutral-200 bg-white p-8">
								<h2 className="text-2xl font-semibold tracking-tight">
									This story is for subscribers
								</h2>
								<p className="mt-3 text-neutral-600">
									Subscribe to unlock the full article and read all premium
									content from Vercel Daily.
								</p>
								<form action={subscribeAction} className="mt-6">
									<input type="hidden" name="redirectTo" value={articlePath} />
									<button
										type="submit"
										className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
									>
										Subscribe now
									</button>
								</form>
							</div>
						</div>
					)}
				</div>
			</article>

			<aside className="space-y-6">
				{!isSubscribed ? (
					<div className="rounded-xl border border-neutral-200 bg-white p-5">
						<h2 className="text-lg font-semibold">Subscribe for full access</h2>
						<p className="mt-2 text-sm text-neutral-600">
							Get unrestricted access to all articles and publication updates.
						</p>
						<form action={subscribeAction} className="mt-4">
							<input type="hidden" name="redirectTo" value={articlePath} />
							<button
								type="submit"
								className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white"
							>
								Subscribe
							</button>
						</form>
					</div>
				) : null}

				<Suspense fallback={<ArticleGridSkeleton count={2} />}>
					<TrendingArticles excludeIds={[article.id]} />
				</Suspense>
			</aside>
		</div>
	);
}
