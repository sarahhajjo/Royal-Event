import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CustomInputField from './CustomInputField';

const VariantCard = ({ index, hasVariants }) => {
    return (
        <Paper
            sx={{
                p: 3,
                backgroundColor: '#140e0c',
                border: '1px solid #261d19',
                borderRadius: '4px',
                // 💡 تثبيت العرض تماماً لمنع تشوه الكروت أثناء التمرير الأفقي
                minWidth: hasVariants === 'yes' ? '280px' : '100%',
                flexShrink: 0
            }}
        >
            <Typography variant="caption" sx={{ color: '#c5a059', fontWeight: 'bold', display: 'block', mb: 2, letterSpacing: '0.05em' }}>
                VARIANT {index + 1}
            </Typography>

            <Box sx={{ border: '1px solid rgba(78, 70, 57, 0.3)', borderRadius: '4px', p: 3, textAlign: 'center', mb: 2, backgroundColor: 'rgba(0, 0, 0, 0.2)', cursor: 'pointer', '&:hover': { borderColor: '#c5a059' } }}>
                <FileUploadIcon sx={{ color: '#c5a059', fontSize: 24, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#9a8f80', display: 'block' }}>UPLOAD IMAGE</Typography>
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