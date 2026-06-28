import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Button, Stack, Paper, CircularProgress } from "@mui/material";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import ArrangementCard from "./components/ArrangementCard";
import HallCard from "./components/HallCard";
import ProductCard from "./components/ProductCard";
import OfferSection from "./components/OfferSection";
import Halldetailpage from "./details-hall/Halldetailpage";
import Productdetailpage from "./details-hall/Productdetailpage";
// 💡 استدعاء صفحة تفاصيل التنسيق
import Arrangmentdetailpage from "./details-hall/Arrangmentdetailpage";

// 💡 استيراد الأكشنز من الـ Slice (بما فيها التنسيقات)
import { fetchMyProducts, fetchMyServices, fetchMyArrangements } from "./myCatalogSlice";

const PAGE_TABS = ["Pending", "Approved", "Rejected", "Cancelled"];

// ─── Helper: معالجة مسار الصور ────────────────────────────────────────────────
const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
    const BACKEND_URL = 'http://127.0.0.1:8000';

    let finalUrl = url;

    // 💡 إذا كان الرابط يحتوي على /uploads/ ولكن لا يحتوي على /storage/، نقوم بإجبار إضافتها
    if (finalUrl.includes('/uploads/') && !finalUrl.includes('/storage/')) {
        finalUrl = finalUrl.replace('/uploads/', '/storage/uploads/');
    }

    // إذا كان الرابط كامل (http)، نرجعه بعد التعديل
    if (finalUrl.startsWith('http')) return finalUrl;

    // إذا كان مساراً جزئياً (Relative Path)
    const cleanPath = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`;
    if (cleanPath.startsWith('/storage/')) return `${BACKEND_URL}${cleanPath}`;

    return `${BACKEND_URL}/storage${cleanPath}`;
};

// ─── Products sub-tab toggle ──────────────────────────────────────────────────
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
                        px: 2, py: 0.6, borderRadius: 0, fontSize: "0.75rem", fontWeight: 600, textTransform: "none",
                        bgcolor: value === label.toLowerCase() ? theme.palette.primary.main : "transparent",
                        color: value === label.toLowerCase() ? theme.palette.background.default : theme.palette.text.secondary,
                        "&:hover": { bgcolor: value === label.toLowerCase() ? theme.palette.primary.main : (isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(179, 140, 69, 0.05)') },
                    }}
                >
                    {label}
                </Button>
            ))}
        </Stack>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ message, hint }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.2)' : 'rgba(179, 140, 69, 0.2)';

    return (
        <Paper elevation={0} sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${borderColor}`, borderRadius: "12px", py: 5, textAlign: "center" }}>
            <InventoryOutlinedIcon sx={{ fontSize: 36, color: theme.palette.text.secondary, mb: 1.5 }} />
            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5 }}>{message}</Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>{hint}</Typography>
        </Paper>
    );
}

// ─── Sub-section label ────────────────────────────────────────────────────────
function SubSectionLabel({ icon, label }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box sx={{ color: theme.palette.text.secondary, display: "flex", alignItems: "center" }}>{icon}</Box>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.82rem", fontWeight: 600 }}>{label}</Typography>
        </Box>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyCatalogPage({
                                          externalHallId = null,
                                          externalProductId = null,
                                          externalArrangementId = null, // 💡 إضافة معرف التنسيق
                                          onClearHall = null,
                                          onClearProduct = null,
                                          onClearArrangement = null,    // 💡 تفريغ التنسيق
                                          onSelectHall = null,
                                          onSelectProduct = null,
                                          onSelectArrangement = null,   // 💡 تحديد التنسيق
                                      }) {
    // 💡 1 تعني التاب "Approved"
    const [pageTab, setPageTab] = useState(1);
    const [productTab, setProductTab] = useState("published");

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.2)' : 'rgba(179, 140, 69, 0.2)';

    const dispatch = useDispatch();

    // 💡 سحب البيانات من الستيت وتضمين arrangements
    const { products = [], services: halls = [], arrangements = [], loading = false } = useSelector((state) => state.myCatalog || {});

    useEffect(() => {
        dispatch(fetchMyProducts());
        dispatch(fetchMyServices());
        dispatch(fetchMyArrangements()); // 💡 جلب التنسيقات
    }, [dispatch]);

    const handleEdit = (id) => console.log("Edit", id);
    const handleDelete = (id) => console.log("Delete", id);

    // ── Detail modes ──
    if (externalHallId !== null) return <Halldetailpage hallId={externalHallId} onBack={onClearHall} />;
    if (externalProductId !== null) return <Productdetailpage productId={externalProductId} onBack={onClearProduct} />;
    // 💡 فتح صفحة تفاصيل التنسيق
    if (externalArrangementId !== null) return <Arrangmentdetailpage arrangementId={externalArrangementId} onBack={onClearArrangement} />;


    // ─── Mapping & Filtering Logic ───

    // 1. تحديد الحالة الفعالة بناءً على التاب الذي يختاره المستخدم
    // 0 = Pending, 1 = Approved, 2 = Rejected, 3 = Cancelled
    const tabStatuses = ["pending_approval", "approved", "rejected", "cancelled"];
    const activeStatusFilter = tabStatuses[pageTab];

    // ── تحويل وتجهيز التنسيقات (Arrangements) ──
    const mappedArrangements = arrangements.map(arr => {
        let availableFrom = null;
        let availableTo = null;
        if (arr.availabilities?.length > 0) {
            availableFrom = dayjs(arr.availabilities[0].available_date).format('MMM DD');
            availableTo = dayjs(arr.availabilities[arr.availabilities.length - 1].available_date).format('MMM DD, YYYY');
        }

        const rawImage = arr.images?.[0]?.url || arr.images?.[0]?.path;

        return {
            id: arr.id,
            image: fixImageUrl(rawImage),
            category: arr.category?.name?.en || arr.category?.name || "Arrangement",
            title: arr.title?.en || arr.title || "Untitled Arrangement",
            rating: 5.0,
            price: arr.price || 0,
            currency: arr.currency || "SAR",
            availableFrom,
            availableTo,
            eventType: "Custom Event",
            status: arr.moderation_status // حالة التنسيق (pending_approval, approved, ...)
        };
    });

    const displayedArrangements = mappedArrangements.filter(a => a.status === activeStatusFilter);


    // ── تحويل وتجهيز المنتجات (Products) ──
    const mappedProducts = products.map(p => {
        const mainVariant = p.variants?.[0] || {};
        const availabilities = mainVariant.availabilities || [];

        let availableFrom = null;
        let availableTo = null;
        if (availabilities.length > 0) {
            availableFrom = dayjs(availabilities[0].available_date).format('MMM DD');
            availableTo = dayjs(availabilities[availabilities.length - 1].available_date).format('MMM DD, YYYY');
        }

        const rawImage = p.image?.url || p.image?.path || mainVariant.images?.[0]?.url || mainVariant.images?.[0]?.path;

        return {
            id: p.id,
            image: fixImageUrl(rawImage),
            category: p.category?.name?.en || p.category?.name || "Product",
            title: p.title?.en || p.title || "Untitled",
            rating: 4.8,
            reviewCount: null,
            price: mainVariant.price || 0,
            currency: mainVariant.currency || "SAR",
            colorOptions: p.variants?.map(v => v.name?.en || v.name) || [],
            extraColors: p.variants?.length > 3 ? p.variants.length - 3 : 0,
            availableFrom,
            availableTo,
            status: p.moderation_status || p.status
        };
    });

    const displayedProducts = mappedProducts.filter(p => {
        if (productTab === "saved") return p.status === "draft";
        return p.status === activeStatusFilter;
    });

    // ── تحويل وتجهيز الصالات (Halls / Services) ──
    const mappedHalls = halls.map(h => {
        const mainVariant = h.variants?.[0] || {};
        const availabilities = mainVariant.availabilities || [];

        let date = null;
        let timeFrom = null;
        let timeTo = null;

        if (availabilities.length > 0) {
            date = dayjs(availabilities[0].available_date).format('MMM DD, YYYY');
            const slots = availabilities[0].slots || [];
            if (slots.length > 0) {
                timeFrom = slots[0].start_time ? dayjs(`2024-01-01T${slots[0].start_time}`).format('hh:mm A') : '';
                timeTo = slots[0].end_time ? dayjs(`2024-01-01T${slots[0].end_time}`).format('hh:mm A') : '';
            }
        }

        const rawImage = h.images?.[0]?.url || h.images?.[0]?.path;

        return {
            id: h.id,
            image: fixImageUrl(rawImage),
            category: h.category?.name?.en || h.category?.name || "Banquet Hall",
            title: h.title?.en || h.title || "Untitled Hall",
            rating: 4.9,
            reviewCount: null,
            price: mainVariant.price || 0,
            currency: mainVariant.currency || "SAR",
            location: h.district?.name?.en || h.district?.name || "Unknown Location",
            date,
            timeFrom,
            timeTo,
            status: h.status
        };
    });

    const displayedHalls = mappedHalls.filter(h => h.status === activeStatusFilter);


    return (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ width: '100%', ml: '-3%', mt: '-4%' }}>

                {/* Page heading */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 1 }}>
                        <Box sx={{ width: 14, height: 14, border: `2px solid ${theme.palette.primary.main}`, transform: 'rotate(45deg)', boxShadow: `0 0 10px ${theme.palette.primary.main}40`, flexShrink: 0 }} />
                        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: theme.palette.primary.main, fontWeight: 500, m: 0 }}>
                            My Catalog
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 300 }}>
                        Manage and organize all your available offers on the Aurelian Reserve platform
                    </Typography>
                </Box>

                {/* Page-level tab bar */}
                <Box sx={{ borderBottom: `1px solid ${borderColor}`, mb: 4 }}>
                    <Tabs value={pageTab} onChange={(_, v) => setPageTab(v)} variant="fullWidth" sx={{ minHeight: 44, "& .MuiTabs-indicator": { bgcolor: theme.palette.primary.main, height: 2 } }}>
                        {PAGE_TABS.map((label) => (
                            <Tab key={label} label={label} sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem", fontWeight: 600, textTransform: "none", minHeight: 44, px: 2, "&.Mui-selected": { color: theme.palette.primary.main } }} />
                        ))}
                    </Tabs>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <>
                        {/* 💡 Arrangements Section */}
                        <OfferSection title="Ready Arrangements">
                            {displayedArrangements.length === 0 ? (
                                <EmptyState message={`No ${PAGE_TABS[pageTab].toLowerCase()} arrangements`} hint="Change the tab above to see other packages." />
                            ) : (
                                <Stack spacing={2}>
                                    {displayedArrangements.map((arr) => (
                                        <ArrangementCard
                                            key={arr.id}
                                            arrangement={{...arr, status: PAGE_TABS[pageTab].toLowerCase()}}
                                            onEdit={handleEdit}
                                            onView={() => onSelectArrangement?.(arr.id)}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </OfferSection>

                        {/* Products Section */}
                        <OfferSection title="Products" headerRight={<ProductsToggle value={productTab} onChange={setProductTab} />}>
                            {productTab === "saved" && (
                                <Box>
                                    <SubSectionLabel icon={<InventoryOutlinedIcon sx={{fontSize: 14}}/>} label="Saved Drafts" />
                                    {displayedProducts.length === 0 ? (
                                        <EmptyState message="No saved products in draft" hint="Your unfinished product listings will appear here." />
                                    ) : (
                                        <Stack spacing={2}>
                                            {displayedProducts.map((p) => (
                                                <ProductCard
                                                    key={p.id}
                                                    product={{...p, status: 'saved'}}
                                                    onEdit={handleEdit}
                                                    onView={() => onSelectProduct?.(p.id)}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            )}

                            {productTab === "published" && (
                                <Box>
                                    <SubSectionLabel icon={<InventoryOutlinedIcon sx={{fontSize: 14}}/>} label={`Products (${PAGE_TABS[pageTab]})`} />
                                    {displayedProducts.length === 0 ? (
                                        <EmptyState message={`No ${PAGE_TABS[pageTab].toLowerCase()} products`} hint="Change the tab above to see other products." />
                                    ) : (
                                        <Stack spacing={2}>
                                            {displayedProducts.map((p) => (
                                                <ProductCard
                                                    key={p.id}
                                                    product={{...p, status: 'published'}}
                                                    onEdit={handleEdit}
                                                    onView={() => onSelectProduct?.(p.id)}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            )}
                        </OfferSection>

                        {/* Halls for Rent Section */}
                        <OfferSection title="Halls for Rent">
                            {displayedHalls.length === 0 ? (
                                <EmptyState message={`No ${PAGE_TABS[pageTab].toLowerCase()} halls available`} hint="Change the tab above to see other halls." />
                            ) : (
                                <Stack spacing={2}>
                                    {displayedHalls.map((hall) => (
                                        <HallCard
                                            key={hall.id}
                                            hall={{...hall, status: PAGE_TABS[pageTab].toLowerCase()}}
                                            onEdit={handleEdit}
                                            onView={() => onSelectHall?.(hall.id)}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </OfferSection>
                    </>
                )}
            </Box>
        </Box>
    );
}