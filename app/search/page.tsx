import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArticleCard } from "@/components/article-card";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";
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
	const suspenseKey = `${q ?? ""}-${category ?? ""}`;

	return (
		<div className="mx-auto max-w-6xl px-6 py-16">
			<header>
				<h1 className="text-4xl font-bold tracking-tight">Search Articles</h1>
				<p className="mt-3 text-neutral-600">
					Find stories by keyword and category. Search state is persisted in the
					URL.
				</p>
			</header>

			<form
				action="/search"
				method="get"
				className="mt-8 grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_220px_auto_auto]"
			>
				<label className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
						Query
					</span>
					<input
						type="search"
						name="q"
						defaultValue={q}
						placeholder="Search by headline, content, or tag"
						className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none ring-black/20 transition focus:ring-2"
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
						Category
					</span>
					<select
						name="category"
						defaultValue={category ?? ""}
						className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none ring-black/20 transition focus:ring-2"
					>
						<option value="">All categories</option>
						{categories.map((option) => (
							<option key={option.slug} value={option.slug}>
								{option.name}
							</option>
						))}
					</select>
				</label>

				<button
					type="submit"
					className="h-11 self-end rounded-md bg-black px-5 text-sm font-medium text-white transition hover:opacity-90"
				>
					Search
				</button>

				<Link
					href="/search"
					className="h-11 self-end rounded-md border border-neutral-300 px-5 text-center text-sm font-medium leading-[42px] transition hover:bg-neutral-100"
				>
					Clear
				</Link>
			</form>

			<Suspense key={suspenseKey} fallback={<ArticleGridSkeleton count={3} />}>
				<SearchResults q={q} category={category} />
			</Suspense>
		</div>
	);
}
