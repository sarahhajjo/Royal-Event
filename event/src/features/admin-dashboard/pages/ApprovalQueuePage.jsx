import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


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
} from "./../approvalsSlice";

import { T } from "./../Theme";

import TopBar from "../components/TopBar.jsx";
import ApprovalHeader from "../pendingApproval-component/ApprovalHeader.jsx";
import ApprovalTabs from "../pendingApproval-component/ApprovalTabs.jsx";
import ApprovalList from "../pendingApproval-component/ApprovalList.jsx";
import * as PropTypes from "prop-types";
import RejectReasonDialog from "../pendingApproval-component/RejectReasonDialog.jsx";
import Sidebar from "../components/Sidebar.jsx";

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
    const pagination      = useSelector(selectApprovalPagination);

    // ⚠️ بدّلي هيدا بمصدر بيانات المستخدم الحقيقي عندك (auth slice مثلاً)
    const currentUser = useSelector((state) => state.auth?.user) || {
        name: "Admin",
        role: "ADMINISTRATOR",
    };

    // dialog state لسبب الرفض
    const [rejectTarget, setRejectTarget] = useState(null); // { id, title } | null

    useEffect(() => {
        dispatch(fetchApprovals());
    }, [dispatch, activeFilter, pagination.page]);

    const handleFilterChange = (value) => dispatch(setActiveFilter(value));
    const handlePageChange   = (page) => dispatch(setPage(page));
    const handleViewDetails  = (item) => navigate(`/admin-dashboard/approvals/${item.id}`);
    const handleApprove      = (id) => dispatch(approveRequest(id));

    const handleRejectClick   = (id) => {
        const item = items.find((i) => i.id === id);
        setRejectTarget({ id, title: item?.title });
    };
    const handleRejectConfirm = (reason) => {
        dispatch(rejectRequest({ id: rejectTarget.id, reason }));
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
        </Box>
    );
}
