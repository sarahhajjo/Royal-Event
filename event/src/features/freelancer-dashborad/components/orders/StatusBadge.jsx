const STYLES = {
    pending: "bg-primary/15 text-primary border-primary/30",
    confirmed: "bg-green-100 text-green-700 border-green-200", // يمكنك ربطها بـ success إذا عرفتيها
    cancelled: "bg-gray-100 text-text-secondary border-border",
    rejected: "bg-red-100 text-red-600 border-red-200",
};

export default function StatusBadge({ status }) {
    return (
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${STYLES[status] || ""}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}