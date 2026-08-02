import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PhotoGallery({ photos, onPhotosChange }) {
    // استخدمنا مصفوفات (Arrays) لحفظ عدة صور
    const [previews, setPreviews] = useState([]);
    const [filesList, setFilesList] = useState([]);

    const handleFileChange = (event) => {
        // تحويل الملفات المحددة إلى مصفوفة
        const selectedFiles = Array.from(event.target.files);

        if (selectedFiles.length > 0) {
            // دمج الملفات القديمة مع الجديدة
            const newFiles = [...filesList, ...selectedFiles];
            setFilesList(newFiles);
            onPhotosChange(newFiles); // إرسال كل الملفات للأب

            // إنشاء روابط معاينة للصور الجديدة ودمجها مع القديمة
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        }
    };

    const removeImage = (indexToRemove) => {
        // فلترة (حذف) الصورة المحددة بناءً على رقم الـ index
        const updatedFiles = filesList.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);

        setFilesList(updatedFiles);
        setPreviews(updatedPreviews);
        onPhotosChange(updatedFiles);
    };

    return (
        <Box sx={{ mt: 3, p: 3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, bgcolor: 'transparent' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>General Photo Gallery</Typography>

            {/* منطقة الرفع (دائماً ظاهرة لتسمح بإضافة المزيد) */}
            <label htmlFor="upload-photo">
                <Box sx={{
                    border: '2px dashed rgba(197, 160, 89, 0.5)', // لون ذهبي متناسق
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: 'rgba(197, 160, 89, 0.05)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: 'rgba(197, 160, 89, 0.1)',
                        borderColor: '#c5a059' // ذهبي ساطع عند التمرير
                    }
                }}>
                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#c5a059' }} />
                    <Typography sx={{ color: '#aaa', mt: 1 }}>اضغطي هنا لرفع صور الخدمة (يمكنك تحديد عدة صور)</Typography>
                </Box>
                {/* 👑 أضفنا كلمة multiple للسماح برفع أكثر من ملف */}
                <input id="upload-photo" type="file" multiple hidden onChange={handleFileChange} accept="image/*" />
            </label>

            {/* شبكة عرض الصور المرفوعة */}
            {previews.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
                    {previews.map((preview, index) => (
                        <Box key={index} sx={{ position: 'relative', width: 120, height: 120 }}>
                            <img
                                src={preview}
                                alt={`Preview ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}
                            />
                            <IconButton
                                onClick={() => removeImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    color: '#ff4d4d',
                                    width: 26,
                                    height: 26,
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                }}
                            >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}