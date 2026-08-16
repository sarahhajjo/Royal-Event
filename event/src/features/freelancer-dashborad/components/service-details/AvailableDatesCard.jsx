import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AvailableDatesCard({
  monthLabel = "July 2026",
  dates = [],
  onPrevMonth,
  onNextMonth,
  onViewAll,
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg-paper p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Available Dates</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">{monthLabel}</span>
          <button
            onClick={onPrevMonth}
            aria-label="الشهر السابق"
            className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:bg-primary/10 hover:text-text-primary"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={onNextMonth}
            aria-label="الشهر التالي"
            className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:bg-primary/10 hover:text-text-primary"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {dates.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-secondary">
            No available dates yet
          </p>
        ) : (
          dates.map((date) => (
            <div
              key={date.id}
              className="flex items-center justify-between rounded-xl border border-border bg-bg-default p-3"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{date.dayLabel}</p>
                <p className="text-xs text-text-secondary">
                  {date.variantName ? `${date.variantName} · ` : ""}
                  {date.remainingCapacity != null
                    ? `${date.remainingCapacity} spot${date.remainingCapacity === 1 ? "" : "s"} left`
                    : "Available all day"}
                </p>
              </div>
              <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-bg-default">
                {date.timeRange}
              </span>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onViewAll}
        className="mt-4 w-full rounded-lg border border-border py-2 text-xs font-medium text-text-secondary transition hover:bg-primary/10"
      >
        View all schedules
      </button>
    </div>
  );
}
