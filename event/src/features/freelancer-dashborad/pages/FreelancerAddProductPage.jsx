import React, { useState } from "react";
import { Box, Grid } from "@mui/material";

import Sidebar         from "../components/layout/Sidebar";
import Header          from "../components/layout/Header";
import PageBreadcrumb  from "../components/add-product/PageBreadcrumb";
import CoreDetails     from "../components/add-product/CoreDetails";
import Logistics       from "../components/add-product/Logistics";
import CustomizationPricing from "../components/add-product/CustomizationPricing";
import PhotoGallery    from "../components/add-product/PhotoGallery";
import ActionBar       from "../components/add-product/ActionBar";

// nav items specific to company/add-product dashboard
const NAV_ITEMS_KEY = "add-product"; // active nav

const FreelancerAddProductPage = () => {
    const [activeNav, setActiveNav] = useState(NAV_ITEMS_KEY);

    const [coreData, setCoreData]       = useState({});
    const [logisticsData, setLogistics] = useState({ clientLocation: "yes" });
    const [variants, setVariants]       = useState([{ price: "2,500", inventory: "5", variantName: "Royal Black" }]);
    const [photos, setPhotos]           = useState([]);

    const handlePublish = () => console.log("Publish", { coreData, logisticsData, variants, photos });
    const handleDraft   = () => console.log("Draft",   { coreData, logisticsData, variants, photos });

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", overflow: "hidden" }}>
            {/* ── Sidebar (reused) ── */}
            <Sidebar
                activeNav={activeNav}
                onNavChange={setActiveNav}
                user={{ name: "Ahmed Al-Saadi", role: "Expert Stylist" }}
            />

            {/* ── Main ── */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Add New Product" notificationCount={0} isOnline />

                {/* Scrollable content */}
                <Box
                    component="main"
                    sx={{ flex: 1, overflowY: "auto", px: { xs: 2, md: 3 }, pt: 3, pb: 0 }}
                >
                    <PageBreadcrumb
                        crumbs={[
                            { label: "Catalog", onClick: () => setActiveNav("catalog") },
                            { label: "Add New Product" },
                        ]}
                        title="Add New Product"
                        subtitle='Curate your next exclusive product for the carefully selected "Aurelian" collection.'
                    />

                    {/* Row 1: Core Details + Logistics */}
                    <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                        <Grid item xs={12} md={7}>
                            <CoreDetails data={coreData} onChange={setCoreData} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Logistics data={logisticsData} onChange={setLogistics} />
                        </Grid>
                    </Grid>

                    {/* Row 2: Customization & Pricing (full width) */}
                    <Box sx={{ mb: 2.5 }}>
                        <CustomizationPricing variants={variants} onVariantsChange={setVariants} />
                    </Box>

                    {/* Row 3: Photo Gallery (full width) */}
                    <Box sx={{ mb: 1 }}>
                        <PhotoGallery photos={photos} onPhotosChange={setPhotos} />
                    </Box>

                    {/* Spacer so sticky bar doesn't cover last section */}
                    <Box sx={{ height: 80 }} />
                </Box>

                {/* ── Sticky Action Bar ── */}
                <ActionBar onSaveDraft={handleDraft} onPublish={handlePublish} />
            </Box>
        </Box>
    );
};

export default FreelancerAddProductPage;