import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PhotoGallery({ photos, onPhotosChange }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onPhotosChange([file]); // نرسل الملف للأب لتحديث الـ formData
        }
    };

    const removeImage = () => {
        setPreview(null);
        onPhotosChange([]); // مسح الصور
    };

    return (
        <Box sx={{ mt: 3, p: 3, border: '1px solid #ccc', borderRadius: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>General Photo Gallery</Typography>

            {!preview ? (
                <label htmlFor="upload-photo">
                    <Box sx={{ border: '2px dashed #bbb', p: 4, textAlign: 'center', cursor: 'pointer' }}>
                        <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#888' }} />
                        <Typography>اضغطي لرفع صورة الخدمة</Typography>
                    </Box>
                    <input id="upload-photo" type="file" hidden onChange={handleFileChange} accept="image/*" />
                </label>
            ) : (
                <Box sx={{ position: 'relative', width: 200, height: 150 }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton onClick={removeImage} sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}