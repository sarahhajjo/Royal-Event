import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTheme } from '@mui/material/styles';
import CustomInputField from './CustomInputField.jsx';

const VariantCard = ({ index, hasVariants }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper
            sx={{
                p: 3,
                backgroundColor: isDark ? '#140e0c' : '#FAF0D5', // ☀️ قلب خلفية كرت المتغيرات للدرجة الرملية الصيفية المشرقة
                border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)',
                borderRadius: '4px',
                minWidth: hasVariants === 'yes' ? '280px' : '100%',
                flexShrink: 0,
                transition: 'background-color 0.3s ease'
            }}
        >
            <Typography variant="caption" sx={{ color: isDark ? '#c5a059' : '#b38c45', fontWeight: 'bold', display: 'block', mb: 2, letterSpacing: '0.05em' }}>
                VARIANT {index + 1}
            </Typography>

            <Box sx={{ border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.4)', borderRadius: '4px', p: 3, textAlign: 'center', mb: 2, backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', '&:hover': { borderColor: isDark ? '#c5a059' : '#b38c45' } }}>
                <FileUploadIcon sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: 24, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', display: 'block' }}>UPLOAD IMAGE</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {hasVariants === 'yes' && (
                    <CustomInputField label="Color Name / Hex" placeholder="e.g., Onyx" />
                )}
                <CustomInputField label="Price (S.P)" placeholder="0.00" type="number" />
                <CustomInputField label="Stock Quantity" placeholder="0" type="number" />
                <CustomInputField label="Availability Date" placeholder="mm/dd/yyyy" type="date" />
            </Box>
        </Paper>
    );
};

export default VariantCard;