type ArticleGridSkeletonProps = {
	count?: number;
};

export function ArticleGridSkeleton({ count = 3 }: ArticleGridSkeletonProps) {
	return (
		<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className="animate-pulse space-y-4">
					<div className="aspect-[16/10] rounded-xl bg-neutral-200" />
					<div className="h-3 w-1/3 rounded bg-neutral-200" />
					<div className="h-8 w-4/5 rounded bg-neutral-200" />
					<div className="h-4 w-full rounded bg-neutral-200" />
					<div className="h-4 w-11/12 rounded bg-neutral-200" />
				</div>
			))}
		</div>
	);
}
