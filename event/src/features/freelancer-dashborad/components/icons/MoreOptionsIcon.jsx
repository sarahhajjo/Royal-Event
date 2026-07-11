export default function MoreOptionsIcon({ onClick, className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="خيارات إضافية"
            className={`h-9 w-9 shrink-0 rounded-md border border-border bg-bg-paper text-text-secondary transition-colors hover:bg-bg-default ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-4 w-4">
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
            </svg>
        </button>
    );
}