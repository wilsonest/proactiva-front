import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, CircularProgress,
  Snackbar, TextField, IconButton
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useNavigate } from "react-router-dom";
import {
  getEvaluaciones, getEvaluacionDetalle, updateEvaluacion,
  getEntregasById, getCasesById, getUsuarioById
} from "../../api/provider";
import ReviewEvaluationModal from "../components/ReviewEvaluationModal";

export default function ListaAllCalificaciones() {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEval, setSelectedEval] = useState(null);
  const [openReview, setOpenReview] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSev, setAlertSev] = useState("success");

  useEffect(() => {
    loadEvaluaciones();
  }, []);

  const loadEvaluaciones = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      if (!token?.access_token) return;

      const data = await getEvaluaciones(token.access_token);

      // Enriquecer cada evaluación con nombre del estudiante y título del caso
      const enriquecidas = await Promise.all(
        (data || []).map(async (ev) => {
          try {
            const entrega = await getEntregasById(token.access_token, ev.entrega_id);
            const caso = await getCasesById(token.access_token, entrega.caso_id);
            const estudiante = await getUsuarioById(token.access_token, entrega.estudiante_id);
            return {
              ...ev,
              caso_titulo: caso?.titulo || "—",
              estudiante_nombre: estudiante?.nombre_usuario || estudiante?.correo_electronico || "—",
            };
          } catch {
            return {
              ...ev,
              caso_titulo: "—",
              estudiante_nombre: "—",
            };
          }
        })
      );

      setEvaluaciones(enriquecidas);
    } catch (e) {
      console.error("Error cargando evaluaciones:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRevisar = async (ev) => {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      const detalle = await getEvaluacionDetalle(token.access_token, ev.id);
      const entrega = await getEntregasById(token.access_token, ev.entrega_id);
      setSelectedEval({
        ...detalle,
        id: ev.id,
        evaluacion_id: ev.id,
        estudiante: ev.estudiante_nombre || ev.entrega_id,
        caso: ev.caso_titulo || "—",
        nota_total: ev.nota_total,
        respuesta: entrega?.respuesta || "",
        url_archivo: entrega?.url_archivo || null,
      });
      setOpenReview(true);
    } catch (e) {
      console.error("Error cargando detalle:", e);
      setAlertMsg("Error al cargar el detalle de la evaluación");
      setAlertSev("error");
      setOpenAlert(true);
    }
  };

  const handleConfirmar = async (data) => {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      await updateEvaluacion(token.access_token, data.evaluacion_id, {
        detalles: data.detalles,
        observaciones_text: data.observaciones_text,
        nota_total: data.nota_total,
        estado: "final",
      });
      setAlertMsg("Evaluación confirmada como final ✅");
      setAlertSev("success");
      setOpenAlert(true);
      await loadEvaluaciones();
    } catch (e) {
      console.error("Error confirmando evaluación:", e);
      setAlertMsg("Error al confirmar la evaluación");
      setAlertSev("error");
      setOpenAlert(true);
      throw e;
    }
  };

  const filtradas = evaluaciones.filter((ev) => {
    const nombre = (ev.estudiante_nombre || "").toLowerCase();
    const caso = (ev.caso_titulo || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return nombre.includes(term) || caso.includes(term);
  });

  const getEstadoChip = (estado) => {
    if (estado === "final") return <Chip label="Final" color="success" size="small" />;
    return <Chip label="IA (borrador)" color="warning" size="small" />;
  };

  const getNotaColor = (nota) => {
    if (nota >= 4) return "#2e7d32";
    if (nota >= 3) return "#f57c00";
    return "#c62828";
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "darkgreen" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="darkgreen">
          Evaluaciones de Estudiantes
        </Typography>
      </Box>

      {/* Buscador */}
      <TextField
        placeholder="Buscar por estudiante o caso..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      {/* Tabla */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ background: "darkgreen" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Estudiante</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Caso</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Nota</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Fecha</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Evaluado por</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Estado</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: "gray" }}>
                    No hay evaluaciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                filtradas.map((ev, i) => (
                  <TableRow key={ev.id} sx={{ background: i % 2 === 0 ? "#fff" : "#f5faf6" }}>
                    <TableCell>{ev.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="darkgreen">
                        {ev.estudiante_nombre || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ev.caso_titulo || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" sx={{ color: getNotaColor(ev.nota_total) }}>
                        {Number(ev.nota_total).toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {ev.fecha_evaluacion
                        ? new Date(ev.fecha_evaluacion).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {ev.docente_id === null
                        ? <Chip label="IA" size="small" sx={{ background: "#e3f2fd", color: "#1565c0" }} />
                        : <Chip label="Docente" size="small" color="success" />}
                    </TableCell>
                    <TableCell>{getEstadoChip(ev.estado)}</TableCell>
                    <TableCell>
                      {ev.estado !== "final" ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<RateReviewIcon />}
                          onClick={() => handleRevisar(ev)}
                          sx={{ borderColor: "darkgreen", color: "darkgreen", "&:hover": { background: "#e8f5e9" } }}
                        >
                          Revisar
                        </Button>
                      ) : (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleRevisar(ev)}
                          sx={{ color: "gray" }}
                        >
                          Ver detalle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ReviewEvaluationModal
        open={openReview}
        onClose={() => setOpenReview(false)}
        evaluacion={selectedEval}
        onConfirm={handleConfirmar}
      />

      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert onClose={() => setOpenAlert(false)} severity={alertSev} sx={{ width: "100%" }}>
          {alertMsg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
