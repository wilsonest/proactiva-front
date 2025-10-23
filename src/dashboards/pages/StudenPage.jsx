import { useContext } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { UserContext } from "../../auth/context/UserContext";

export default function StudenPage() {
  const {
    userState: { user },
  } = useContext(UserContext);
  const displayName = user?.displayName;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: "650px" }, // 🔹 más ancho y responsive
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="green" gutterBottom>
          Student Dashboard
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome, <strong>{displayName}</strong>
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Available Economic Study Cases
        </Typography>

        {/* 🔹 Contenedor en 2 columnas */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Caso 1 */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Case 1: Budget Analysis
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Resolve this case to earn points.
              </Typography>
              <Button size="small" variant="outlined">
                START
              </Button>
            </Paper>
          </Grid>

          {/* Caso 2 */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Case 2: Financial Planning
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Resolve this case to earn points.
              </Typography>
              <Button size="small" variant="outlined">
                START
              </Button>
            </Paper>
          </Grid>

          {/* 🔹 Caso 3 (extra ejemplo) */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Case 3: Investment Strategies
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Test your skills in long-term planning.
              </Typography>
              <Button size="small" variant="outlined">
                START
              </Button>
            </Paper>
          </Grid>

          {/* 🔹 Caso 4 */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Case 4: Cost Optimization
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Identify savings and efficiency points.
              </Typography>
              <Button size="small" variant="outlined">
                START
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
