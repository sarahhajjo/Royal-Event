import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

function InputField({ label, type = 'text', placeholder, value, onChange, children }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 0.5 }}>

            {/* 👑 التسمية الفوقية: تم إلغاء الـ Bold وتنعيم الخط مع الحفاظ على المسافات */}
            {label && (
                <Box
                    component="label"
                    sx={{
                        fontSize: '11px',
                        fontWeight: 400, // 💡 تم التعديل من 700 إلى 400 لإلغاء الـ Bold تماماً ليصبح الخط ناعماً ورفيعاً
                        color: '#c5a059',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25em' // الحفاظ على المسافات الأنيقة الملكية بين الحروف
                    }}
                >
                    {label}
                </Box>
            )}

            <TextField
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                fullWidth
                variant="standard"
                slotProps={{
                    input: {
                        endAdornment: children ? (
                            <InputAdornment position="end" sx={{ position: 'absolute', right: 0, bottom: '4px' }}>
                                {children}
                            </InputAdornment>
                        ) : null,
                        disableUnderline: false,
                        sx: {
                            color: '#eee0da',
                            backgroundColor: 'transparent',
                            pt: 0.4,
                            pb: 0.4,
                            fontSize: '15px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.3s ease',

                            '& input': {
                                py: 0.2,
                                height: '20px',
                                lineHeight: '20px'
                            },

                            '&:before': {
                                borderBottom: '1px solid rgba(78, 70, 57, 0.45) !important',
                            },
                            '&:after': {
                                borderBottom: '2px solid #c5a059',
                            },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 100px #18120f inset !important',
                                WebkitTextFillColor: '#eee0da !important',
                                caretColor: '#eee0da'
                            },
                            '& input::placeholder': {
                                color: '#5a5043',
                                opacity: 1,
                                fontSize: '14px'
                            }
                        }
                    }
                }}
                sx={{
                    '& .MuiInput-root': { position: 'relative' }
                }}
            />
        </Box>
    );
}

export default InputField;