const TABS = [
    { key: "active",    label: "Active" },    // الحالة: approved
    { key: "pending",   label: "Pending" },   // الحالة: pending_approval
    { key: "draft",     label: "Draft" },     // الحالة: draft
    { key: "cancelled", label: "Cancelled" }, // الحالة: cancelled
    { key: "rejected",  label: "Rejected" },  // الحالة: rejected
];
export default function OfferTabs({ activeTab, onChange, counts = {} }) {
    return (
        <div className="flex items-center gap-8 border-b border-border px-1 mb-8">
            {TABS.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={() => onChange(tab.key)}
                    className={`relative pb-4 text-sm font-medium transition-colors ${
                        activeTab === tab.key ? "text-primary" : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                    {tab.label} ({counts[tab.key] || 0})
                    {activeTab === tab.key && (
                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary animate-fade-in" />
                    )}
                </button>
            ))}
        </div>
    );
}