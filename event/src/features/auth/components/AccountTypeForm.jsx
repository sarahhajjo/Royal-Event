import React, { useState } from 'react';
import Button from '../../../components/Button';

function AccountTypeForm({ onBack, onContinue }) {
    // كود الـ State لتخزين الكرت المختار (freelancer أو company)
    const [selectedType, setSelectedType] = useState('freelancer');

    return (
        <div className="space-y-8 animate-fade-in w-full">

            {/* 1. رأس الصفحة والوصف الفاخر */}
            <div>
                <h3
                    className="text-3xl font-semibold text-royal-text mb-2 tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Select Account Type
                </h3>
                <p className="text-xs text-royal-muted leading-relaxed max-w-sm">
                    Please select the membership category that suits your professional needs for a bespoke and exclusive experience.
                </p>
            </div>

            {/* 2. مؤشر شريط التقدم (Progress Indicators) */}
            <div className="flex items-center space-x-2 pt-1">
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-gold rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
            </div>

            {/* 3. حاوية كروت اختيار نوع الحساب */}
            <div className="grid grid-cols-2 gap-4 pt-2">

                {/* كرت المستقل (Freelancer Card) */}
                <div
                    onClick={() => setSelectedType('freelancer')}
                    className={`group relative flex flex-col items-center text-center p-6 bg-royal-field rounded-[4px] cursor-pointer transition-all duration-300 min-h-[220px] justify-center border-2 ${
                        selectedType === 'freelancer'
                            ? 'border-royal-gold bg-royal-field-focus shadow-xl shadow-black/30'
                            : 'border-royal-border hover:border-royal-gold/40'
                    }`}
                >
                    {/* أيقونة المستقل الفنية الهندسية */}
                    <div className={`p-3 rounded-[4px] mb-4 transition-colors duration-300 ${
                        selectedType === 'freelancer' ? 'bg-royal-gold text-royal-dark' : 'bg-royal-field-focus text-royal-gold'
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.435.789-.435.961 0l1.96 4.94a1 1 0 00.754.548l5.328.43c.474.038.663.62.319.954l-3.99 3.877a1 1 0 00-.288.886l1.11 5.293c.099.47-.404.835-.812.593L12 18.054l-4.73 2.872c-.409.248-.912-.117-.812-.593l1.11-5.293a1 1 0 00-.288-.886l-3.99-3.877c-.344-.333-.155-.916.319-.954l5.328-.43a1 1 0 00.754-.548l1.96-4.94z" />
                        </svg>
                    </div>

                    <h4 className="text-royal-text font-semibold text-base mb-2">Freelancer</h4>
                    <p className="text-[11px] text-royal-muted leading-relaxed px-2">
                        For independent creators and professionals managing their business with exceptional flexibility and creativity.
                    </p>
                </div>

                {/* كرت الشركة (Company Card) */}
                <div
                    onClick={() => setSelectedType('company')}
                    className={`group relative flex flex-col items-center text-center p-6 bg-royal-field rounded-[4px] cursor-pointer transition-all duration-300 min-h-[220px] justify-center border-2 ${
                        selectedType === 'company'
                            ? 'border-royal-gold bg-royal-field-focus shadow-xl shadow-black/30'
                            : 'border-royal-border hover:border-royal-gold/40'
                    }`}
                >
                    {/* أيقونة الشركة الكلاسيكية */}
                    <div className={`p-3 rounded-[4px] mb-4 transition-colors duration-300 ${
                        selectedType === 'company' ? 'bg-royal-gold text-royal-dark' : 'bg-royal-field-focus text-royal-gold'
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21m16.5 0H3.75" />
                        </svg>
                    </div>

                    <h4 className="text-royal-text font-semibold text-base mb-2">Company</h4>
                    <p className="text-[11px] text-royal-muted leading-relaxed px-2">
                        For large institutions and companies looking for integrated management solutions and multi-permission teams.
                    </p>
                </div>

            </div>

            {/* 4. أزرار المتابعة والرجوع */}
            <div className="space-y-4 pt-2">
                {/* استخدام زر الـ Button الفاخر المشترك الذي أرسلتِه كمكون */}
                <Button
                    text="CONTINUE"
                    onClick={(e) => {
                        e.preventDefault();
                        if (onContinue) onContinue(selectedType);
                    }}
                />

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-[11px] text-royal-muted hover:text-royal-text transition-colors uppercase tracking-[0.2em] font-semibold cursor-pointer underline underline-offset-4"
                    >
                        Go Back
                    </button>
                </div>
            </div>

        </div>
    );
}

export default AccountTypeForm;