import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";

export default function ArticleLoadingPage() {
	return (
		<div className="mx-auto grid max-w-6xl gap-14 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
			<div className="space-y-6">
				<div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
				<div className="h-14 w-5/6 animate-pulse rounded bg-neutral-200" />
				<div className="h-5 w-44 animate-pulse rounded bg-neutral-200" />
				<div className="aspect-[16/10] animate-pulse rounded-2xl bg-neutral-200" />
				<div className="h-5 w-full animate-pulse rounded bg-neutral-200" />
				<div className="h-5 w-11/12 animate-pulse rounded bg-neutral-200" />
				<div className="h-5 w-4/5 animate-pulse rounded bg-neutral-200" />
			</div>
			<div>
				<ArticleGridSkeleton count={2} />
			</div>
		</div>
	);
}
