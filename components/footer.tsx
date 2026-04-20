const COPYRIGHT_YEAR = new Date().getUTCFullYear();

export function Footer() {
	return (
		<footer className="mt-16 border-t border-[var(--border)] bg-[#f3f3f3]">
			<div className="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-500">
				&copy; {COPYRIGHT_YEAR} Vercel Daily
			</div>
		</footer>
	);
}
