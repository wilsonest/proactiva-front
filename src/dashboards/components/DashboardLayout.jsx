import React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "./AppBar";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 🔹 AppBar arriba */}
      <ResponsiveAppBar />

      {/* 🔹 Contenido debajo */}
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {children}
      </Box>
    </Box>
  );
}
