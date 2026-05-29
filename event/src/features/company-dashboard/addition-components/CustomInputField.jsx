import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const CustomInputField = ({ label, placeholder, value, onChange, type = 'text', multiline = false, rows = 1 }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Typography variant="caption" sx={{ color: '#c5a059', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                {label}
            </Typography>
            <TextField
                fullWidth
                type={type}
                placeholder={placeholder}
                multiline={multiline}
                rows={rows}
                value={value}
                onChange={onChange}
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        // 🎨 التعديل: أسود شفاف فخم مع حدود ناعمة متوافقة مع الهوية الملكية
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        color: '#eee0da',
                        borderRadius: '4px',
                        border: '1px solid rgba(78, 70, 57, 0.3)',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused': {
                            border: '1px solid #c5a059',
                            boxShadow: '0 0 8px rgba(197, 160, 89, 0.2)'
                        }
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '12px 16px',
                        fontSize: '14px',
                        '&::placeholder': { color: '#5a5043', opacity: 1 } // لون البليس هولدر مريح للعين
                    }
                }}
            />
        </Box>
    );
};

export default CustomInputField;