import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as PropTypes from "prop-types";

// 👑 1. إزالة axios واستيراد الخدمة الموحدة
import adminService from "../../../services/adminService/adminService.js";

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
    selectApprovalPagination,
    selectApprovalLastPage,
    selectApprovalTotal,
    selectApprovalPerPage,
} from "./../approvalsSlice";

import { T } from "./../Theme";
import TopBar from "../components/TopBar.jsx";
import ApprovalHeader from "../pendingApproval-component/ApprovalHeader.jsx";
import ApprovalTabs from "../pendingApproval-component/ApprovalTabs.jsx";
import ApprovalList from "../pendingApproval-component/ApprovalList.jsx";
import RejectReasonDialog from "../pendingApproval-component/RejectReasonDialog.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ListingDetailsDrawer from "./ListingDetailsDrawer.jsx";

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

    const page            = useSelector(selectApprovalPagination);
    const lastPage        = useSelector(selectApprovalLastPage);
    const total           = useSelector(selectApprovalTotal);
    const perPage         = useSelector(selectApprovalPerPage);

    const pagination      = { page, lastPage, total, perPage };

    const currentUser = useSelector((state) => state.auth?.user) || {
        name: "Admin",
        role: "ADMINISTRATOR",
    };

    const [rejectTarget, setRejectTarget] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        dispatch(fetchApprovals());
    }, [dispatch, activeFilter, pagination.page]);

    const handleFilterChange = (value) => dispatch(setActiveFilter(value));
    const handlePageChange   = (page) => dispatch(setPage(page));

    // 👑 2. تعديل الدالة لاستخدام adminService بدلاً من الروابط المباشرة
    const handleViewDetails = async (item) => {
        const rawData = item.raw || item;
        const isJob = rawData.type === 'job' || rawData.job_title !== undefined;

        if (isJob) {
            try {
                // 👑 جلب التفاصيل عبر الخدمة الموحدة بدلاً من الرابط المباشر
                const response = await adminService.getJobOfferById(rawData.id);

                // التأكد من استخراج البيانات بشكل صحيح سواء كانت مغلفة بـ data أم لا
                const data = response.data !== undefined ? response.data : response;
                setSelectedListing({ ...data, type: 'job' });
            } catch (error) {
                console.error("Failed to fetch job details:", error);
                setSelectedListing({ ...rawData, type: 'job' });
            }
        } else {
            setSelectedListing(rawData);
        }
        setDrawerOpen(true);
    };

    const handleApprove = (id) => {
        const item = items.find((i) => i.id === id);
        const isJob = item?.type === 'job' || item?.raw?.job_title !== undefined;
        dispatch(approveRequest({ id, type: isJob ? 'job' : 'listing' }));
    };

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

            <RejectReasonDialog
                open={!!rejectTarget}
                itemTitle={rejectTarget?.title}
                onClose={() => setRejectTarget(null)}
                onConfirm={handleRejectConfirm}
            />

            <ListingDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                item={selectedListing}
            />
        </Box>
    );
}