import React from "react";
import { Stack } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import StatCard from "./StatCard.jsx";

/**
 * صف الإحصائيات الثلاثة بالأعلى:
 * Total Users / Freelancers / Corporates
 */
const StatsCards = ({ stats }) => {
    // 👑 حماية الكود بقيم افتراضية في حال تأخرت البيانات
    const currentStats = stats || {
        totalUsers: 0,
        freelancersPercent: 0,
        companiesPercent: 0,
    };

    return (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {/* بطاقة إجمالي المستخدمين */}
            <StatCard
                label="Total Users"
                icon={<PeopleAltOutlinedIcon />}
                variant="number"
                value={currentStats.totalUsers} // 👈 ربط حقيقي
                footer="Active accounts on platform"
                trend={false} // أوقفتها مؤقتاً لأن الباك إند حالياً لا يرسل نسبة نمو
            />

            {/* بطاقة الفريلانسرز */}
            <StatCard
                label="Freelancers"
                icon={<PersonSearchOutlinedIcon />}
                variant="percentage"
                value={currentStats.freelancersPercent} // 👈 ربط حقيقي
                footer="Verified Professional Network"
            />

            {/* بطاقة الشركات */}
            <StatCard
                label="Company"
                icon={<ApartmentOutlinedIcon />}
                variant="percentage"
                value={currentStats.companiesPercent} // 👈 ربط حقيقي
                footer="Tier-1 Managed Accounts"
            />
        </Stack>
    );
};

export default StatsCards;