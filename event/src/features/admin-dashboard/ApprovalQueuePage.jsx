import React, { useState } from "react";
import {Box, Typography, TextField, Button, Avatar, Stack} from "@mui/material";
//import SendIcon from '@mui/icons-material/Send';
// الاستيرادات (تأكدي من صحة المسارات)
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import QueueTabs from "./pendingApproval-component/QueueTabs.jsx";
import ProductCard from "./pendingApproval-component/ProductCard.jsx";
import { T, typography } from "./theme";

const MOCK_ITEMS = [


    {


        id: 1,


        type: "SERVICE",


        location: "Rukn Al-Din",


        image:


            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=300&fit=crop",


        title: "Premium Service",


        ownerName: "Luisa Dibbert",


        price: "3,000,000 SYP",


        priceUnit: "Base Price",


        originalName: "خدمة autem المميزة",


        category: "Lighting & Stage Effects",


        description:


            "هذا النص هو مثال لوصف الخدمة المميزة في ركن الدين. توفر أرقى حلول الإضاءة والمؤثرات المسرحية للمناسبات الفاخرة...",


    },


    {
        id: 2,
      type: "PRODUCT",
     location: "Rukn Al-Din",
     image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop",

        title: "Signature Floral Set",
        ownerName: "Aurelian Boutique",
    price: "850,000 SYP",
   priceUnit: "Per Unit",
    category: "Luxury Decor",
        status: "Review Pending",
        description: "تنسيقات زهور حصرية مصممة يدوياً لتناسب القاعات الملكية والمناسبات الرسمية الفاخرة...",
    },



];
export default function ApprovalQueuePage() {
    const [items, setItems] = useState(MOCK_ITEMS);
    const [activeTab, setActiveTab] = useState("Products");
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // ✅ الدوال يجب أن تكون هنا داخل المكون
    const handleApprove = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleRejectClick = (id) => {
        setRejectingId(id);
    };

    const handleConfirmReject = (id) => {
        console.log("Rejecting", id, "Reason:", rejectionReason);
        setItems(prev => prev.filter(item => item.id !== id));
        setRejectingId(null);
        setRejectionReason("");
    };

    return (
        <Box sx={{ display: "flex", bgcolor: T.pageBg, minHeight: "100vh" }}>
            <Sidebar activeItem="Pending Approvals" />
            <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" } }}>
                <TopBar />
                <Box sx={{ p: 4, mt: "64px" }}>
                    <QueueTabs activeTab={activeTab} onChange={setActiveTab} totalPending={items.length} />

                    {items.map((item) => (
                        <Box key={item.id} sx={{ mb: 3 }}>
                            {/* الآن الدوال معرفة ومتاحة هنا */}
                            <ProductCard
                                item={item}
                                onApprove={() => handleApprove(item.id)}
                                onReject={() => handleRejectClick(item.id)}
                                onViewDetails={() => console.log("View", item.id)}
                            />

                            {rejectingId === item.id && (
                                <Box sx={{
                                    mt: 2, p: 2,
                                    bgcolor: T.sidebarBg, // لون الخلفية المتناسق مع السايدبار
                                    borderRadius: 2,
                                    border: `1px solid ${T.border}`
                                }}>
                                    <Typography
                                        variant="overline"
                                        sx={{ display: 'block', mb: 1, fontWeight: 700, color: T.goldLabel, letterSpacing: 1.5 }}
                                    >
                                        REJECTION REASON *
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Please provide a reason for rejection..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    bgcolor: T.cardBg, // خلفية بيضاء
                                                    borderRadius: "8px",
                                                    fontSize: "0.83rem",
                                                    "& fieldset": { borderColor: T.inputBorder },
                                                    "&:hover fieldset": { borderColor: T.gold },
                                                    "&.Mui-focused fieldset": { borderColor: T.gold },
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={() => handleConfirmReject(item.id)}
                                            variant="contained"
                                            disableElevation
                                            sx={{
                                                bgcolor: "#D32F2F", // اللون الأحمر للرفض
                                                color: T.btnText,
                                                fontWeight: 700,
                                                px: 4,
                                                borderRadius: "8px",
                                                "&:hover": { bgcolor: "#B71C1C" }
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}