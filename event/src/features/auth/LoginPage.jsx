import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identity: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e, fieldName) => {
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: e.target.value
        }));
        if (error) setError('');
    };

    // 💡 المحاكاة المحلية (Mock Submit): تم إيقاف السيرفر مؤقتاً للمعاينة الحرة الواجهات
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // محاكاة تأخير السيرفر الفاخرة (Loading Effect)
        setTimeout(() => {
            setLoading(false);

            // 1. التحقق من الحقول الفارغة
            if (!formData.identity.trim() || !formData.password) {
                setError('Please enter your elite credentials.');
                return;
            }

            // 2. محاكاة بيانات الفحص الخاصة بملف Postman
            if (formData.identity === '+963954635619' && formData.password === '12345678') {
                localStorage.setItem('token', 'mock_royal_token_xyz');
                navigate('/dashboard'); // الانتقال الفوري لواجهة إضافة المنتجات
            } else {
                // 3. محاكاة الرد في حال كانت البيانات خاطئة
                setError('Invalid credentials. Hint: use +963954635619 and 12345678 for mock preview.');
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#18120f] flex flex-col md:flex-row text-[#eee0da] font-sans selection:bg-royal-gold selection:text-black relative overflow-hidden">

            {/* Left Side: Elegant Editorial Visual Panel */}
            <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative overflow-hidden border-r border-[#4e4639]/30">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                     style={{
                         backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.6), rgba(24, 18, 15, 0.9)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`
                     }}
                />

                <div className="relative z-10 flex items-center space-x-2 tracking-[0.2em] text-royal-gold uppercase font-serif text-sm">
                    <span>✦ Royal Events ✦</span>
                </div>

                <div className="relative z-10 max-w-md space-y-4 text-left">
                    <h1 className="text-4xl lg:text-5xl font-serif text-royal-gold leading-tight font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Welcome to <br />
                        <span className="text-white font-normal">Bespoke Luxury</span>
                    </h1>
                    <p className="text-[#d1c5b4] text-xs tracking-wide leading-relaxed font-light">
                        Sign in to manage and orchestrate exclusive experiences, connecting with elite partners and creators globally.
                    </p>
                </div>

                <div className="relative z-10 text-[10px] text-[#9a8f80] tracking-widest uppercase">
                    &copy; 2026 Royal Events International.
                </div>
            </div>

            {/* Right Side: Interactive Credential Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#18120f]">
                <div className="w-full max-w-md space-y-8 animate-fade-in">

                    <div className="space-y-2 text-left">
                        <h2 className="text-3xl font-serif font-light text-royal-gold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Sign In
                        </h2>
                        <p className="text-[#9a8f80] text-xs tracking-wide">Enter your credentials to access your portal</p>
                    </div>

                    {error && (
                        <div className="p-3.5 bg-red-950/20 border border-red-900/40 rounded-[4px] text-red-200 text-xs text-left tracking-wide animate-fade-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <InputField
                            label="Email Address or Phone Number"
                            type="text"
                            placeholder="username@domain.com or +963..."
                            value={formData.identity}
                            onChange={(e) => handleChange(e, 'identity')}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleChange(e, 'password')}
                        >
                            <span className="absolute right-3 text-[10px] text-[#c5a059]/50 hover:text-royal-gold cursor-pointer transition-colors">
                                Forgot?
                            </span>
                        </InputField>

                        <div className="pt-2">
                            <Button
                                text={loading ? "OPENING GATES..." : "ENTER PORTAL"}
                                type="submit"
                                className={loading ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </div>
                    </form>

                    <div className="text-center text-xs text-[#9a8f80] pt-6 border-t border-[#4e4639]/20 tracking-wide">
                        Don't have a partner account yet?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="text-royal-gold hover:underline bg-transparent border-none cursor-pointer tracking-wider font-semibold"
                        >
                            Create account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;