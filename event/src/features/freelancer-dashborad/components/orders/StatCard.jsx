export default function StatCard({ label, value, valueClassName = "" }) {
    return (
        <div className="rounded-xl border border-border bg-bg-paper p-4 text-left">
            <p className="text-xs text-text-secondary">{label}</p>
            <p className={`mt-2 text-lg font-semibold ${valueClassName}`}>{value}</p>
        </div>
    );
}