import React from 'react';
import Button from '../../../components/Button';

function AccountTypeForm({ onBack }) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h3 className="text-3xl font-semibold text-royal-text mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Account Type
                </h3>
                <p className="text-xs text-royal-muted">Select how you wish to partner with Royal Events.</p>
            </div>

            <div className="space-y-4">
                {/* خيار الشركة */}
                <div className="p-4 bg-royal-field border border-royal-border hover:border-royal-gold rounded-[4px] cursor-pointer transition-all">
                    <h4 className="text-royal-text font-semibold text-sm mb-1">Company / Provider</h4>
                    <p className="text-xs text-royal-muted">For established event services, venues, and agencies.</p>
                </div>

                {/* خيار المستقل */}
                <div className="p-4 bg-royal-field border border-royal-border hover:border-royal-gold rounded-[4px] cursor-pointer transition-all">
                    <h4 className="text-royal-text font-semibold text-sm mb-1">Freelancer / Independent</h4>
                    <p className="text-xs text-royal-muted">For individual photographers, DJs, stylists, and coordinators.</p>
                </div>
            </div>

            <div className="flex space-x-4">
                <button type="button" onClick={onBack} className="w-1/3 border border-royal-border text-royal-muted hover:text-royal-text rounded-[4px] text-xs tracking-widest font-bold">
                    BACK
                </button>
                <Button text="SUBMIT" className="w-2/3" />
            </div>
        </div>
    );
}

export default AccountTypeForm;