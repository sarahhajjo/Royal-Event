import React from 'react';
import MuiButton from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

// 💡 استدعاء اللون الذهبي من الثوابت (تأكدي من مسار الملف لديكِ)
import { GOLD } from '../utils/colorConstants';

function Button({ text, onClick, type = 'submit', className = '', disabled = false }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <MuiButton
            type={type}
            onClick={onClick}
            disabled={disabled}
            fullWidth
            variant="contained"
            className={className}
            sx={{
                background: GOLD, // 💡 لون صلب موحد بدون تدرج
                color: isDark ? '#131110' : '#ffffff',
                fontWeight: 'bold',
                py: 1.8,
                borderRadius: '4px',
                boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(130, 100, 40, 0.15)',
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                    background: '#b38c45', // 💡 درجة أغمق قليلاً من الذهبي عند التمرير
                },
                '&:active': { transform: 'scale(0.99)' },
                '&.Mui-disabled': {
                    background: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.2)',
                    color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(74, 59, 50, 0.4)',
                }
            }}
        >
            {text}
        </MuiButton>
    );
}

export default Button;