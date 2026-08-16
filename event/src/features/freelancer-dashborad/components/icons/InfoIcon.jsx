export default function InfoIcon({ className = "" }) {
    return (
        <button
            type="button"
            aria-label="Cancellation reason"
            className={`h-9 w-9 shrink-0 rounded-md border border-border bg-bg-paper text-text-secondary transition-colors hover:bg-bg-default ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mx-auto h-4 w-4">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
            </svg>
        </button>
    );
}