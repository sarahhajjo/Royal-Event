import React, { useRef } from 'react';
import { Box, Typography, Paper, useTheme, Divider, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const MediaPreview = ({ mediaFiles, setMediaFiles }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

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
            if(updatedFiles[index].file) {
                URL.revokeObjectURL(updatedFiles[index].preview);
            }
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
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            borderRadius: 2,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'transparent' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CollectionsIcon sx={{ color: GOLD, fontSize: 21 }} />
                    <Typography sx={{ color: isDark ? '#eee0da' : BROWN_TEXT, fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.02rem' }}>
                        ARRANGEMENT PREVIEW
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : LIGHT_BORDER }} />
            </Box>

            <input type="file" multiple accept="image/jpeg, image/png, video/mp4" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

            <Paper
                elevation={0}
                onClick={handleBoxClick}
                sx={{
                    height: '271px',
                    bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                    border: isDark ? '2px dashed rgba(255, 255, 255, 0.12)' : `2px dashed ${LIGHT_BORDER}`,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: mediaFiles.length > 0 ? 'row' : 'column',
                    flexWrap: 'wrap',
                    alignItems: mediaFiles.length > 0 ? 'flex-start' : 'center',
                    justifyContent: mediaFiles.length > 0 ? 'flex-start' : 'center',
                    alignContent: mediaFiles.length > 0 ? 'flex-start' : 'center',
                    gap: 2,
                    p: 2,
                    overflowY: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: GOLD,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 248, 232, 0.98)'
                    },
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(197, 160, 89, 0.5)', borderRadius: '10px' },
                }}
            >
                {mediaFiles.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', height: '100%' }}>
                        <CloudUploadIcon sx={{ fontSize: 36, color: GOLD, mb: 1 }} />
                        <Typography sx={{ color: GOLD, fontWeight: 'bold', fontSize: '0.9rem', mb: 0.5 }}>Upload High-Res Media</Typography>
                        <Typography variant="caption" sx={{ color: isDark ? theme.palette.text.secondary : MUTED_TEXT, fontSize: '0.75rem', maxWidth: '200px', lineHeight: 1.5 }}>Drag and drop or click to browse.<br/>JPEG, PNG, or MP4 accepted.</Typography>
                    </Box>
                ) : (
                    mediaFiles.map((media, index) => {
                        const isVideo = media.type?.startsWith('video') || (typeof media.preview === 'string' && media.preview.match(/\.(mp4|webm)$/i));
                        return (
                            <Box key={index} sx={{ position: 'relative', width: '100px', height: '100px', borderRadius: 1, overflow: 'hidden', boxShadow: theme.shadows[2], border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                {isVideo ? (
                                    <video src={media.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <img src={media.preview} alt={`preview-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                                <IconButton size="small" onClick={(e) => handleRemove(index, e)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', width: 24, height: 24, transition: 'all 0.2s ease', '&:hover': { bgcolor: '#d32f2f', transform: 'scale(1.1)' } }}>
                                    <DeleteIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Box>
                        );
                    })
                )}
            </Paper>
        </Box>
    );
};

export default MediaPreview;