import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchPaymentReceipts,
    fetchPaymentSummary,
    fetchPaymentProofUrl,
    verifyPayment,
    rejectPayment,
    setSearchTerm,
    selectPaymentItems,
    selectPaymentStatus,
    selectPaymentPagination,
    selectSearchTerm,
    selectPaymentSummary,
    selectProcessingIds,
} from "./../paymentsSlice.js";

import { T } from "./../Theme.jsx";

import TopBar from "../components/TopBar.jsx";
import PaymentSearchBar from "../paymentApprovals-component/PaymentSearchBar.jsx";
import ReceiptsTable from "../paymentApprovals-component/ReceiptsTable.jsx";
import PaymentPageHeader from "../paymentApprovals-component/PaymentPageHeader.jsx";
import RejectReasonDialog from "../pendingApproval-component/RejectReasonDialog.jsx";
import Sidebar from "../components/Sidebar.jsx";

const PAGE_SIZE = 3;

export default function PaymentApprovalsPage() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [rejectTarget, setRejectTarget] = useState(null);

    const items         = useSelector(selectPaymentItems);
    const status         = useSelector(selectPaymentStatus);
    const pagination     = useSelector(selectPaymentPagination);
    const searchTerm    = useSelector(selectSearchTerm);
    const summary       = useSelector(selectPaymentSummary);
    const processingIds = useSelector(selectProcessingIds);

    const currentUser = useSelector((state) => state.auth?.user) || {
        name: "Admin",
        role: "ADMINISTRATOR",
    };

    useEffect(() => {
        dispatch(fetchPaymentSummary());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchPaymentReceipts({
            status: 'pending',
            page: page,
            per_page: 20,
            search: searchTerm
        }));
    }, [dispatch, page, searchTerm]);


    const handleSearchChange = (value) => {
        setPage(1);
        dispatch(setSearchTerm(value));
    };

    const handleViewReceipt = async (item) => {
        if (item.receiptUrl) {
            window.open(item.receiptUrl, "_blank", "noopener");
            return;
        }
        const result = await dispatch(fetchPaymentProofUrl(item.paymentId));
        if (fetchPaymentProofUrl.fulfilled.match(result) && result.payload.url) {
            window.open(result.payload.url, "_blank", "noopener");
        }
    };

    const handleVerify = (paymentId) => dispatch(verifyPayment(paymentId));

    const handleRejectClick = (item) => {
        setRejectTarget({ paymentId: item.paymentId, customerName: item.customerName });
    };
    const handleRejectConfirm = (note) => {
        dispatch(rejectPayment({ paymentId: rejectTarget.paymentId, note }));
        setRejectTarget(null);
    };

    return (
        <Box sx={{ bgcolor: T.pageBg, minHeight: "100vh" }}>
            <Sidebar activeItem="Finances" />
            <TopBar title="" user={currentUser} />

            <Box component="main" sx={{ ml: "240px", pt: "64px" }}>
                <Box sx={{ px: 5, pt: 2 }}>
                    <PaymentSearchBar value={searchTerm} onChange={handleSearchChange} />
                </Box>

                <Box sx={{ px: 5, py: 4 }}>
                    <PaymentPageHeader />

                    <ReceiptsTable
                        items={items}
                        status={status}
                        pagination={pagination}
                        pageSize={PAGE_SIZE}
                        processingIds={processingIds}
                        // 👑 تم إزالة onFilter و onExport من هنا
                        onViewReceipt={handleViewReceipt}
                        onVerify={handleVerify}
                        onReject={handleRejectClick}
                        onPageChange={setPage}
                    />
                </Box>
            </Box>

            <RejectReasonDialog
                open={!!rejectTarget}
                itemTitle={rejectTarget?.customerName}
                onClose={() => setRejectTarget(null)}
                onConfirm={handleRejectConfirm}
            />
        </Box>
    );
}