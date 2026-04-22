import type { Article, ArticleContentBlock } from "@/lib/api";

type ArticleContentProps = {
	article: Article;
};

function renderBlock(block: ArticleContentBlock, index: number) {
	switch (block.type) {
		case "paragraph":
			return (
				<p key={index} className="text-lg leading-8 text-neutral-800">
					{block.text}
				</p>
			);
		case "blockquote":
			return (
				<blockquote
					key={index}
					className="border-l-4 border-black pl-4 text-xl font-medium text-neutral-900"
				>
					{block.text}
				</blockquote>
			);
		case "heading":
			return block.level === 2 ? (
				<h2 key={index} className="text-3xl font-semibold tracking-tight">
					{block.text}
				</h2>
			) : (
				<h3 key={index} className="text-2xl font-semibold tracking-tight">
					{block.text}
				</h3>
			);
		case "unordered-list":
			return (
				<ul key={index} className="list-disc space-y-2 pl-6 text-lg text-neutral-800">
					{block.items.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			);
		case "ordered-list":
			return (
				<ol key={index} className="list-decimal space-y-2 pl-6 text-lg text-neutral-800">
					{block.items.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ol>
			);
		case "image":
			return (
				<figure key={index} className="space-y-3">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={block.src}
						alt={block.alt}
						className="w-full rounded-xl border border-neutral-200"
					/>
					{block.caption ? (
						<figcaption className="text-sm text-neutral-500">
							{block.caption}
						</figcaption>
					) : null}
				</figure>
			);
		default:
			return null;
	}
}

function renderFallbackBody(body: string | undefined) {
	if (!body) {
		return null;
	}

	return body.split(/\n{2,}/).map((paragraph) => (
		<p key={paragraph.slice(0, 40)} className="text-lg leading-8 text-neutral-800">
			{paragraph}
		</p>
	));
}

export function ArticleContent({ article }: ArticleContentProps) {
	if (article.contentBlocks && article.contentBlocks.length > 0) {
		return (
			<div className="space-y-8">
				{article.contentBlocks.map((block, index) => renderBlock(block, index))}
			</div>
		);
	}

	return <div className="space-y-8">{renderFallbackBody(article.body)}</div>;
}
