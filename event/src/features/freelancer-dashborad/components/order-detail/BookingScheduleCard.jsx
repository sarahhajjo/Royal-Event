import React from 'react';

export default function BookingScheduleCard({ bookedDate, shift, createdAtHuman }) {
    return (
        <div className="bg-[#1a1714] rounded-2xl border border-border p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <h3 className="text-lg font-bold text-text-primary">Schedule</h3>
                </div>

                <div className="space-y-4 relative pl-4 border-l border-border ml-2">
                    <div>
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary"></span>
                        <p className="text-sm font-semibold text-text-primary">{bookedDate}</p>
                        <p className="text-xs text-text-secondary">
                            {shift ? `${shift.name} (${shift.start_time} - ${shift.end_time})` : "Event Day"}
                        </p>
                    </div>
                    <div>
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-text-secondary"></span>
                        <p className="text-sm font-semibold text-text-primary">Created</p>
                        <p className="text-xs text-text-secondary">{createdAtHuman || "منذ فترة"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}