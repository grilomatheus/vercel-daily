import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";

export default function LoadingPage() {
	return (
		<div className="mx-auto max-w-6xl px-6 py-16">
			<div className="space-y-6">
				<div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
				<div className="h-16 w-full max-w-3xl animate-pulse rounded bg-neutral-200" />
				<div className="h-6 w-full max-w-2xl animate-pulse rounded bg-neutral-200" />
				<div className="flex gap-4">
					<div className="h-12 w-40 animate-pulse rounded-md bg-neutral-200" />
					<div className="h-12 w-32 animate-pulse rounded-md bg-neutral-200" />
				</div>
			</div>

			<div className="mt-20">
				<ArticleGridSkeleton count={6} />
			</div>
		</div>
	);
}
