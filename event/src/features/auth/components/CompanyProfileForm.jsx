import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';

function CompanyProfileForm({ onBack, onSubmit }) {
    const [companyData, setCompanyData] = useState({
        companyName: '',
        crNumber: '',
        category: '',
        location: '', // هذا الحقل سيخزن المنطقة المختارة
        contactName: '',
        position: '',
        agreeToTerms: false
    });

    // مصفوفة المناطق مستخرجة بالكامل من الـ Seeder المرفق باللغة الإنجليزية للتوافق مع الواجهة
    const damascusDistricts = [
        { name_ar: 'المزة', name_en: 'Mezzeh' },
        { name_ar: 'مشروع دمر', name_en: 'Dummar Project' },
        { name_ar: 'كفرسوسة', name_en: 'Kfar Souseh' },
        { name_ar: 'الشعلان', name_en: 'Shaalan' },
        { name_ar: 'القصاع', name_en: 'Al-Qassaa' },
        { name_ar: 'باب توما', name_en: 'Bab Touma' },
        { name_ar: 'التجارة', name_en: 'Al-Tijarah' },
        { name_ar: 'الميدان', name_en: 'Al-Midan' },
        { name_ar: 'البرامكة', name_en: 'Al-Baramkeh' },
        { name_ar: 'المالكي', name_en: 'Al-Malki' },
        { name_ar: 'الروضة', name_en: 'Al-Rawda' },
        { name_ar: 'أبو رمانة', name_en: 'Abu Rummaneh' },
        { name_ar: 'المهاجرين', name_en: 'Al-Muhajirin' },
        { name_ar: 'الركن الدين', name_en: 'Rukn Al-Din' },
        { name_ar: 'الصالحية', name_en: 'Al-Salihiyah' },
        { name_ar: 'المزرعة', name_en: 'Al-Mazraa' },
        { name_ar: 'العدوي', name_en: 'Al-Adawi' },
        { name_ar: 'القصور', name_en: 'Al-Qusour' },
        { name_ar: 'برزة', name_en: 'Barzeh' },
        { name_ar: 'القابون', name_en: 'Al-Qaboun' },
        { name_ar: 'القدم', name_en: 'Al-Qadam' },
        { name_ar: 'الزاهرة', name_en: 'Al-Zahira' },
        { name_ar: 'دمر البلد', name_en: 'Dummar' },
        { name_ar: 'قدسيا (الضاحية)', name_en: 'Dahiyat Qudsaya' },
        { name_ar: 'كفرسوسة اللوان', name_en: 'Kfar Souseh Al-Lawan' },
        { name_ar: 'المزة فيلات شرقية', name_en: 'Mezzeh Eastern Villas' },
        { name_ar: 'المزة فيلات غربية', name_en: 'Mezzeh Western Villas' },
        { name_ar: 'المزة 86', name_en: 'Mezzeh 86' }
    ];

    const handleChange = (field, value) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (!companyData.agreeToTerms) {
            alert("Please verify the information and agree to the Terms of Service to proceed.");
            return;
        }
        if (onSubmit) onSubmit(companyData);
    };

    return (
        <div className="space-y-6 animate-fade-in w-full">

            {/* 1. رأس الصفحة */}
            <div>
                <h3 className="text-3xl font-semibold text-royal-text mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Complete Company Profile
                </h3>
                <p className="text-xs text-royal-muted leading-relaxed">
                    Enter your legal and operational details to finalize your corporate membership.
                </p>
            </div>

            {/* 2. شريط التقدم الرفيع */}
            <div className="flex items-center space-x-2 pt-1">
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-gold rounded-full"></div>
            </div>

            {/* 3. الاستمارة التخصصية */}
            <form className="space-y-5 pt-2" onSubmit={handleSubmitForm}>

                {/* صف: اسم الشركة والرقم السجل التجاري */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Brand/Stage Name"
                        placeholder="Royal Events Ltd"
                        value={companyData.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                    <InputField
                        label="CR Number"
                        placeholder="1010XXXXXX"
                        value={companyData.crNumber}
                        onChange={(e) => handleChange('crNumber', e.target.value)}
                    />
                </div>

                {/* حقل اختيار تخصص الشركة */}
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">
                        Service Categories
                    </label>
                    <div className="relative w-full bg-royal-field rounded-[4px] flex items-center">
                        <select
                            value={companyData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full bg-transparent text-royal-text border-b-2 border-transparent focus:border-royal-gold focus:bg-royal-field-focus outline-none rounded-[4px] p-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-royal-dark text-royal-muted">Select category</option>
                            <option value="catering" className="bg-royal-dark text-royal-text">Catering & Hospitality</option>
                            <option value="furniture" className="bg-royal-dark text-royal-text">Furniture Rental</option>
                            <option value="sound_light" className="bg-royal-dark text-royal-text">Sound & Lighting</option>
                            <option value="venue" className="bg-royal-dark text-royal-text">Venues & Halls</option>
                        </select>
                        <span className="absolute right-3 pointer-events-none text-royal-muted text-xs">▼</span>
                    </div>
                </div>

                {/* 💡 حقل القائمة المنسدلة المحدث للموقع (Combobox / Select) */}
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">
                        Headquarters Location (Damascus)
                    </label>
                    <div className="relative w-full bg-royal-field rounded-[4px] flex items-center">
                        <select
                            value={companyData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full bg-transparent text-royal-text border-b-2 border-transparent focus:border-royal-gold focus:bg-royal-field-focus outline-none rounded-[4px] p-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-royal-dark text-royal-muted">Select business district</option>
                            {damascusDistricts.map((district, index) => (
                                <option
                                    key={index}
                                    value={district.name_en}
                                    className="bg-royal-dark text-royal-text"
                                >
                                    {district.name_en} — {district.name_ar}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-3 pointer-events-none text-royal-muted text-xs">▼</span>
                    </div>
                </div>

                {/* صف: اسم المسؤول والمسمى الوظيفي */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Contact Person Name"
                        placeholder="Full Name"
                        value={companyData.contactName}
                        onChange={(e) => handleChange('contactName', e.target.value)}
                    />
                    <InputField
                        label="Position"
                        placeholder="e.g., Operations Manager"
                        value={companyData.position}
                        onChange={(e) => handleChange('position', e.target.value)}
                    />
                </div>

                {/* 4. الموافقة على الشروط */}
                <div className="flex items-start space-x-3 pt-2 text-left">
                    <input
                        type="checkbox"
                        id="companyTerms"
                        checked={companyData.agreeToTerms}
                        onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 rounded bg-royal-field border-royal-border text-royal-gold focus:ring-0 focus:ring-offset-0 cursor-pointer accent-royal-gold"
                    />
                    <label htmlFor="companyTerms" className="text-[11px] text-royal-muted leading-relaxed cursor-pointer select-none">
                        I verify that this company is a legally registered entity and I agree to the <span className="text-royal-gold underline hover:text-royal-gold-light transition-colors font-medium">Terms of Service</span>.
                    </label>
                </div>

                {/* 5. زر الإرسال الموحد */}
                <Button text="COMPLETE REGISTRATION →" />
            </form>

            {/* زر العودة */}
            <div className="text-center pt-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-[11px] text-royal-muted hover:text-royal-text transition-colors uppercase tracking-[0.2em] font-semibold cursor-pointer underline underline-offset-4"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default CompanyProfileForm;