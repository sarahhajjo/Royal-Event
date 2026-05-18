import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import AccountTypeForm from './components/AccountTypeForm';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2); // الانتقال لخطوة اختيار الحساب
    };

    return (
        <div className="w-full h-screen min-h-screen bg-royal-bg flex overflow-hidden font-sans select-none">
            <HeroSection />

            <div className="w-full md:w-1/2 h-full bg-royal-dark flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-y-auto">
                <div className="my-auto max-w-md w-full mx-auto space-y-8">

                    {step === 1 ? (
                        /* الخطوة الأولى: البيانات العامة */
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-semibold text-royal-text mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Create Account
                                </h3>
                                <p className="text-xs text-royal-muted">Step into the world of Royal Events.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleNextStep}>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="First Name" placeholder="Elias" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                                    <InputField label="Last Name" placeholder="Aurelius" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                                </div>
                                <InputField label="Email Address" type="email" placeholder="elias@royalevents.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                                <InputField label="Phone Number" type="tel" placeholder="1 (555) 000-0000" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)}>
                                    <span className="text-royal-muted px-3 flex items-center text-sm border-r border-[#2a201c] order-first">+</span>
                                </InputField>
                                <InputField label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)}>
                                    <button type="button" className="absolute right-3 text-royal-muted hover:text-royal-gold transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 0116 0z" /></svg>
                                    </button>
                                </InputField>
                                <Button text="CONTINUE" />
                            </form>

                            <div className="text-center text-xs text-royal-muted pt-2">
                                <div className="relative flex justify-center items-center mb-6">
                                    <div className="absolute inset-x-0 h-[1px] bg-royal-border"></div>
                                    <span className="relative bg-royal-dark px-4 text-[#4e4639] uppercase tracking-widest text-[10px]">or</span>
                                </div>
                                <span>Already possess an account? </span>
                                <a href="#" className="text-royal-gold hover:text-royal-gold-light underline underline-offset-4 transition-colors font-medium ml-1">Sign In</a>
                            </div>
                        </div>
                    ) : (
                        /* الخطوة الثانية: اختيار نوع الحساب */
                        <AccountTypeForm onBack={() => setStep(1)} />
                    )}

                </div>

                {/* التذييل السفلي */}
                <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#4e4639] border-t border-royal-field pt-4 mt-8 space-y-2 sm:space-y-0">
                    <p>&copy; 2026 Royal Events. All rights reserved.</p>
                    <div className="flex space-x-4 uppercase tracking-wider">
                        <a href="#" className="hover:text-royal-gold transition-colors">Privacy</a>
                        <a href="#" className="hover:text-royal-gold transition-colors">Terms</a>
                        <a href="#" className="hover:text-royal-gold transition-colors">Concierge</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;