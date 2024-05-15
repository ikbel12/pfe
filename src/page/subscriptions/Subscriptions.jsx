import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import Header from "../../components/Header";
import { rows } from "./data";

const Subscriptions = () => {
  const theme = useTheme();

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "name",
      headerName: "Subscription Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "client",
      headerName: "Client",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "startDate",
      headerName: "Start date",
      headerAlign: "left",
      align: "left",
      width: 120,
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      headerAlign: "left",
      align: "left",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            sx={{
              p: "5px",
              width: "99px",
              borderRadius: "3px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 1,
              backgroundColor:
                status === "Expired"
                  ? theme.palette.error.main // Rouge pour Expired
                  : status === "Not expired"
                  ? theme.palette.success.main // Vert pour Not expired
                  : "#3da58a",
            }}
          >
            {status === "Expired" && (
              <WarningAmberOutlinedIcon
                sx={{ color: "#fff" }}
                fontSize="small"
              />
            )}
            {status === "Not expired" && (
              <GppGoodOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
            )}

            <Typography sx={{ fontSize: "13px", color: "#fff" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Header title="Subscriptions " subTitle="List of CLOUD Subscriptions  " />

      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          // @ts-ignore
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Subscriptions;
