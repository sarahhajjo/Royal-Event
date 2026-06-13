import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, useTheme, Stack, CircularProgress } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import additionService from '../../../../services/companyService/additionService.js'; // تأكدي من المسار

// دالة أيقونة الحذف (يفضل استيراد DeleteIcon من mui/icons-material مباشرة)
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const MediaUploader = ({ data, setData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const fileInputRef = useRef(null);

    // سنخزن الملفات ككائنات تحتوي على اسم الملف ومساره المؤقت
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length === 0) return;

        setIsUploading(true);

        for (const file of newFiles) {
            try {
                // نرفع الصورة فوراً للرابط المؤقت
                const response = await additionService.uploadTempImage(file);

                if (response && response.temp_path) {
                    const newFileData = {
                        name: file.name,
                        size: file.size,
                        tempPath: response.temp_path // المسار المهم للباك إند
                    };

                    // إضافتها لقائمة العرض
                    setSelectedFiles(prev => [...prev, newFileData]);

                    // إضافتها للبيانات الرئيسية (data) لترسل لاحقاً مع الصالة
                    setData(prevData => ({
                        ...prevData,
                        temp_images: [...(prevData.temp_images || []), response.temp_path]
                    }));
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                // هنا يمكن إضافة تنبيه للمستخدم في حال فشل الرفع
            }
        }

        setIsUploading(false);
        // تصفير الـ input لكي يسمح باختيار نفس الصورة مجدداً إن تم حذفها
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (indexToRemove) => {
        const fileToRemove = selectedFiles[indexToRemove];

        // إزالتها من العرض
        setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));

        // إزالتها من البيانات الرئيسية
        setData(prevData => ({
            ...prevData,
            temp_images: (prevData.temp_images || []).filter(path => path !== fileToRemove.tempPath)
        }));
    };
    // للوصول للـ input المخفي
    const inputStyle = {
        // هذا الستايل موحد الآن ليكون بحدود شفافة ونمط متوافق
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            color: theme.palette.text.primary,
            borderRadius: '4px',
            // هنا تم ضبط الحدود لتكون شفافة كما طلبت
            border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused': {
                border: isDark ? '1px solid #c5a059' : '1px solid #b38c45',
                boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
            }
        },
        '& .MuiInputBase-input': {
            padding: '12px 16px',
            fontSize: '14px',
            '&::placeholder': { color: theme.palette.text.secondary, opacity: 1 }
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1.5
            }}>
                <Typography sx={{ color: theme.palette.text.primary, fontSize: '16px' }}>📦</Typography>
                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>
                    Logistics & Media
                </Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                UPLOAD HALL IMAGES
            </Typography>
            <Box
                onClick={() => !isUploading && fileInputRef.current.click()}
                sx={{
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                    p: 4, border: isDark ? '2px dashed rgba(78, 70, 57, 0.3)' : '2px dashed rgba(179, 140, 69, 0.35)',
                    borderRadius: 2, textAlign: 'center', mb: 2,
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.6 : 1
                }}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple accept="image/*" />
                {isUploading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <CircularProgress size={20} color="inherit" />
                        <Typography sx={{ color: theme.palette.text.secondary }}>Uploading...</Typography>
                    </Box>
                ) : (
                    <Typography sx={{ color: theme.palette.text.secondary }}>Click to upload or drag & drop</Typography>
                )}
            </Box>

            {/* قائمة الصور المختارة */}
            <Stack spacing={1} sx={{ mb: 3 }}>
                {selectedFiles.map((file, index) => (
                    <Box key={index} sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        p: 1.5, border: `1px solid ${theme.palette.divider}`, borderRadius: 1,
                        backgroundColor: isDark ? '#1c1512' : '#fcf8f0'
                    }}>
                        <Typography sx={{ fontSize: '13px' }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</Typography>
                        <IconButton size="small" onClick={() => removeFile(index)}>
                            <DeleteOutlinedIcon fontSize="small" color="error" />
                        </IconButton>
                    </Box>
                ))}
            </Stack>
            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                SECONDARY CONTACT NUMBER (OPTIONAL)
            </Typography>
            <TextField
                fullWidth
                placeholder="+971 50 000 0000"
                value={data.secondary_contact_number || ''} // القيمة من الـ state
                onChange={(e) => setData({...data, secondary_contact_number: e.target.value})} // تحديث الـ state
                sx={inputStyle}
            />
        </Box>
    );
};
export default MediaUploader;