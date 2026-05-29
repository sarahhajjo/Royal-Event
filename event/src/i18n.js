import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            signIn: "Sign In",
            welcomeTo: "Welcome to",
            bespokeLuxury: "Bespoke Luxury",
            description: "Sign in to manage and orchestrate exclusive experiences, connecting with elite partners and creators globally.",
            enterCredentials: "Enter your credentials to access your portal",
            emailOrPhone: "Email Address or Phone Number",
            password: "Password",
            forgot: "Forgot?",
            enterPortal: "ENTER PORTAL",
            openingGates: "OPENING GATES...",
            dontHaveAccount: "Don't have a partner account yet?",
            createAccount: "Create account",
            back: "Go Back",
            continue: "CONTINUE",
        }
    },
    ar: {
        translation: {
            signIn: "تسجيل الدخول",
            welcomeTo: "مرحباً بك في",
            bespokeLuxury: "الرفاهية المطلقة",
            description: "سجل الدخول لإدارة وتنظيم تجارب حصرية، والتواصل مع شركاء ومبدعين نخبوين عالمياً.",
            enterCredentials: "أدخل بيانات الاعتماد الخاصة بك للوصول إلى البوابة الإلكترونية",
            emailOrPhone: "البريد الإلكتروني أو رقم الهاتف",
            password: "كلمة المرور",
            forgot: "نسيت؟",
            enterPortal: "دخول البوابة",
            openingGates: "جاري فتح البوابات...",
            dontHaveAccount: "ليس لديك حساب شريك بعد؟",
            createAccount: "أنشئ حساباً الجديد",
            back: "الرجوع للخلف",
            continue: "المتابعة",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    });

export default i18n;