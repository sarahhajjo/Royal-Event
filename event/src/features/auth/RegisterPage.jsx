import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import OTPVerificationForm from './components/OTPVerificationForm';
import AccountTypeForm from './components/AccountTypeForm';
import FreelancerProfileForm from './components/FreelancerProfileForm';
import CompanyProfileForm from './components/CompanyProfileForm';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState('freelancer');

    // التحديث: إضافة حقل confirmPassword لإتمام الفحص الأمني
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactInfo: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(''); // تصفير رسائل الخطأ فور بدء المستخدم في الكتابة للتصحيح
    };

    // دالة ذكية للتحقق من المدخلات (هل هي إيميل أم هاتف؟)
    const validateContactInfo = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]{7,15}$/;

        if (emailRegex.test(input.trim())) {
            return { isValid: true, type: 'email' };
        } else if (phoneRegex.test(input.trim().replace(/[\s-]/g, ''))) {
            return { isValid: true, type: 'phone' };
        }
        return { isValid: false, type: null };
    };

    // الانتقال من البيانات العامة إلى الـ OTP مع الفحص الصارم للحقول والتطابق
    const handleNextToOTP = (e) => {
        if (e) e.preventDefault();

        // 1️⃣ أولاً: منع المتابعة نهائياً إذا كان أي حقل من الحقول الخمسة فارغاً
        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.contactInfo.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError('Please fill in all elite fields before continuing.');
            return;
        }

        // 2️⃣ ثانياً: منع المتابعة إذا كانت كلمة السر وتأكيدها غير متطابقتين
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please verify your entries.');
            return;
        }

        // 3️⃣ ثالثاً: فحص صلاحية الإيميل أو رقم الهاتف المدمج
        const checkInput = validateContactInfo(formData.contactInfo);

        if (!checkInput.isValid) {
            setError('Please enter a valid Email Address or Phone Number.');
            return;
        }

        // إذا اجتازت كل الشروط، يتم التصفير والانتقال للخطوة التالية بأمان
        setError('');
        console.log(`User identifier type detected as: ${checkInput.type}`);
        setStep(2);
    };

    const handleVerifyOTP = (code) => {
        console.log("Verifying OTP:", code);
        setStep(3);
    };

    const handleAccountTypeSelection = (selectedType) => {
        setAccountType(selectedType);
        if (selectedType === 'freelancer') setStep(4);
        else if (selectedType === 'company') setStep(5);
    };

    const handleFinalSubmit = (profileData) => {
        const checkInput = validateContactInfo(formData.contactInfo);
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            [checkInput.type]: formData.contactInfo,
            accountType,
            ...profileData
        };
        console.log("Final Registration Payload:", payload);
        alert("Registration Complete!");
    };

    return (
        <div className="w-full h-screen min-h-screen bg-royal-bg flex overflow-hidden font-sans select-none">
            {/* القسم الأيسر الفاخر */}
            <HeroSection />

            {/* القسم الأيمن التفاعلي */}
            <div className="w-full md:w-1/2 h-full bg-royal-dark flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-y-auto">
                <div className="my-auto max-w-md w-full mx-auto space-y-8">

                    {/* Step 1: General Info */}
                    {step === 1 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h3 className="text-3xl font-semibold text-royal-text mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h3>
                                <p className="text-xs text-royal-muted">Step into the world of Royal Events.</p>
                            </div>
                            <div className="flex items-center space-x-2 pt-1">
                                <div className="w-8 h-[2px] bg-royal-gold rounded-full"></div>
                                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                            </div>

                            <form className="space-y-5" onSubmit={handleNextToOTP}>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="First Name" placeholder="Elias" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                                    <InputField label="Last Name" placeholder="Aurelius" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                                </div>

                                <InputField
                                    label="Email Address or Phone Number"
                                    type="text"
                                    placeholder="elias@royalevents.com or +15550000000"
                                    value={formData.contactInfo}
                                    onChange={(e) => handleChange('contactInfo', e.target.value)}
                                />

                                <InputField label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)}>
                                    <button type="button" className="absolute right-3 text-royal-muted hover:text-royal-gold transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 0116 0z" /></svg>
                                    </button>
                                </InputField>

                                {/* 💡 حقل تأكيد كلمة السر الجديد والمبني على نفس الهوية البصرية */}
                                <InputField label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)}>
                                    <button type="button" className="absolute right-3 text-royal-muted hover:text-royal-gold transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 0116 0z" /></svg>
                                    </button>
                                </InputField>

                                {/* رسالة خطأ ديناميكية في حال النسيان أو عدم التطابق */}
                                {error && (
                                    <p className="text-xs text-red-400 font-medium tracking-wide bg-red-950/30 border border-red-900/50 p-3 rounded-[4px] animate-fade-in">
                                        {error}
                                    </p>
                                )}

                                <Button text="CONTINUE" />
                            </form>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <OTPVerificationForm
                            onBack={() => setStep(1)}
                            onVerify={handleVerifyOTP}
                        />
                    )}

                    {/* Step 3: Account Type Selection */}
                    {step === 3 && (
                        <AccountTypeForm
                            onBack={() => setStep(2)}
                            onContinue={handleAccountTypeSelection}
                        />
                    )}

                    {/* Step 4: Freelancer Form */}
                    {step === 4 && (
                        <FreelancerProfileForm
                            onBack={() => setStep(3)}
                            onSubmit={handleFinalSubmit}
                        />
                    )}

                    {/* Step 5: Company Form */}
                    {step === 5 && (
                        <CompanyProfileForm
                            onBack={() => setStep(3)}
                            onSubmit={handleFinalSubmit}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#4e4639] border-t border-royal-field pt-4 mt-8">
                    <p>&copy; 2026 Royal Events International. All rights reserved.</p>
                    <div className="flex space-x-4 uppercase tracking-wider">
                        <a href="#" className="hover:text-royal-gold transition-colors">Help Center</a>
                        <a href="#" className="hover:text-royal-gold transition-colors">Privacy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;