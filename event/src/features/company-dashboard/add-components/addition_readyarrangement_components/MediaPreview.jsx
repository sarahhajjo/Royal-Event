import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, useTheme, Divider, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteIcon from '@mui/icons-material/Delete';

const MediaPreview = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [mediaFiles, setMediaFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newMedia = files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                type: file.type
            }));
            setMediaFiles(prev => [...prev, ...newMedia]);
        }
        event.target.value = '';
    };

    const handleRemove = (index, event) => {
        event.stopPropagation();
        setMediaFiles(prev => {
            const updatedFiles = [...prev];
            URL.revokeObjectURL(updatedFiles[index].preview);
            updatedFiles.splice(index, 1);
            return updatedFiles;
        });
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: isDark ? '#261d19' : '#E5D9B8'
        }}>
            {/* العنوان داخل الصندوق */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: isDark ? '#261d19' : '#E5D9B8' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CollectionsIcon sx={{ color: '#A5AA93', fontSize: 21 }} />
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

            {/* حقل الإدخال المخفي */}
            <input
                type="file"
                multiple
                accept="image/jpeg, image/png, video/mp4"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* صندوق العرض والرفع */}
            <Paper
                elevation={0}
                onClick={handleBoxClick}
                sx={{
                    height: '271px',
                    bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: mediaFiles.length > 0 ? 'row' : 'column',
                    flexWrap: 'wrap',
                    alignItems: mediaFiles.length > 0 ? 'flex-start' : 'center',
                    justifyContent: mediaFiles.length > 0 ? 'flex-start' : 'center',
                    alignContent: mediaFiles.length > 0 ? 'flex-start' : 'center', // 💡 تعديل هام لتوسيط المحتوى الفارغ
                    gap: 2,
                    p: 2,
                    overflowY: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'
                    }
                }}
            >
                {mediaFiles.length === 0 ? (
                    // 💡 غلاف جديد لضمان بقاء النصوص والأيقونة في المنتصف 100%
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        <CloudUploadIcon sx={{ fontSize: 36, color: theme.palette.primary.main, mb: 1 }} />
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '0.9rem', mb: 0.5 }}>
                            Upload High-Res Media
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem', maxWidth: '200px', lineHeight: 1.5 }}>
                            Drag and drop or click to browse.<br/>JPEG, PNG, or MP4 accepted.
                        </Typography>
                    </Box>
                ) : (
                    mediaFiles.map((media, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                width: '100px',
                                height: '100px',
                                borderRadius: 1,
                                overflow: 'hidden',
                                boxShadow: theme.shadows[2],
                            }}
                        >
                            {media.type.startsWith('video') ? (
                                <video src={media.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <img src={media.preview} alt={`preview-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}

                            <IconButton
                                size="small"
                                onClick={(e) => handleRemove(index, e)}
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    color: '#fff',
                                    width: 24,
                                    height: 24,
                                    '&:hover': { bgcolor: 'error.main' }
                                }}
                            >
                                <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Box>
                    ))
                )}
            </Paper>
        </Box>
    );
};

export default MediaPreview;