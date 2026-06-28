import React, { useRef } from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";

const PhotoGallery = ({ photos = [], onPhotosChange }) => {
    const inputRef = useRef();

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map((f) => URL.createObjectURL(f));
        onPhotosChange?.([...photos, ...urls]);
    };

    const handleRemove = (index) => {
        onPhotosChange?.(photos.filter((_, i) => i !== index));
    };

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <CollectionsOutlinedIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                    General Photo Gallery
                </Typography>
            </Box>

            {/* Photos row */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                {photos.map((src, i) => (
                    <Box key={i} sx={{ position: "relative", width: 120, height: 90, borderRadius: 1, overflow: "hidden", border: "1px solid rgba(201,168,76,0.2)" }}>
                        <Box
                            component="img"
                            src={src}
                            alt={`photo-${i}`}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => handleRemove(i)}
                            sx={{
                                position: "absolute", top: 3, right: 3,
                                bgcolor: "rgba(26,20,16,0.75)", color: "#fff", p: 0.3,
                                "&:hover": { bgcolor: "rgba(207,102,121,0.85)" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: "0.7rem" }} />
                        </IconButton>
                    </Box>
                ))}

                {/* Upload slot */}
                <Box
                    onClick={() => inputRef.current?.click()}
                    sx={{
                        width: 120, height: 90,
                        border: "1px dashed rgba(201,168,76,0.3)",
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s",
                        "&:hover": { borderColor: "rgba(201,168,76,0.6)", bgcolor: "rgba(201,168,76,0.04)" },
                    }}
                >
                    <CloudUploadOutlinedIcon sx={{ color: "rgba(201,168,76,0.5)", fontSize: "1.3rem" }} />
                    <Typography sx={{ fontSize: "0.62rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif" }}>
                        Upload Photo
                    </Typography>
                </Box>

                <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
            </Box>

            <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif" }}>
                High-quality images with 4:3 aspect ratio and minimum 1080px width are preferred.
            </Typography>
        </Paper>
    );
};

export default PhotoGallery;