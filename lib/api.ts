import { cacheLife, cacheTag } from "next/cache";

const API_BASE_URL = process.env.API_BASE_URL;
const API_BYPASS_TOKEN =
	process.env.API_BYPASS_TOKEN ?? process.env.API_PASSWORD;

if (!API_BASE_URL) {
	throw new Error("API_BASE_URL is not defined.");
}

if (!API_BYPASS_TOKEN) {
	throw new Error("API_BYPASS_TOKEN is not defined.");
}

const VERCEL_BYPASS_TOKEN = API_BYPASS_TOKEN;

const NORMALIZED_API_BASE_URL = API_BASE_URL.endsWith("/")
	? API_BASE_URL
	: `${API_BASE_URL}/`;

type QueryParams = {
	q?: string;
	category?: string;
	limit?: number;
	featured?: boolean;
	exclude?: string[];
};

type ApiError = {
	code?: string;
	message?: string;
};

type ApiEnvelope<T> = {
	success: boolean;
	data: T;
	error?: ApiError;
};

export type ArticleContentBlock =
	| {
			type: "paragraph" | "blockquote";
			text: string;
	  }
	| {
			type: "heading";
			level: 2 | 3;
			text: string;
	  }
	| {
			type: "unordered-list" | "ordered-list";
			items: string[];
	  }
	| {
			type: "image";
			src: string;
			alt: string;
			caption?: string;
	  };

type ApiArticle = {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	content?: ArticleContentBlock[];
	category: string;
	publishedAt: string;
	image: string;
	author?: {
		name: string;
		avatar?: string;
	};
};

type ApiCategory = {
	slug: string;
	name: string;
	articleCount: number;
};

type ApiBreakingNews = {
	headline: string;
	articleId?: string;
};

type ApiSubscription = {
	token: string;
	status: "active" | "inactive";
	subscribedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
};

function buildUrl(path: string, params?: QueryParams) {
	const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
	const url = new URL(normalizedPath, NORMALIZED_API_BASE_URL);

	if (params?.q) {
		url.searchParams.set("search", params.q);
	}

	if (params?.category) {
		url.searchParams.set("category", params.category);
	}

	if (typeof params?.limit === "number") {
		url.searchParams.set("limit", String(params.limit));
	}

	if (typeof params?.featured === "boolean") {
		url.searchParams.set("featured", String(params.featured));
	}

	if (params?.exclude && params.exclude.length > 0) {
		url.searchParams.set("exclude", params.exclude.join(","));
	}

	return url.toString();
}

function getAuthHeaders(subscriptionToken?: string): Record<string, string> {
	const headers: Record<string, string> = {
		"x-vercel-protection-bypass": VERCEL_BYPASS_TOKEN,
	};

	if (subscriptionToken) {
		headers["x-subscription-token"] = subscriptionToken;
	}

	return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
	let payload: unknown = null;

	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		const errorMessage =
			typeof payload === "object" &&
			payload !== null &&
			"error" in payload &&
			typeof payload.error === "object" &&
			payload.error !== null &&
			"message" in payload.error &&
			typeof payload.error.message === "string"
				? payload.error.message
				: null;

		throw new Error(
			errorMessage
				? `API request failed: ${response.status} - ${errorMessage}`
				: `API request failed: ${response.status}`
		);
	}

	if (
		typeof payload === "object" &&
		payload !== null &&
		"data" in payload &&
		"success" in payload
	) {
		return (payload as ApiEnvelope<T>).data;
	}

	if (payload === null) {
		throw new Error("API response body is empty.");
	}

	return payload as T;
}

function formatCategory(slug: string) {
	return slug
		.split("-")
		.map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
		.join(" ");
}

function blocksToText(blocks: ArticleContentBlock[] | undefined) {
	if (!blocks || blocks.length === 0) {
		return undefined;
	}

	return blocks
		.map((block) => {
			if ("text" in block) {
				return block.text;
			}

			if ("items" in block) {
				return block.items.join("\n");
			}

			if (block.type === "image") {
				return block.caption ?? block.alt;
			}

			return "";
		})
		.filter(Boolean)
		.join("\n\n");
}

function mapArticle(article: ApiArticle): Article {
	return {
		id: article.id,
		slug: article.slug,
		headline: article.title,
		category: formatCategory(article.category),
		categorySlug: article.category,
		publishDate: article.publishedAt,
		image: article.image,
		author: article.author?.name,
		body: blocksToText(article.content),
		contentBlocks: article.content,
		teaser: article.excerpt,
	};
}

function mapSubscription(subscription: ApiSubscription): Subscription {
	return {
		token: subscription.token,
		status: subscription.status,
		subscribedAt: subscription.subscribedAt ?? null,
	};
}

export type Article = {
	id: string;
	slug: string;
	headline: string;
	category: string;
	categorySlug: string;
	publishDate: string;
	image: string;
	author?: string;
	body?: string;
	contentBlocks?: ArticleContentBlock[];
	teaser?: string;
};

export type Category = {
	id: string;
	name: string;
	slug: string;
};

export type BreakingNews = {
	headline: string;
	slug?: string;
};

export type Subscription = {
	token: string;
	status: "active" | "inactive";
	subscribedAt: string | null;
};

export async function getArticles(params?: QueryParams): Promise<Article[]> {
	"use cache";
	cacheTag("articles");
	cacheLife("minutes");

	const response = await fetch(buildUrl("/articles", params), {
		headers: getAuthHeaders(),
	});

	const articles = await handleResponse<ApiArticle[]>(response);
	return articles.map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article> {
	"use cache";
	cacheTag("articles");
	cacheTag(`article:${slug}`);
	cacheLife("hours");

	const response = await fetch(buildUrl(`/articles/${slug}`), {
		headers: getAuthHeaders(),
	});

	if (response.status === 404) {
		throw new Error("NOT_FOUND");
	}

	const article = await handleResponse<ApiArticle>(response);
	return mapArticle(article);
}

export async function getTrendingArticles(options?: {
	excludeIds?: string[];
}): Promise<Article[]> {
	const response = await fetch(
		buildUrl("/articles/trending", {
			exclude: options?.excludeIds,
		}),
		{
			headers: getAuthHeaders(),
			cache: "no-store",
		}
	);

	const articles = await handleResponse<ApiArticle[]>(response);
	return articles.map(mapArticle);
}

export async function getCategories(): Promise<Category[]> {
	"use cache";
	cacheTag("categories");
	cacheLife("days");

	const response = await fetch(buildUrl("/categories"), {
		headers: getAuthHeaders(),
	});

	const categories = await handleResponse<ApiCategory[]>(response);
	return categories.map((category) => ({
		id: category.slug,
		name: category.name,
		slug: category.slug,
	}));
}

export async function getBreakingNews(): Promise<BreakingNews> {
	const response = await fetch(buildUrl("/breaking-news"), {
		headers: getAuthHeaders(),
		cache: "no-store",
	});

	const breakingNews = await handleResponse<ApiBreakingNews>(response);
	return {
		headline: breakingNews.headline,
		slug: breakingNews.articleId,
	};
}

export async function createSubscriptionToken(): Promise<string> {
	const response = await fetch(buildUrl("/subscription/create"), {
		method: "POST",
		headers: getAuthHeaders(),
		cache: "no-store",
	});

	if (!response.ok) {
		await handleResponse<never>(response);
	}

	const token = response.headers.get("x-subscription-token");

	if (!token) {
		throw new Error("Subscription token missing in API response headers.");
	}

	return token;
}

export async function getSubscription(
	subscriptionToken: string
): Promise<Subscription | null> {
	const response = await fetch(buildUrl("/subscription"), {
		headers: getAuthHeaders(subscriptionToken),
		cache: "no-store",
	});

	if (response.status === 404) {
		return null;
	}

	const subscription = await handleResponse<ApiSubscription>(response);
	return mapSubscription(subscription);
}

export async function activateSubscription(
	subscriptionToken: string
): Promise<Subscription> {
	const response = await fetch(buildUrl("/subscription"), {
		method: "POST",
		headers: getAuthHeaders(subscriptionToken),
		cache: "no-store",
	});

	const subscription = await handleResponse<ApiSubscription>(response);
	return mapSubscription(subscription);
}

export async function deactivateSubscription(
	subscriptionToken: string
): Promise<Subscription> {
	const response = await fetch(buildUrl("/subscription"), {
		method: "DELETE",
		headers: getAuthHeaders(subscriptionToken),
		cache: "no-store",
	});

	const subscription = await handleResponse<ApiSubscription>(response);
	return mapSubscription(subscription);
}
