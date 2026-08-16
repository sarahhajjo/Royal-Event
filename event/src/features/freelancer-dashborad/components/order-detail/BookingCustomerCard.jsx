import React from 'react';

export default function BookingCustomerCard({ customer }) {
    return (
        <div className="col-span-full bg-[#1a1714] rounded-2xl border border-border border-dashed p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bg-default flex items-center justify-center text-text-secondary border border-border">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                    <h4 className="text-base font-bold text-text-primary">Customer Details</h4>
                    <p className="text-sm text-text-secondary">
                        {customer ? `${customer.name} (${customer.phone || 'No phone'})` : "Guest Account (Pending Information)"}
                    </p>
                </div>
            </div>
            <p className="text-xs text-text-secondary max-w-sm text-right">
                {customer ? "Verified client account details." : "This booking is not linked to a fully registered user account. Details are restricted."}
            </p>
        </div>
    );
}