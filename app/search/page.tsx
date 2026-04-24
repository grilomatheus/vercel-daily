import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleCard } from "@/components/article-card";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";
import { SearchForm } from "@/components/search-form";
import { getArticles, getCategories } from "@/lib/api";

type SearchPageProps = {
	searchParams: Promise<{
		q?: string;
		category?: string;
	}>;
};

type SearchResultsProps = {
	q?: string;
	category?: string;
};

export const metadata: Metadata = {
	title: "Search",
	description: "Search and filter articles by keyword or category.",
	openGraph: {
		title: "Search | Vercel Daily",
		description: "Search and filter articles by keyword or category.",
	},
};

function sanitizeParam(value: string | undefined) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

async function SearchResults({ q, category }: SearchResultsProps) {
	const hasFilters = Boolean(q || category);
	const articles = await getArticles({
		q,
		category,
		limit: 5,
	});

	if (articles.length === 0) {
		return (
			<div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
				<h2 className="text-xl font-semibold">No results found</h2>
				<p className="mt-2 text-neutral-600">
					Try another keyword or change the selected category.
				</p>
			</div>
		);
	}

	return (
		<section className="mt-10">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-semibold tracking-tight">
					{hasFilters ? "Search results" : "Recent articles"}
				</h2>
				<p className="text-sm text-neutral-500">{articles.length} shown</p>
			</div>
			<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
				{articles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</div>
		</section>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const params = await searchParams;
	const q = sanitizeParam(params.q);
	const category = sanitizeParam(params.category);
	const categories = await getCategories();
	const searchStateKey = `${q ?? ""}-${category ?? ""}`;

	return (
		<div className="mx-auto max-w-6xl px-6 py-16">
			<header>
				<h1 className="text-4xl font-bold tracking-tight">Search Articles</h1>
				<p className="mt-3 text-neutral-600">
					Find stories by keyword and category. Search state is persisted in the
					URL.
				</p>
			</header>

			<SearchForm
				key={`search-form:${searchStateKey}`}
				categories={categories}
				q={q}
				category={category}
			/>

			<Suspense
				key={`search-results:${searchStateKey}`}
				fallback={<ArticleGridSkeleton count={3} />}
			>
				<SearchResults q={q} category={category} />
			</Suspense>
		</div>
	);
}
