import React, { useState, createContext, useMemo, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 👑 إنشاء سياق (Context) مركزي للتحكم بقلب الألوان من أي مكان في النظام
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function Main() {
    const [mode, setMode] = useState('dark'); // النمط الافتراضي هو الداكن الفاخر

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => {
                const nextMode = prevMode === 'light' ? 'dark' : 'light';
                // حقن أو إزالة كلاس الـ .light من جذر المستند ليتأثر الـ Tailwind فوراً
                if (nextMode === 'light') {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                }
                return nextMode;
            });
        },
        mode
    }), [mode]);

    // تفصيل ثيم MUI ليتغذى ديناميكياً من خيار المستخدم
    const theme = useMemo(() => createTheme({
        direction: 'ltr',
        palette: {
            mode: mode,
            primary: { main: mode === 'dark' ? '#c5a059' : '#b38c45' },
            background: {
                default: mode === 'dark' ? '#18120f' : '#FAF0D5',
                paper: mode === 'dark' ? '#18120f' : '#EFE4C9' // اجعليها مطابقة للـ default // اجعليها مطابقة للـ default
            },
            text: {
                primary: mode === 'dark' ? '#eee0da' : '#2B211E',
                secondary: mode === 'dark' ? '#9a8f80' : '#7A6F5E'
            }
        },
        typography: { fontFamily: "'Inter', 'sans-serif'" },
    }), [mode]);

    return (
        <Provider store={store}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </ColorModeContext.Provider>
        </Provider>
    );
}

createRoot(document.getElementById('root')).render(<Main />);