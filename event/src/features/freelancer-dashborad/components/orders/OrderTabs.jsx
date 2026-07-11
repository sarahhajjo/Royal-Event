const TABS = [
    { key: "active", label: "Active requests" },
    { key: "confirmed", label: "Confirmed" },
    { key: "pending_payment", label: "Pending payment" },
    { key: "completed", label: "Completed" },
    { key: "rejected", label: "Rejected" },
];

export default function OrderTabs({ activeTab, onChange, counts = {} }) {
    return (
        <div className="flex items-center gap-6 border-b border-border px-1">
            {TABS.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onChange(tab.key)}
                        className={`relative pb-3 text-sm transition-colors ${
                            isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {tab.label}
                        {typeof counts[tab.key] === "number" && (
                            <span className="ml-1 text-text-secondary">({counts[tab.key]})</span>
                        )}
                        {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
                    </button>
                );
            })}
        </div>
    );
}