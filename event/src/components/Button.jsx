import React from 'react';
import MuiButton from '@mui/material/Button';

function Button({ text, onClick, type = 'submit', className = '', disabled = false }) {
    return (
        <MuiButton
            type={type}
            onClick={onClick}
            disabled={disabled}
            fullWidth
            variant="contained"
            className={className}
            sx={{
                background: 'linear-gradient(to right, #c5a059, #a68341)',
                color: '#302205',
                fontWeight: 'bold',
                py: 1.8, // py-3.5 يعادل تقريباً 14px إلى 16px صعوداً وهبوطاً
                borderRadius: '4px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                letterSpacing: '0.15em',
                fontSize: '0.75rem', // text-xs
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                    background: 'linear-gradient(to right, #d6b26a, #c5a059)',
                },
                '&:active': {
                    transform: 'scale(0.99)',
                },
                '&.Mui-disabled': {
                    background: '#261d19',
                    color: '#4e4639',
                }
            }}
        >
            {text}
        </MuiButton>
    );
}

export default Button;