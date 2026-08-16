import React from "react";
import { Search } from "lucide-react";

function FilterSelect({ label, value, onChange, options }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wide text-text-secondary">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-border bg-bg-paper px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function JobFiltersBar({ filters, onChange }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-wide text-text-secondary">Search Jobs</span>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-paper px-3 py-2">
                    <Search size={16} className="text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Title or Keywords..."
                        value={filters.search}
                        onChange={(e) => onChange({ ...filters, search: e.target.value })}
                        className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
                    />
                </div>
            </div>

            <FilterSelect
                label="Experience Level"
                value={filters.experience}
                onChange={(v) => onChange({ ...filters, experience: v })}
                options={["All Levels", "Junior", "Mid", "Senior"]}
            />
            <FilterSelect
                label="Event Type"
                value={filters.eventType}
                onChange={(v) => onChange({ ...filters, eventType: v })}
                options={["All Events", "Wedding", "Gala", "Corporate", "Private"]}
            />
            <FilterSelect
                label="Employment Type"
                value={filters.employmentType}
                onChange={(v) => onChange({ ...filters, employmentType: v })}
                options={["All Types", "Permanent", "Temporary", "Contract"]}
            />
        </div>
    );
}