import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

// 👑 1. استيراد adminService بدلاً من axios العادي
// ⚠️ ملاحظة: تأكدي من مسار الاستيراد حسب مكان الملف عندك في المشروع
import adminService from "../../../../services/adminService/adminService.js";
import BusinessIcon from "@mui/icons-material/Business";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import CelebrationIcon from "@mui/icons-material/Celebration";

const PendingApproval = () => {
    const navigate = useNavigate();
    const [pendingListings, setPendingListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPendingListings = async () => {
            try {
                // 👑 2. استخدام التابع الجاهز اللي بيجيب البيانات من النيغروك وبضيف التوكن لحالو!
                const data = await adminService.getListings();

                // استخراج البيانات والتأكد من أنها مصفوفة (حسب طبيعة الاستجابة من لارافيل)
                let items = data.data || data || [];

                // أخذ أول 3 طلبات فقط وتنسيقها لتناسب الواجهة
                const formattedItems = items.slice(0, 3).map(item => {
                    // تحديد الأيقونة المناسبة بناءً على نوع الخدمة
                    let ItemIcon = BusinessIcon;
                    if (item.type === "physical_product") ItemIcon = EmojiObjectsIcon;
                    if (item.type === "package") ItemIcon = CelebrationIcon;

                    return {
                        id: item.id,
                        title: item.title || item.name || "Untitled Listing",
                        type: item.type ? item.type.replace("_", " ") : "Listing",
                        submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recently",
                        status: "UNDER REVIEW",
                        Icon: ItemIcon
                    };
                });

                setPendingListings(formattedItems);
            } catch (error) {
                console.error("Failed to fetch pending listings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingListings();
    }, []);

    // دالة الانتقال لصفحة الموافقات الكاملة
    const handleViewAll = () => {
        navigate("/admin-dashboard/approvals");
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            color: "#1C1712",
                        }}
                    >
                        Pending Approval
                    </Typography>
                    <Box
                        sx={{
                            bgcolor: "#EADDC5",
                            color: "#8C6A1F",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                        }}
                    >
                        {pendingListings.length} PENDING
                    </Box>
                </Box>

                <Button
                    onClick={handleViewAll}
                    sx={{
                        color: "#8C6A1F",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                    }}
                >
                    VIEW ALL
                </Button>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress sx={{ color: "#8C6A1F" }} />
                </Box>
            ) : pendingListings.length === 0 ? (
                <Typography sx={{ color: "#7A6F5E", textAlign: "center", py: 4 }}>
                    No pending approvals at the moment.
                </Typography>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {pendingListings.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                bgcolor: "#FFFFFF",
                                borderRadius: 2,
                                border: "1px solid rgba(140, 106, 31, 0.15)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                                "&:hover": {
                                    borderColor: "#8C6A1F",
                                    bgcolor: "#FFFCF7"
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        bgcolor: "#FAF3E8",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#8C6A1F"
                                    }}
                                >
                                    <item.Icon fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: "#1C1712", fontSize: "0.95rem" }}>
                                        {item.title}
                                        <Typography component="span" sx={{ color: "#7A6F5E", fontWeight: 400, ml: 1 }}>
                                            - {item.type}
                                        </Typography>
                                    </Typography>
                                    <Typography sx={{ color: "#7A6F5E", fontSize: "0.75rem", mt: 0.5 }}>
                                        Submitted: {item.submittedAt}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    border: "1px solid rgba(140, 106, 31, 0.4)",
                                    color: "#8C6A1F",
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.5px",
                                    bgcolor: "rgba(140, 106, 31, 0.04)"
                                }}
                            >
                                {item.status}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default PendingApproval;