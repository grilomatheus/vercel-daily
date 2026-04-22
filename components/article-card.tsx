import Link from "next/link";
import type { Article } from "@/lib/api";

type ArticleCardProps = {
	article: Article;
};

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

export function ArticleCard({ article }: ArticleCardProps) {
	return (
		<article className="group">
			<Link href={`/articles/${article.slug}`} className="block">
				<div className="aspect-[16/10] overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100">
					{article.image ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={article.image}
							alt={article.headline}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
						/>
					) : null}
				</div>

				<div className="mt-4">
					<p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
						{article.category}{" "}
						<span aria-hidden>&middot;</span>{" "}
						{formatDate(article.publishDate)}
					</p>

					<h3 className="mt-2 text-2xl font-semibold tracking-tight text-pretty group-hover:underline">
						{article.headline}
					</h3>

					{article.teaser ? (
						<p className="mt-3 line-clamp-3 text-base text-neutral-600">
							{article.teaser}
						</p>
					) : null}
				</div>
			</Link>
		</article>
	);
}
