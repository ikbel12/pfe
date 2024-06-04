import React, { useMemo, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import Header from "../../components/Header";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";
import SyncIcon from "@mui/icons-material/Sync";

const Facture = () => {
  const theme = useTheme();
  const [bills, setBills] = useState([
    {
      billId: "",
      orderId: "",
      orderName: "",
      fournisseur: "",
      date: "",
      pdfUrl: "",
      priceWithoutTax: "",
      priceWithTax: "",
    },
  ]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);

  const columns = useMemo(
    () => [
      {
        field: "billId",
        headerName: "Bill ID",
        type: "string",
        width: 100,
        align: "left",
        headerAlign: "left",
        flex: 0.7,
      },
      {
        field: "orderId",
        headerName: "Order ID",
        type: "number",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "orderName",
        headerName: "Order Name",
        type: "string",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "fournisseur",
        headerName: "Fournisseur",
        type: "string",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "date",
        headerName: "Date",
        type: "date",
        flex: 0.4,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "pdfUrl",
        headerName: "PDF URL",
        type: "string",
        flex: 0.6,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "priceWithoutTax",
        headerName: "Price Without Tax",
        type: "number",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "priceWithTax",
        headerName: "Price With Tax",
        type: "number",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteBillClick(row.billId)}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme.palette.primary.dark]
  );

  const handleDeleteBillClick = (id) => {
    setBillToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDeleteBill = async () => {
    console.log(billToDelete);
    try {
      await userRequest.delete(`/facture/${billToDelete}`);
      setBills((prevBills) =>
        prevBills.filter((bill) => bill.billId !== billToDelete)
      );
      setConfirmDeleteDialog(false);
      setBillToDelete(null);
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await userRequest.get("/facture/");
      console.log(response.data);
      setBills(
        response.data.map((bill) => ({
          billId: bill._id,
          orderId: bill.orderId,
          orderName: bill.orderId,
          fournisseur: bill.fournisseur,
          date: new Date(bill.date),
          pdfUrl: bill.pdfUrl,
          priceWithoutTax: bill.priceWithoutTax,
          priceWithTax: bill.priceWithTax,
        }))
      );
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleSyncClick = async () => {
    try {
      await userRequest.get("/sync/sync-bills");
      toast.success("Bills synchronized successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to synchronize bills", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  return (
    <Box>
      <Toaster />
      <Header title={"BILLS"} subTitle={"Managing the Bills"} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          mb: 2,
          px: 2,
        }}
      >
        <Tooltip title="Synchronize">
          <IconButton onClick={handleSyncClick} color="primary">
            <SyncIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ height: 600, mx: "auto", overflowY: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={bills}
          // @ts-ignore
          columns={columns}
          rowHeight={38}
          autoHeight
          getRowId={(row) => row.billId}
        />
      </Box>
      <Dialog
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this bill?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "red",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={handleDeleteBill}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Facture;
