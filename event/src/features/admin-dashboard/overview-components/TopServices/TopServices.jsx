import React from "react";
import { Box, Grid, Stack, Typography, Button, CircularProgress } from "@mui/material";
import ServiceCard from "./ServiceCard";

const TopServices = ({ listings = [], isLoading }) => {
    // مصفوفة صور افتراضية للجمالية بما أن الـ API لا يعيد صوراً حالياً
    const defaultImages = [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"
    ];

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#1C1712" }}>
                    Top Performing Services
                </Typography>
                <Button sx={{ color: "#8a6f28", fontWeight: 700 }} endIcon={<span>→</span>}>VIEW ALL</Button>
            </Stack>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#8a6f28' }} />
                </Box>
            ) : listings.length === 0 ? (
                <Typography variant="body1" sx={{ color: "#7A6F5E", py: 2 }}>
                    No top services available at the moment.
                </Typography>
            ) : (
                <Grid container spacing={3} alignItems="stretch">
                    {listings.slice(0, 4).map((listing, index) => {
                        // 💡 فصل العنوان الرئيسي عن اسم الشركة بذكاء
                        const titleParts = listing.title ? listing.title.split(' - ') : ["Service", "Details"];
                        const mainTitle = titleParts[0];
                        const subTitle = titleParts[1] || "Service Provider";

                        return (
                            <Grid item xs={12} sm={6} md={6} key={listing.listing_id || index}>
                                <ServiceCard
                                    image={defaultImages[index % defaultImages.length]}
                                    badge={index === 0 ? "PREMIUM" : null}
                                    title={mainTitle}
                                    subtitle={subTitle}
                                    rating={listing.average_rating}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default TopServices;