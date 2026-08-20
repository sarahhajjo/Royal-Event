import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// استيراد الأيقونات (يمكنك تعديلها حسب ما تستخدمين في مشروعك)
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
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/admin/pending-listings", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // استخراج البيانات والتأكد من أنها مصفوفة
                let items = response.data.data || response.data || [];

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
        navigate("/admin-dashboard/approvals"); // تأكدي أن هذا هو الرابط الصحيح لصفحة الموافقات في الـ Router لديك
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

                {/* 👈 زر الانتقال لصفحة الموافقات */}
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
                                bgcolor: "#FFFFFF", // 👈 التعديل الأساسي هنا: خلفية بيضاء لبطاقة الطلب
                                borderRadius: 2,
                                border: "1px solid rgba(140, 106, 31, 0.15)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.02)", // 👈 إضافة ظل خفيف جداً لتبدو كبطاقة
                                "&:hover": {
                                    borderColor: "#8C6A1F",
                                    bgcolor: "#FFFCF7" // 👈 لون أبيض مائل للذهبي الفاتح عند التمرير
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        bgcolor: "#FAF3E8", // لون مربع الأيقونة ليتناسق مع الثيم
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
                                    border: "1px solid rgba(140, 106, 31, 0.4)", // تخفيف حدة إطار حالة الطلب
                                    color: "#8C6A1F",
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.5px",
                                    bgcolor: "rgba(140, 106, 31, 0.04)" // خلفية خفيفة جداً لحالة الطلب
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