import { useContext } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { UserContext } from "../../auth/context/UserContext";

export default function TeacherPage() {
  const {userState: { user }} = useContext(UserContext);
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
          Panel de profesor
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Bienvenido, <strong>{displayName}</strong>
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Casos resueltos por estudiantes
        </Typography>

        {/* 🔹 Contenedor en 2 columnas */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Caso 1 */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Caso 1: Análisis de presupuesto
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Resuelto por: {displayName}.
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Puntuacion: 90%.
              </Typography>

              <Button size="small" variant="outlined">
                Revisar
              </Button>
            </Paper>
          </Grid>

          {/* Caso 2 */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Case 2: Planificación financiera
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Resuelto por: {displayName}.
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Puntuacion: 90%.
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
                Caso 1: Análisis de presupuesto
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Resuelto por: {displayName}.
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Puntuacion: 90%.
              </Typography>

              <Button size="small" variant="outlined">
                Revisar
              </Button>
            </Paper>
          </Grid>

          {/* 🔹 Caso 4 */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight="bold">
                Case 2: Planificación financiera
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Resuelto por: {displayName}.
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Puntuacion: 90%.
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
