import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const MediaUploader = () => {
    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            color: '#eee0da',
            backgroundColor: '#131110',
            border: '1px solid #261d19'
        }
    };

    return (
        <Box sx={{ p: 0 }}> {/* إزالة الـ p والحدود والخلفية من هنا لأن الـ Paper في الصفحة هي من ستقوم بذلك */}

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                borderBottom: '1px solid rgba(154, 143, 128, 0.1)',
                pb: 1.5
            }}>
                <Typography sx={{ color: '#c5a059', fontSize: '16px' }}>📦</Typography>
                <Typography sx={{ color: '#c5a059', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>
                    Logistics & Media
                </Typography>
            </Box>

            {/* محتوى الـ Upload */}
            <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                UPLOAD HALL IMAGES
            </Typography>
            <Box sx={{ backgroundColor: '#131110',p: 4, border: '2px dashed #403d36', borderRadius: 2, textAlign: 'center', mb: 3 }}>
                <Typography sx={{ color: '#8a7f70' }}>Drag and drop high-resolution imagery here</Typography>
                <Typography sx={{ color: '#5a5043', fontSize: '12px' }}>Supports JPG, PNG, WEBP (Max 20MB per file)</Typography>
            </Box>

            {/* حقل الرقم */}
            <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                SECONDARY CONTACT NUMBER (OPTIONAL)
            </Typography>
            <TextField fullWidth placeholder="+971 50 000 0000" sx={inputStyle} />
        </Box>
    );
};
export default MediaUploader;