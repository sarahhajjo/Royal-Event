import React from "react";
import { Box } from "@mui/material";
import ReceiptsTableToolbar from "./ReceiptsTableToolbar";
import ReceiptsTableHead from "./ReceiptsTableHead";
import ReceiptsTableBody from "./ReceiptsTableBody";
import ReceiptsTableFooter from "./ReceiptsTableFooter";
import { T } from "../Theme";

/**
 * ReceiptsTable — full "Recent Receipts" card (toolbar + table + pagination)
 */
export default function ReceiptsTable({
                                          items,
                                          status,
                                          pagination,
                                          pageSize,
                                          processingIds,
                                          // 👑 تم إزالة onFilter و onExport من هنا
                                          onViewReceipt,
                                          onVerify,
                                          onReject,
                                          onPageChange,
                                      }) {
    return (
        <Box sx={{ bgcolor: T.cardBg, border: `1px solid ${T.border}`, borderRadius: "12px", overflow: "hidden" }}>
            {/* 👑 تم إزالة تمرير الدوال هنا أيضاً */}
            <ReceiptsTableToolbar />

            <ReceiptsTableHead />
            <ReceiptsTableBody
                items={items}
                status={status}
                processingIds={processingIds}
                onViewReceipt={onViewReceipt}
                onVerify={onVerify}
                onReject={onReject}
            />
            <ReceiptsTableFooter pagination={pagination} pageSize={pageSize} onPageChange={onPageChange} />
        </Box>
    );
}