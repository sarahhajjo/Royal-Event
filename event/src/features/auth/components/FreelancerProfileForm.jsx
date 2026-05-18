import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';

function FreelancerProfileForm({ onBack, onSubmit }) {
    const [profileData, setProfileData] = useState({
        brandName: '',
        specialty: '',
        experience: '0',
        idNumber: '',
        portfolio: '',
        agreeToTerms: false
    });

    const handleChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (!profileData.agreeToTerms) {
            alert("يرجى الموافقة على شروط العضوية الملكية للمتابعة.");
            return;
        }
        if (onSubmit) onSubmit(profileData);
    };

    return (
        <div className="space-y-6 animate-fade-in w-full">

            {/* 1. رأس الصفحة والوصف من الصورة */}
            <div>
                <h3 className="text-3xl font-semibold text-royal-text mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Complete Your Profile
                </h3>
                <p className="text-xs text-royal-muted leading-relaxed">
                    Provide your professional details to join our exclusive network of event experts. Each application is manually reviewed for excellence.
                </p>
            </div>

            {/* 2. شريط مؤشر التقدم - الخط الثالث مضيء بالكامل */}
            <div className="flex items-center space-x-2 pt-1">
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-gold rounded-full"></div>
            </div>

            {/* 3. الاستمارة التخصصية المحاذية برمجياً */}
            <form className="space-y-5" onSubmit={handleSubmitForm}>

                {/* صف: الاسم الفني والتخصص الأساسي */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Brand/Stage Name"
                        placeholder="e.g. Noir Studio"
                        value={profileData.brandName}
                        onChange={(e) => handleChange('brandName', e.target.value)}
                    />

                    {/* حقل التخصص المخصص المنسدل الفاخر */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-semibold text-royal-gold uppercase tracking-[0.2em]">
                            Primary Specialty
                        </label>
                        <div className="relative w-full bg-royal-field rounded-[4px] flex items-center">
                            <select
                                value={profileData.specialty}
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                className="w-full bg-transparent text-royal-text border-b-2 border-transparent focus:border-royal-gold focus:bg-royal-field-focus outline-none rounded-[4px] p-3 text-sm transition-all duration-300 appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="bg-royal-dark text-royal-muted">Select specialty</option>
                                <option value="photography" className="bg-royal-dark text-royal-text">Photography (تصوير)</option>
                                <option value="decoration" className="bg-royal-dark text-royal-text">Decoration (تزيين وديكور)</option>
                                <option value="dj" className="bg-royal-dark text-royal-text">Sound & DJ (هندسة صوت)</option>
                                <option value="coordination" className="bg-royal-dark text-royal-text">Event Coordinator (منظم)</option>
                            </select>
                            <span className="absolute right-3 pointer-events-none text-royal-muted text-xs">▼</span>
                        </div>
                    </div>
                </div>

                {/* صف: سنوات الخبرة ورقم الهوية */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="Years of Experience"
                        type="number"
                        placeholder="0"
                        value={profileData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                    />
                    <InputField
                        label="National ID / Passport Number"
                        placeholder="Enter ID number"
                        value={profileData.idNumber}
                        onChange={(e) => handleChange('idNumber', e.target.value)}
                    />
                </div>

                {/* حقل رابط معرض الأعمال الفني */}
                <InputField
                    label="Portfolio Link"
                    placeholder="https://yourportfolio.com"
                    value={profileData.portfolio}
                    onChange={(e) => handleChange('portfolio', e.target.value)}
                >
                    <span className="text-royal-muted px-3 flex items-center text-xs border-r border-[#2a201c] order-first">🔗</span>
                </InputField>

                {/* 4. كرت الموافقة والتحقق من الشروط القانونية */}
                <div className="flex items-start space-x-3 pt-2 text-right">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={profileData.agreeToTerms}
                        onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 rounded bg-royal-field border-royal-border text-royal-gold focus:ring-0 focus:ring-offset-0 cursor-pointer accent-royal-gold"
                    />
                    <label htmlFor="terms" className="text-[11px] text-royal-muted leading-relaxed cursor-pointer select-none">
                        I verify that all provided information is accurate and I agree to the <span className="text-royal-gold underline hover:text-royal-gold-light transition-colors">Royal Events Membership Terms</span>.
                    </label>
                </div>

                {/* 5. زر إتمام التسجيل النهائي الفاخر بنظام التدرج المسقول */}
                <Button text="COMPLETE REGISTRATION →" />
            </form>

            {/* زر الرجوع للخلف */}
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

export default FreelancerProfileForm;