import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, useTheme, CircularProgress } from '@mui/material';
import additionService from '../../../../services/companyService/additionService.js';

// 💡 استيراد الأيقونات المطلوبة
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const MediaUploader = ({ data, setData, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.35)';
        if (editMode) {
            // التحقق إذا كان هناك تعديل
            const isModified = String(currentValue || '') !== String(originalData?.[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50'; // أصفر للمعدل، أخضر للقديم
        }
        return {
            '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                color: theme.palette.text.primary,
                borderRadius: '4px',
                border: `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
            },
            '& .MuiInputBase-input': {
                padding: '12px 16px',
                fontSize: '14px',
            }
        };
    };
    const fileInputRef = useRef(null);

    const [isUploading, setIsUploading] = useState(false);

    // نعتمد على data.images مباشرة لتشمل الصور القديمة والجديدة
    const images = data.images || [];

    const handleFileChange = async (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length === 0) return;

        setIsUploading(true);
        let currentImages = [...images];

        for (const file of newFiles) {
            // إنشاء رابط معاينة محلي لسرعة العرض قبل اكتمال الرفع
            const localPreview = URL.createObjectURL(file);
            try {
                const response = await additionService.uploadTempImage(file);

                if (response && response.temp_path) {
                    currentImages.push({
                        preview: localPreview,
                        tempPath: response.temp_path // المسار الذي سيُرسل للباك إند
                    });
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        // تحديث البيانات الرئيسية
        setData(prevData => ({ ...prevData, images: currentImages }));
        setIsUploading(false);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (indexToRemove) => {
        setData(prevData => ({
            ...prevData,
            images: (prevData.images || []).filter((_, i) => i !== indexToRemove)
        }));
    };

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            color: theme.palette.text.primary,
            borderRadius: '4px',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1.5 }}>
                <Typography sx={{ color: theme.palette.text.primary, fontSize: '16px' }}>📦</Typography>
                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>
                    Logistics & Media
                </Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                UPLOAD HALL IMAGES
            </Typography>

            {/* 💡 بوكس الصور الأفقي الجديد المماثل للمنتجات */}
            <Box sx={{
                border: isDark ? '1px dashed rgba(78, 70, 57, 0.6)' : '1px dashed rgba(179, 140, 69, 0.6)',
                borderRadius: '4px', p: 1.5, mb: 3,
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                display: 'flex', alignItems: 'center', minHeight: '90px',
                overflowX: 'auto', gap: 1.5,
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? 'rgba(197, 160, 89, 0.5)' : 'rgba(179, 140, 69, 0.5)', borderRadius: '4px' }
            }}>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleFileChange} />

                {images.length > 0 ? (
                    <>
                        {images.map((imgObj, imgIdx) => (
                            <Box key={imgIdx} sx={{
                                position: 'relative', width: '70px', height: '70px', flexShrink: 0,
                                borderRadius: '4px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}`
                            }}>
                                <img
                                    src={imgObj.preview || imgObj.url || imgObj.path}
                                    alt={`hall-img-${imgIdx}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Box
                                    onClick={(e) => { e.stopPropagation(); removeFile(imgIdx); }}
                                    sx={{
                                        position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)',
                                        borderRadius: '50%', cursor: 'pointer', width: '18px', height: '18px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: '0.2s', '&:hover': { bgcolor: 'error.main' }
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: '12px', color: '#fff' }} />
                                </Box>
                            </Box>
                        ))}

                        <Box onClick={() => !isUploading && fileInputRef.current.click()} sx={{ width: '70px', height: '70px', flexShrink: 0, border: '1px dashed #c5a059', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: isUploading ? 'not-allowed' : 'pointer', transition: '0.2s', '&:hover': { borderColor: '#c5a059', backgroundColor: 'rgba(197, 160, 89, 0.1)' } }}>
                            {isUploading ? <CircularProgress size={20} sx={{color: '#c5a059'}} /> : <FileUploadIcon sx={{ color: '#c5a059', fontSize: 24 }} />}
                        </Box>
                    </>
                ) : (
                    <Box onClick={() => !isUploading && fileInputRef.current.click()} sx={{ width: '100%', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}>
                        {isUploading ? (
                            <CircularProgress size={24} sx={{ color: isDark ? '#c5a059' : '#b38c45', mb: 1 }} />
                        ) : (
                            <FileUploadIcon sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: 26, mb: 0.5 }} />
                        )}
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold', fontSize: '11px', mt: 0.5 }}>
                            {isUploading ? "UPLOADING..." : "UPLOAD IMAGES"}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                SECONDARY CONTACT NUMBER (OPTIONAL)
            </Typography>
            <TextField
                fullWidth
                placeholder="+971 50 000 0000"
                value={data.secondary_contact_number || ''}
                onChange={(e) => setData({...data, secondary_contact_number: e.target.value})}
                sx={getFieldStyle('secondary_contact_number', data.secondary_contact_number)} // 💡 التعديل هنا
            />
        </Box>
    );
};

export default MediaUploader;