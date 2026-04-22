import Link from "next/link";
import { getTrendingArticles } from "@/lib/api";

type TrendingArticlesProps = {
	excludeIds?: string[];
};

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

export async function TrendingArticles({ excludeIds }: TrendingArticlesProps) {
	const articles = (await getTrendingArticles({ excludeIds })).slice(0, 4);

	return (
		<section className="space-y-6">
			<h2 className="text-2xl font-semibold tracking-tight">Trending</h2>
			<div className="grid gap-6 sm:grid-cols-2">
				{articles.map((article) => (
					<article key={article.id} className="space-y-3">
						<Link href={`/articles/${article.slug}`} className="block">
							<div className="aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={article.image}
									alt={article.headline}
									className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
								/>
							</div>
						</Link>
						<p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
							{article.category} {" · "} {formatDate(article.publishDate)}
						</p>
						<Link
							href={`/articles/${article.slug}`}
							className="text-xl font-semibold tracking-tight hover:underline"
						>
							{article.headline}
						</Link>
					</article>
				))}
			</div>
		</section>
	);
}
