import {Box, Typography, Paper, useTheme, Divider} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CollectionsIcon from '@mui/icons-material/Collections'; // أو أي أيقونة مشابهة لما في الصورة
const MediaPreview = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            p: 3,
            border: `1px solid ${theme.palette.divider}`, // لون الإطار من الثيم
            borderRadius: 2,
            bgcolor: isDark? '#261d19' : '#E5D9B8'// لون الخلفية من الثيم
        }}>
            {/* العنوان داخل الصندوق */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 ,bgcolor: isDark? '#261d19' : '#E5D9B8'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
                    <CollectionsIcon sx={{ color:'#A5AA93', fontSize: 21 }} />
                    <Typography sx={{
                        color: theme.palette.text.primary,
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.02rem'
                    }}>
                        ARRANGEMENT PREVIEW
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: theme.palette.divider }} />
            </Box>

            <Paper elevation={0} sx={{
                height: '271px',
                bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', // لون حقل الرفع من الثيم
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                p: 1
            }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />

                <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Upload High-Res Media
                </Typography>

                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textAlign: 'center', fontSize: '0.75rem', maxWidth: '180px' }}>
                    Drag and drop or click to browse. JPEG, PNG, or MP4 accepted.
                </Typography>
            </Paper>
        </Box>
    );
};

export default MediaPreview;