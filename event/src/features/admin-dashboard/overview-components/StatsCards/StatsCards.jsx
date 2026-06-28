import React from "react";
import { Stack } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import StatCard from "./StatCard.jsx";

/**
 * صف الإحصائيات الثلاثة بالأعلى:
 * Total Users / Freelancers / Corporates
 *
 * لاحقاً لما تربطها بـ Redux، بس بتجيب الـ data من الـ store
 * وتمررها كـ props هون بدل القيم الثابتة.
 */
const StatsCards = ({ data }) => {
    // قيم افتراضية للعرض - استبدلها بالـ data القادمة من Redux store
    const stats = data || {
        totalUsers: { value: "2.4k", footer: "+12% this month" },
        freelancers: { value: 65, footer: "Verified Professional Network" },
        company: { value: 35, footer: "Tier-1 Managed Accounts" },
    };

    return (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <StatCard
                label="Total Users"
                icon={<PeopleAltOutlinedIcon />}
                variant="number"
                value={stats.totalUsers.value}
                footer={stats.totalUsers.footer}
                trend
            />
            <StatCard
                label="Freelancers"
                icon={<PersonSearchOutlinedIcon />}
                variant="percentage"
                value={stats.freelancers.value}
                footer={stats.freelancers.footer}
            />
            <StatCard
                label="Company"
                icon={<ApartmentOutlinedIcon />}
                variant="percentage"
                value={stats.company.value}
                footer={stats.company.footer}
            />
        </Stack>
    );
};

export default StatsCards;