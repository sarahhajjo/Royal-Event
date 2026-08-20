import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, useTheme } from "@mui/material";
import OfferStatusBadge from "./OfferStatusBadge";
import freelancerCatalogService from "../../../../services/freelancerService/freelancerCatalogService.js";

export default function OfferCard({ offer }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await freelancerCatalogService.getListingImages(offer.id);

                if (data && data.images) {
                    setImages(data.images);
                } else if (Array.isArray(data)) {
                    setImages(data);
                }
            } catch (err) {
                console.error("خطأ في جلب صور الخدمة:", err);
            }
        };

        if (offer.id) {
            fetchImages();
        }
    }, [offer.id]);

    const displayImage = images.length > 0 && images[0].url
        ? images[0].url
        : "https://placehold.co/600x400/eeeeee/999999?text=No+Image";

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                // 👑 إزالة الخلفية الصلبة وجعلها شفافة لتندمج مع زجاج الصفحة الأساسية
                bgcolor: 'transparent',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                height: 192,
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                }
            }}
        >
            <Box
                component="img"
                src={displayImage}
                alt={offer.title?.en || offer.title?.ar || "Service Image"}
                sx={{ width: 224, height: '100%', objectFit: 'cover', flexShrink: 0 }}
            />

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography
                            sx={{
                                fontSize: '0.68rem',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                letterSpacing: 1.2
                            }}
                        >
                            {offer.category?.name || "Uncategorized"}
                        </Typography>
                        <OfferStatusBadge status={offer.status} />
                    </Box>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: theme.palette.text.primary }}>
                        {offer.title?.en || offer.title?.ar || offer.title}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: theme.palette.text.primary }}>
                        {offer.price || (offer.variants && offer.variants[0]?.price) || 0}
                        <Box
                            component="span"
                            sx={{ fontSize: '0.85rem', fontWeight: 400, color: theme.palette.text.secondary, ml: 0.5 }}
                        >
                            SAR
                        </Box>
                    </Typography>

                    <Button
                        onClick={() => navigate(`/service_detail/${offer.id}`)}
                        variant="outlined"
                        sx={{
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                                color: theme.palette.primary.main,
                                borderColor: theme.palette.primary.main
                            }
                        }}
                    >
                        View Details
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}