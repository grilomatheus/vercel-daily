import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";

export default function SearchLoadingPage() {
	return (
		<div className="mx-auto max-w-6xl px-6 py-16">
			<div className="h-10 w-64 animate-pulse rounded bg-neutral-200" />
			<div className="mt-4 h-5 w-96 animate-pulse rounded bg-neutral-200" />
			<div className="mt-8 h-28 animate-pulse rounded-xl bg-neutral-200" />
			<div className="mt-10">
				<ArticleGridSkeleton count={3} />
			</div>
		</div>
	);
}
