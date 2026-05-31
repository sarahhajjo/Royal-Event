import React from 'react';
import MuiButton from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

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
                background: isDark ? 'linear-gradient(to right, #c5a059, #a68341)' : 'linear-gradient(to right, #b38c45, #FFE088)',
                color: isDark ? '#302205' : '#ffffff',
                fontWeight: 'bold',
                py: 1.8,
                borderRadius: '4px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                    background: isDark ? 'linear-gradient(to right, #d6b26a, #c5a059)' : 'linear-gradient(to right, #FFE088, #b38c45)',
                },
                '&:active': { transform: 'scale(0.99)' },
                '&.Mui-disabled': {
                    background: isDark ? '#261d19' : '#E5D9B8',
                    color: isDark ? '#4e4639' : '#7A6F5E',
                }
            }}
        >
            {text}
        </MuiButton>
    );
}

export default Button;