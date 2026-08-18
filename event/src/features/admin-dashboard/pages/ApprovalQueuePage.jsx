import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchApprovals,
    approveRequest,
    rejectRequest,
    setActiveFilter,
    setPage,
    selectApprovalItems,
    selectApprovalStatus,
    selectActiveFilter,
    selectActionStatus,
    selectApprovalPagination, selectApprovalLastPage, selectApprovalTotal, selectApprovalPerPage,
} from "./../approvalsSlice";

import { T } from "./../Theme";

import TopBar from "../components/TopBar.jsx";
import ApprovalHeader from "../pendingApproval-component/ApprovalHeader.jsx";
import ApprovalTabs from "../pendingApproval-component/ApprovalTabs.jsx";
import ApprovalList from "../pendingApproval-component/ApprovalList.jsx";
import * as PropTypes from "prop-types";
import RejectReasonDialog from "../pendingApproval-component/RejectReasonDialog.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ListingDetailsDrawer from "./ListingDetailsDrawer.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";

// 👑 استيراد مكون السلايدر الجانبي لتفاصيل الخدمة

function ApprovalPagination(props) {
    return null;
}

ApprovalPagination.propTypes = {
    pagination: PropTypes.shape({
        page: PropTypes.func,
        lastPage: PropTypes.func,
        total: PropTypes.func,
        perPage: PropTypes.func
    }),
    onPageChange: PropTypes.func
};

export default function ApprovalQueuePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items           = useSelector(selectApprovalItems);
    const status          = useSelector(selectApprovalStatus);
    const activeFilter    = useSelector(selectActiveFilter);
    const actionStatusMap = useSelector(selectActionStatus);

// 👑 التعديل هنا: جلب بيانات الـ pagination منفصلة لتطابق الـ Selectors الجديدة
    const page            = useSelector(selectApprovalPagination);
    const lastPage        = useSelector(selectApprovalLastPage);
    const total           = useSelector(selectApprovalTotal);
    const perPage         = useSelector(selectApprovalPerPage);

// تجميعها في كائن واحد لتمريره للمكونات بسلاسة
    const pagination      = { page, lastPage, total, perPage };

    const currentUser = useSelector((state) => state.auth?.user) || {
        name: "Admin",
        role: "ADMINISTRATOR",
    };
    // dialog state لسبب الرفض
    const [rejectTarget, setRejectTarget] = useState(null);

    // 👑 حالات التحكم بالسلايدر الجانبي للتفاصيل
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        dispatch(fetchApprovals());
    }, [dispatch, activeFilter, pagination.page]);

    const handleFilterChange = (value) => dispatch(setActiveFilter(value));
    const handlePageChange   = (page) => dispatch(setPage(page));

    // 👑 فتح السلايدر الجانبي وتمرير تفاصيل الخدمة المختارة عند الضغط على Details
    // 👑 تعديل دالة عرض التفاصيل لتتوافق مع الـ Listing والـ Job Offer
    const handleViewDetails = async (item) => {
        const rawData = item.raw || item;
        const isJob = rawData.type === 'job' || rawData.job_title !== undefined;

        if (isJob) {
            try {
                // استدعاء تفاصيل الوظيفة من الرابط الذي أرسلتيه
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://127.0.0.1:8000/api/job-offers/${rawData.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSelectedListing({ ...response.data.data, type: 'job' });
            } catch (error) {
                console.error("Failed to fetch job details:", error);
                setSelectedListing({ ...rawData, type: 'job' });
            }
        } else {
            setSelectedListing(rawData);
        }
        setDrawerOpen(true);
    };

    // 👑 تعديل القبول ليدعم الوظائف والـ Listings
    const handleApprove = (id) => {
        const item = items.find((i) => i.id === id);
        const isJob = item?.type === 'job' || item?.raw?.job_title !== undefined;

        dispatch(approveRequest({ id, type: isJob ? 'job' : 'listing' }));
    };

    // 👑 تعديل الرفض ليدعم الوظائف والـ Listings
    const handleRejectClick = (id) => {
        const item = items.find((i) => i.id === id);
        const isJob = item?.type === 'job' || item?.raw?.job_title !== undefined;
        setRejectTarget({ id, title: item?.title, type: isJob ? 'job' : 'listing' });
    };

    const handleRejectConfirm = (reason) => {
        dispatch(rejectRequest({ id: rejectTarget.id, reason, type: rejectTarget.type }));
        setRejectTarget(null);
    };

    return (
        <Box sx={{ bgcolor: T.pageBg, minHeight: "100vh" }}>
            <Sidebar activeItem="Pending Approvals" />
            <TopBar title="Elite Admin" user={currentUser} />

            <Box component="main" sx={{ ml: "240px", pt: "64px" }}>
                <Box sx={{ px: 5, py: 4, maxWidth: 1100 }}>
                    <ApprovalHeader />
                    <ApprovalTabs activeFilter={activeFilter} onChange={handleFilterChange} />
                    <ApprovalList
                        items={items}
                        status={status}
                        actionStatusMap={actionStatusMap}
                        onViewDetails={handleViewDetails}
                        onApprove={handleApprove}
                        onReject={handleRejectClick}
                    />
                    <ApprovalPagination pagination={pagination} onPageChange={handlePageChange} />
                </Box>
            </Box>

            {/* نافذة سبب الرفض */}
            <RejectReasonDialog
                open={!!rejectTarget}
                itemTitle={rejectTarget?.title}
                onClose={() => setRejectTarget(null)}
                onConfirm={handleRejectConfirm}
            />

            {/* 👑 السلايدر الجانبي لعرض تفاصيل الخدمة */}
            <ListingDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                item={selectedListing}
            />
        </Box>
    );
}