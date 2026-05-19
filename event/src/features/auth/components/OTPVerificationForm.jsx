import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';

function OTPVerificationForm({ onBack, onVerify }) {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(59);

    // عداد الوقت التنازلي لإعادة الإرسال
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // دالة للتعامل مع إدخال الأرقام والتنقل التلقائي بين الخانات
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // الانتقال للخانة التالية تلقائياً
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="space-y-8 animate-fade-in w-full">
            {/* 1. العنوان والوصف */}
            <div>
                <h3 className="text-3xl font-semibold text-royal-text mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Verify Your Account
                </h3>
                <p className="text-xs text-royal-muted leading-relaxed">
                    We have sent a 6-digit code to your email address. Please enter it below to proceed.
                </p>
            </div>

            {/* 2. شريط التقدم - الخط الأول مضيء (لأننا لسه في مرحلة التوثيق) */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-[2px] bg-royal-gold rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
                <div className="w-8 h-[2px] bg-royal-field-focus rounded-full"></div>
            </div>

            {/* 3. خانات الـ OTP الستة المصممة هندسياً */}
            <div className="flex justify-between gap-2 pt-2">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onFocus={e => e.target.select()}
                        className="w-12 h-14 bg-royal-field text-royal-text border-2 border-royal-border rounded-[4px] text-center text-xl font-bold focus:border-royal-gold focus:bg-royal-field-focus outline-none transition-all duration-300 shadow-inner"
                    />
                ))}
            </div>

            {/* 4. زر التحقق والمتابعة */}
            <div className="space-y-6 pt-2">
                <Button
                    text="VERIFY & CONTINUE →"
                    onClick={() => onVerify(otp.join(""))}
                />

                {/* 5. خيارات إعادة الإرسال والوقت */}
                <div className="flex flex-col items-center space-y-4 text-[10px] tracking-[0.2em] uppercase font-bold">
                    <div className="text-royal-muted">
                        RESEND IN <span className="text-royal-gold ml-1">00:{timer < 10 ? `0${timer}` : timer}</span>
                    </div>
                    <button
                        disabled={timer > 0}
                        className={`transition-colors underline underline-offset-4 ${timer > 0 ? 'text-royal-border' : 'text-royal-gold hover:text-royal-gold-light cursor-pointer'}`}
                    >
                        RESEND CODE
                    </button>
                </div>
            </div>

            {/* زر الرجوع */}
            <div className="text-center">
                <button onClick={onBack} className="text-[10px] text-royal-muted hover:text-royal-text transition-colors uppercase tracking-[0.2em] font-semibold underline underline-offset-4">
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default OTPVerificationForm;