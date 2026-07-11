const STATUS_STYLES = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    "under review": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    withdrawn: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function OfferStatusBadge({ status }) {
    const s = status.toLowerCase();
    return (
        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${STATUS_STYLES[s] || STATUS_STYLES.withdrawn}`}>
            {status}
        </span>
    );
}