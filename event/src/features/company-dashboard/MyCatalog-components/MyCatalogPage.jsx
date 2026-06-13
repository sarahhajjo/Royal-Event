import React, { useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Stack,
    Paper,
} from "@mui/material";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { useTheme } from "@mui/material/styles";

import ArrangementCard from "./components/ArrangementCard";
import HallCard from "./components/HallCard";
import ProductCard from "./components/ProductCard";
import OfferSection from "./components/OfferSection";

// ─── Demo data ───────────────────────────────────────────────────────────────
const ARRANGEMENTS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
        category: "Luxury Wedding",
        title: "Royal Andalusia Palace Arrangement",
        rating: 4.9,
        price: 7500,
        currency: "SAR",
        availableFrom: "Oct 15",
        availableTo: "Oct 22, 2024",
        eventType: "Grand Ceremonies",
        status: "confirmed",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
        category: "Business Meet",
        title: "Elite Executive Arrangement",
        rating: 4.7,
        price: 4200,
        currency: "SAR",
        availableFrom: "Oct 25",
        availableTo: "Oct 30, 2024",
        eventType: "Corporate Meetings",
        status: "confirmed",
    },
];

const PRODUCTS_PUBLISHED = [
    {
        id: 101,
        image: "https://images.unsplash.com/photo-1612198790700-588f7b3e6c29?w=400&q=80",
        category: "Home Decor",
        title: "Premium Crystal Vase Set",
        rating: 4.8,
        price: 450,
        currency: "SAR",
        colorOptions: ["#c0c0c0", "#1a1a2e", "#4a90d9"],
        extraColors: 3,
        availableFrom: "Oct 15",
        availableTo: "Oct 22, 2024",
        status: "published",
    },
    {
        id: 102,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
        category: "Furniture",
        title: "Venice Golden Occasional Chair",
        rating: 4.6,
        price: 120,
        currency: "SAR",
        colorOptions: ["#f5f0e8", "#c9a84c"],
        extraColors: 0,
        availableFrom: "Oct 15",
        availableTo: "Oct 22, 2024",
        status: "published",
    },
];

const PRODUCTS_SAVED = [];

const HALLS = [
    {
        id: 201,
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&q=80",
        category: "Banquet Hall",
        title: "Grand Crystal Ballroom",
        rating: 4.9,
        price: 15000,
        currency: "SAR",
        location: "Al-Nakheel District, Riyadh",
        date: "Nov 10, 2024",
        timeFrom: "08:00 AM",
        timeTo: "11:00 PM",
        status: "confirmed",
    },
];

const PAGE_TABS = ["Pending", "Approved", "Rejected", "Cancelled"];

// ─── Products sub-tab toggle ─────────────────────────────────────────────────
function ProductsToggle({ value, onChange }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.3)';

    return (
        <Stack direction="row" spacing={0} sx={{ border: `1px solid ${borderColor}`, borderRadius: "8px", overflow: "hidden" }}>
            {["Published", "Saved"].map((label) => (
                <Button
                    key={label}
                    disableRipple
                    onClick={() => onChange(label.toLowerCase())}
                    sx={{
                        px: 2,
                        py: 0.6,
                        borderRadius: 0,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "none",
                        bgcolor: value === label.toLowerCase() ? theme.palette.primary.main : "transparent",
                        color: value === label.toLowerCase() ? theme.palette.background.default : theme.palette.text.secondary,
                        "&:hover": {
                            bgcolor: value === label.toLowerCase() ? theme.palette.primary.main : (isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(179, 140, 69, 0.05)'),
                        },
                    }}
                >
                    {label}
                </Button>
            ))}
        </Stack>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ message, hint }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.2)' : 'rgba(179, 140, 69, 0.2)';

    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                py: 5,
                textAlign: "center",
            }}
        >
            <InventoryOutlinedIcon sx={{ fontSize: 36, color: theme.palette.text.secondary, mb: 1.5 }} />
            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5 }}>{message}</Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>{hint}</Typography>
        </Paper>
    );
}

// ─── Sub-section label (Saved Drafts / Published Products) ───────────────────
function SubSectionLabel({ icon, label }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box sx={{ color: theme.palette.text.secondary, display: "flex", alignItems: "center" }}>{icon}</Box>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.82rem", fontWeight: 600 }}>{label}</Typography>
        </Box>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MyCatalogPage() {
    const [pageTab, setPageTab] = useState(1);
    const [productTab, setProductTab] = useState("published");

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.2)' : 'rgba(179, 140, 69, 0.2)';

    const handleEdit = (id) => console.log("Edit", id);
    const handleView = (id) => console.log("View", id);
    const handleDelete = (id) => console.log("Delete", id);

    const displayedProducts = productTab === "published" ? PRODUCTS_PUBLISHED : PRODUCTS_SAVED;

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ width: '100%', ml: '-3%', mt: '-4%' }}>

                {/* Page heading */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 1 }}>
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                border: `2px solid ${theme.palette.primary.main}`,
                                transform: 'rotate(45deg)',
                                boxShadow: `0 0 10px ${theme.palette.primary.main}40`,
                                flexShrink: 0
                            }}
                        />
                        <Typography variant="h3" sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2.5rem',
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            m: 0
                        }}>
                            My Catalog
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 300 }}>
                        Manage and organize all your available offers on the Aurelian Reserve platform
                    </Typography>
                </Box>

                {/* ── Page-level tab bar ─────────────────────────────────────────── */}
                <Box sx={{ borderBottom: `1px solid ${borderColor}`, mb: 4 }}>
                    <Tabs
                        value={pageTab}
                        onChange={(_, v) => setPageTab(v)}
                        variant="fullWidth"
                        sx={{
                            minHeight: 44,
                            "& .MuiTabs-indicator": { bgcolor: theme.palette.primary.main, height: 2 },
                        }}
                    >
                        {PAGE_TABS.map((label, i) => (
                            <Tab
                                key={label}
                                label={label}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    minHeight: 44,
                                    px: 2,
                                    "&.Mui-selected": { color: theme.palette.primary.main },
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* ── Ready Arrangements section ─────────────────────────────── */}
                <OfferSection title="Ready Arrangements">
                    {ARRANGEMENTS.map((arr) => (
                        <ArrangementCard
                            key={arr.id}
                            arrangement={arr}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDelete}
                        />
                    ))}
                </OfferSection>

                {/* ── Products section ───────────────────────────────────────── */}
                <OfferSection
                    title="Products"
                    headerRight={<ProductsToggle value={productTab} onChange={setProductTab} />}
                >
                    {productTab === "saved" && (
                        <Box>
                            <SubSectionLabel
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4M22 10l-2 10H4L2 10M22 10H2" />
                                    </svg>
                                }
                                label="Saved Drafts"
                            />
                            {displayedProducts.length === 0 ? (
                                <EmptyState
                                    message="No saved products in draft"
                                    hint="Your unfinished product listings will appear here."
                                />
                            ) : (
                                <Stack spacing={2}>
                                    {displayedProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    )}

                    {productTab === "published" && (
                        <Box>
                            <SubSectionLabel
                                icon={
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                }
                                label="Published Products"
                            />
                            <Stack spacing={2}>
                                {PRODUCTS_PUBLISHED.map((p) => (
                                    <ProductCard key={p.id} product={p} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                                ))}
                            </Stack>
                        </Box>
                    )}
                </OfferSection>

                {/* ── Halls for Rent section ─────────────────────────────────── */}
                <OfferSection title="Halls for Rent">
                    {HALLS.map((hall) => (
                        <HallCard
                            key={hall.id}
                            hall={hall}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDelete}
                        />
                    ))}
                </OfferSection>
            </Box>
        </Box>
    );
}