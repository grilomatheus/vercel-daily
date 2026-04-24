"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useNavigationFeedback } from "@/components/navigation-feedback";
import type { Category } from "@/lib/api";

type SearchFormProps = {
	categories: Category[];
	q?: string;
	category?: string;
};

function buildSearchHref(q: string, category: string) {
	const params = new URLSearchParams();
	const query = q.trim();

	if (query) {
		params.set("q", query);
	}

	if (category) {
		params.set("category", category);
	}

	const queryString = params.toString();
	return queryString ? `/search?${queryString}` : "/search";
}

function Spinner() {
	return (
		<span
			aria-hidden
			className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
		/>
	);
}

export function SearchForm({ categories, q, category }: SearchFormProps) {
	const router = useRouter();
	const { start } = useNavigationFeedback();
	const [query, setQuery] = useState(q ?? "");
	const [selectedCategory, setSelectedCategory] = useState(category ?? "");
	const [submitting, setSubmitting] = useState(false);
	const hadQueryRef = useRef(Boolean(q));

	useEffect(() => {
		if (!submitting) {
			return;
		}

		const timeout = window.setTimeout(() => setSubmitting(false), 10000);
		return () => window.clearTimeout(timeout);
	}, [submitting]);

	function navigate(nextQuery: string, nextCategory: string) {
		const nextHref = buildSearchHref(nextQuery, nextCategory);
		const currentHref = `${window.location.pathname}${window.location.search}`;

		if (nextHref === currentHref) {
			setSubmitting(false);
			return;
		}

		setSubmitting(true);
		start();
		router.push(nextHref);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		navigate(query, selectedCategory);
	}

	function handleQueryChange(value: string) {
		setQuery(value);

		if (value) {
			hadQueryRef.current = true;
			return;
		}

		if (hadQueryRef.current) {
			hadQueryRef.current = false;
			setSelectedCategory("");
			navigate("", "");
		}
	}

	return (
		<form
			action="/search"
			method="get"
			onSubmit={handleSubmit}
			className="mt-8 grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_220px_auto_auto]"
		>
			<label className="flex flex-col gap-2">
				<span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
					Query
				</span>
				<input
					type="search"
					name="q"
					value={query}
					onChange={(event) => handleQueryChange(event.currentTarget.value)}
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
					value={selectedCategory}
					onChange={(event) => setSelectedCategory(event.currentTarget.value)}
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
				disabled={submitting}
				className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-md bg-black px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
			>
				{submitting ? (
					<>
						<Spinner />
						Searching
					</>
				) : (
					"Search"
				)}
			</button>

			<button
				type="button"
				onClick={() => {
					setQuery("");
					setSelectedCategory("");
					navigate("", "");
				}}
				className="h-11 self-end rounded-md border border-neutral-300 px-5 text-sm font-medium transition hover:bg-neutral-100 disabled:cursor-wait"
				disabled={submitting}
			>
				Clear
			</button>
		</form>
	);
}
