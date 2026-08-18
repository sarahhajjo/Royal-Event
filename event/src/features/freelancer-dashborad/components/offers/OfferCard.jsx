import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import OfferStatusBadge from "./OfferStatusBadge";
import freelancerCatalogService from "../../../../services/freelancerService/freelancerCatalogService.js";

export default function OfferCard({ offer }) {
    const navigate = useNavigate();
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
                border: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: '12px',
                overflow: 'hidden',
                height: 192,
                transition: 'border-color 0.3s',
                '&:hover': {
                    borderColor: (theme) => `${theme.palette.primary.main}4D` // ~ primary/30
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
                                color: (theme) => theme.palette.primary.main,
                                letterSpacing: 1.2
                            }}
                        >
                            {offer.category?.name || "Uncategorized"}
                        </Typography>
                        <OfferStatusBadge status={offer.status} />
                    </Box>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: (theme) => theme.palette.text.primary }}>
                        {offer.title?.en || offer.title?.ar || offer.title}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: (theme) => theme.palette.text.primary }}>
                        {offer.price || (offer.variants && offer.variants[0]?.price) || 0}
                        <Box
                            component="span"
                            sx={{ fontSize: '0.85rem', fontWeight: 400, color: (theme) => theme.palette.text.secondary, ml: 0.5 }}
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
                            borderColor: (theme) => theme.palette.divider,
                            color: (theme) => theme.palette.text.secondary,
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.background.default,
                                color: (theme) => theme.palette.primary.main,
                                borderColor: (theme) => theme.palette.divider
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