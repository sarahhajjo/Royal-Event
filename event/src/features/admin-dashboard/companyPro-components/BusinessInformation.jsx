import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import LanguageOutlinedIcon       from "@mui/icons-material/LanguageOutlined";
import TranslateOutlinedIcon      from "@mui/icons-material/TranslateOutlined";
import ReceiptLongOutlinedIcon    from "@mui/icons-material/ReceiptLongOutlined"; // أيقونة الرقم الضريبي
import AssignmentOutlinedIcon     from "@mui/icons-material/AssignmentOutlined";  // أيقونة رقم السجل
import { T, typography } from "../theme";

/**
 * Props — mapped from API response:
 * user: { settings_language, settings_theme }
 * provider: { brand_name, provider_type, moderation_status, details }
 */
const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: "8px", border: `1px solid ${T.border}`,
            bgcolor: T.pageBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon sx={{ fontSize: 15, color: T.goldLabel }} />
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography sx={{ ...typography.colHeader, mb: 0.2 }}>{label}</Typography>
            <Typography sx={{ fontSize: "0.92rem", color: T.textPrimary }}>{value || "—"}</Typography>
        </Box>
    </Box>
);
const BusinessInformation = ({ data }) => {
    // data هنا هي كائن business القادم من الـ Parent
    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <BusinessCenterOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Business Information
                </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography sx={{ ...typography.colHeader, mb: 0.6 }}>BRAND NAME</Typography>
                <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "8px", px: 1.8, py: 1.1, bgcolor: T.cardBg }}>
                    <Typography sx={{ fontSize: "0.92rem", color: T.textPrimary }}>{data?.brand_name || "—"}</Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: T.border, my: 2 }} />

            <InfoRow icon={ReceiptLongOutlinedIcon} label="TAX NUMBER" value={data?.tax_number} />
            <Divider sx={{ borderColor: T.border, my: 2 }} />
            <InfoRow icon={AssignmentOutlinedIcon} label="REGISTRATION NO." value={data?.registration_no} />
        </Box>
    );
};

export default BusinessInformation;