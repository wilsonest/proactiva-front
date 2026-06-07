import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Divider,
  CircularProgress, Chip, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";

export default function ReviewEvaluationModal({ open, onClose, evaluacion, onConfirm }) {
  const [criterios, setCriterios] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (evaluacion && open) {
      // Cargar detalles de la evaluación
      setCriterios(
        (evaluacion.detalles || []).map((d) => ({
          ...d,
          puntaje_numerico: d.puntaje_numerico,
          comentario_text: d.comentario_text,
        }))
      );
      setObservaciones(evaluacion.observaciones_text || "");
    }
  }, [evaluacion, open]);

  const handlePuntajeChange = (index, value) => {
    const nuevo = [...criterios];
    const val = parseFloat(value);
    if (val >= 0 && val <= 5) {
      nuevo[index].puntaje_numerico = val;
      setCriterios(nuevo);
    }
  };

  const handleComentarioChange = (index, value) => {
    const nuevo = [...criterios];
    nuevo[index].comentario_text = value;
    setCriterios(nuevo);
  };

  const calcularNota = () => {
    if (!criterios.length) return 0;
    const total = criterios.reduce((sum, c) => sum + parseFloat(c.puntaje_numerico || 0), 0);
    return (total / criterios.length).toFixed(2);
  };

  const handleConfirmar = async () => {
    setSaving(true);
    try {
      await onConfirm({
        evaluacion_id: evaluacion.evaluacion_id || evaluacion.id,
        detalles: criterios.map((c) => ({
          criterio_id: c.criterio_id,
          puntaje_numerico: parseFloat(c.puntaje_numerico),
          comentario_text: c.comentario_text,
        })),
        observaciones_text: observaciones,
        nota_total: parseFloat(calcularNota()),
        estado: "final",
      });
      onClose();
    } catch (e) {
      console.error("Error al confirmar evaluación:", e);
    } finally {
      setSaving(false);
    }
  };

  if (!evaluacion) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ background: "darkgreen", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon />
          <Typography fontWeight="bold">Revisar Evaluación IA</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Info del estudiante */}
        <Box sx={{ mb: 2, p: 1.5, background: "#f5faf6", borderRadius: 2, border: "1px solid #c8e6c9" }}>
          <Typography variant="body2" color="text.secondary">
            Estudiante: <strong>{evaluacion.estudiante || "—"}</strong> &nbsp;|&nbsp;
            Caso: <strong>{evaluacion.caso || "—"}</strong> &nbsp;|&nbsp;
            Nota IA original: <strong>{evaluacion.nota_total}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Nota recalculada: <strong style={{ color: "darkgreen", fontSize: "1.1rem" }}>{calcularNota()}</strong>
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Criterios editables */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5, color: "darkgreen" }}>
          Criterios de evaluación
        </Typography>

        {criterios.length === 0 ? (
          <Typography color="text.secondary">Sin criterios disponibles.</Typography>
        ) : (
          criterios.map((c, i) => (
            <Box key={i} sx={{ mb: 2.5, p: 2, border: "1px solid #e0e0e0", borderRadius: 2, background: "#fafafa" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Criterio {i + 1} — ID: {c.criterio_id}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Puntaje (0–5):</Typography>
                  <TextField
                    type="number"
                    value={c.puntaje_numerico}
                    onChange={(e) => handlePuntajeChange(i, e.target.value)}
                    inputProps={{ min: 0, max: 5, step: 0.5 }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                </Box>
              </Box>
              <TextField
                label="Comentario del criterio"
                value={c.comentario_text || ""}
                onChange={(e) => handleComentarioChange(i, e.target.value)}
                fullWidth
                multiline
                minRows={2}
                size="small"
              />
            </Box>
          ))
        )}

        <Divider sx={{ my: 2 }} />

        {/* Observaciones generales */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "darkgreen" }}>
          Observaciones generales
        </Typography>
        <TextField
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          placeholder="Observaciones adicionales para el estudiante..."
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirmar}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} /> : <CheckCircleIcon />}
          sx={{ background: "darkgreen", "&:hover": { background: "#1b5e20" } }}
        >
          {saving ? "Guardando..." : "Confirmar evaluación final"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
