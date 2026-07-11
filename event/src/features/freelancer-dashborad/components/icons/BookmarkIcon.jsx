export default function BookmarkIcon({ className = "" }) {
    return (
        <button
            type="button"
            aria-label="Save order"
            className={`h-9 w-9 shrink-0 rounded-md border border-border bg-bg-paper text-primary/70 transition-colors hover:bg-bg-default ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mx-auto h-4 w-4">
                <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" />
            </svg>
        </button>
    );
}