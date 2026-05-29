import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// تم إلغاء وتعطيل كاش الـ stylis والـ RTL تماماً لمنع الخطأ نهائياً
const theme = createTheme({
    direction: 'ltr', // تثبيت الاتجاه الافتراضي مبدئياً للمعاينة المستقرة
    palette: {
        mode: 'dark',
        primary: { main: '#c5a059' },
        background: {
            default: '#18120f', // لون السواد الفحمي الرمادي الفاخر لدليلكِ
            paper: '#1c1512'
        },
    },
    typography: {
        fontFamily: "'Inter', 'sans-serif'"
    },
});

function Main() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    );
}

createRoot(document.getElementById('root')).render(<Main />);