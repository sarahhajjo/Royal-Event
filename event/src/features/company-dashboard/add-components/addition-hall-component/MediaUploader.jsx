import React, { useRef, useState } from 'react';
// 💡 تم إضافة alpha هنا
import { Box, Typography, TextField, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import additionService from '../../../../services/companyService/additionService.js';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const MediaUploader = ({ data, setData, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
        if (editMode) {
            const isModified = String(currentValue || '') !== String(originalData?.[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50';
        }
        return {
            '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                borderRadius: '4px',
                border: borderColor.includes('solid') ? borderColor : `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused': { border: `1px solid ${GOLD}` }
            },
            '& .MuiInputBase-input': {
                padding: '12px 16px',
                fontSize: '14px',
            }
        };
    };
    const fileInputRef = useRef(null);

    const [isUploading, setIsUploading] = useState(false);
    const images = data.images || [];

    const handleFileChange = async (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length === 0) return;

        setIsUploading(true);
        let currentImages = [...images];

        for (const file of newFiles) {
            const localPreview = URL.createObjectURL(file);
            try {
                const response = await additionService.uploadTempImage(file);
                if (response && response.temp_path) {
                    currentImages.push({ preview: localPreview, tempPath: response.temp_path });
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

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

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '16px' }}>📦</Typography>
                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>
                    Logistics & Media
                </Typography>
            </Box>

            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                UPLOAD HALL IMAGES
            </Typography>

            <Box sx={{
                border: isDark ? '1px dashed rgba(255,255,255,0.15)' : `1px dashed ${LIGHT_BORDER}`,
                borderRadius: '4px', p: 1.5, mb: 3,
                background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                display: 'flex', alignItems: 'center', minHeight: '90px',
                overflowX: 'auto', gap: 1.5,
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: GOLD, borderRadius: '4px' }
            }}>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleFileChange} />

                {images.length > 0 ? (
                    <>
                        {images.map((imgObj, imgIdx) => (
                            <Box key={imgIdx} sx={{
                                position: 'relative', width: '70px', height: '70px', flexShrink: 0,
                                borderRadius: '4px', overflow: 'hidden', border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`
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

                        <Box onClick={() => !isUploading && fileInputRef.current.click()} sx={{ width: '70px', height: '70px', flexShrink: 0, border: `1px dashed ${GOLD}`, borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: isUploading ? 'not-allowed' : 'pointer', transition: '0.2s', '&:hover': { backgroundColor: alpha(GOLD, 0.1) } }}>
                            {isUploading ? <CircularProgress size={20} sx={{color: GOLD}} /> : <FileUploadIcon sx={{ color: GOLD, fontSize: 24 }} />}
                        </Box>
                    </>
                ) : (
                    <Box onClick={() => !isUploading && fileInputRef.current.click()} sx={{ width: '100%', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}>
                        {isUploading ? (
                            <CircularProgress size={24} sx={{ color: GOLD, mb: 1 }} />
                        ) : (
                            <FileUploadIcon sx={{ color: GOLD, fontSize: 26, mb: 0.5 }} />
                        )}
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontWeight: 'bold', fontSize: '11px', mt: 0.5 }}>
                            {isUploading ? "UPLOADING..." : "UPLOAD IMAGES"}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                SECONDARY CONTACT NUMBER (OPTIONAL)
            </Typography>
            <TextField
                fullWidth
                placeholder="+971 50 000 0000"
                value={data.secondary_contact_number || ''}
                onChange={(e) => setData({...data, secondary_contact_number: e.target.value})}
                sx={getFieldStyle('secondary_contact_number', data.secondary_contact_number)}
            />
        </Box>
    );
};

export default MediaUploader;