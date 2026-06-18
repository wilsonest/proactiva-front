import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, CircularProgress,
  IconButton, Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { analizarDocumento, confirmarCaso } from "../../api/provider";

export default function UploadCaseModal({ open, onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [archivoBase64, setArchivoBase64] = useState("");
  const [tipoMime, setTipoMime] = useState("");
  const [archivoNombre, setArchivoNombre] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombreRubrica, setNombreRubrica] = useState("");
  const [descripcionRubrica, setDescripcionRubrica] = useState("");
  const [criterios, setCriterios] = useState([]);

  const resetModal = () => {
    setArchivo(null); setCargando(false); setPaso(1); setDatos(null);
    setError(""); setTitulo(""); setDescripcion(""); setNombreRubrica("");
    setDescripcionRubrica(""); setCriterios([]);
    setArchivoBase64(""); setTipoMime(""); setArchivoNombre("");
  };

  const handleClose = () => { resetModal(); onClose(); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "pdf") {
        setError("Solo se aceptan archivos pdf");
        return;
      }
      setArchivo(file);
      setError("");
    }
  };

  const handleAnalizar = async () => {
    if (!archivo) { setError("Selecciona un archivo primero"); return; }
    setCargando(true); setError("");
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      const resultado = await analizarDocumento(token.access_token, archivo);
      const d = resultado.datos_extraidos;
      setTitulo(d.titulo || "");
      setDescripcion(d.descripcion || "");
      setNombreRubrica(d.nombre_rubrica || "");
      setDescripcionRubrica(d.descripcion_rubrica || "");
      setCriterios(d.criterios || []);
      setDatos(d);
      // Guardar Base64 para enviarlo al confirmar
      setArchivoBase64(resultado.archivo_base64 || "");
      setTipoMime(resultado.tipo_mime || "application/pdf");
      setArchivoNombre(resultado.archivo_nombre || archivo.name);
      setPaso(2);
    } catch (err) {
      console.error("Error al analizar:", err);
      setError(err.response?.data?.detail || "Error al analizar el documento. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleCriterioChange = (index, field, value) => {
    const nuevos = [...criterios];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setCriterios(nuevos);
  };

  const handleEliminarCriterio = (index) => {
    setCriterios(criterios.filter((_, i) => i !== index));
  };

  const handleAgregarCriterio = () => {
    setCriterios([...criterios, { nombre: "", descripcion: "", puntaje_maximo: 5.0, orden: criterios.length + 1 }]);
  };

  const handleConfirmar = async () => {
    if (!titulo.trim() || !descripcion.trim() || criterios.length === 0) {
      const detalle = err.response?.data?.detail;
      setError(typeof detalle === "string" ? detalle : "Error al guardar el caso. Intenta de nuevo.");
      return;
    }
    setCargando(true); setError("");
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      const payload = {
        titulo,
        descripcion,
        nombre_rubrica: nombreRubrica,
        descripcion_rubrica: descripcionRubrica,
        escala_maxima: criterios.length * 5.0,
        criterios: criterios.map((c, i) => ({
          nombre: c.nombre,
          descripcion: c.descripcion,
          puntaje_maximo: c.puntaje_maximo || 5.0,
          orden: i + 1,
        })),
        competencias_ids: [],
        programas_ids: [],
        // Incluir Base64 para guardar en ARCHIVO_CASO
        archivo_base64: archivoBase64,
        archivo_nombre: archivoNombre,
      };
      await confirmarCaso(token.access_token, payload);
      setPaso(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.response?.data?.detail || "Error al guardar el caso. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "darkgreen", color: "white" }}>
        {paso === 1 && "Cargar Caso desde Documento"}
        {paso === 2 && "Revisar Datos del Caso"}
        {paso === 3 && "¡Caso Creado!"}
        <IconButton onClick={handleClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* PASO 1 */}
        {paso === 1 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CloudUploadIcon sx={{ fontSize: 60, color: "darkgreen", mb: 2 }} />
            <Typography variant="h6" gutterBottom>Sube un archivo PDF (.pdf)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              La IA analizará el documento, extraerá el título, descripción con tablas y criterios. El documento original quedará disponible para que el estudiante lo consulte.
            </Typography>
            <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: "none" }} id="upload-case-file" />
            <label htmlFor="upload-case-file">
              <Button variant="outlined" component="span" sx={{ borderColor: "darkgreen", color: "darkgreen", "&:hover": { borderColor: "green", backgroundColor: "#f0f7f0" } }}>
                Seleccionar Archivo
              </Button>
            </label>
            {archivo && (
              <Box sx={{ mt: 2 }}>
                <Chip label={archivo.name} onDelete={() => setArchivo(null)} color="success" variant="outlined" />
              </Box>
            )}
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </Box>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <Box sx={{ py: 2 }}>
            {datos?.rubrica_detectada
              ? <Chip label="Rúbrica detectada en el documento" color="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }} />
              : <Chip label="Rúbrica sugerida por IA (no estaba en el documento)" color="warning" sx={{ mb: 2 }} />
            }
            <TextField label="Título del Caso" value={titulo} onChange={(e) => setTitulo(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Descripción del Caso" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} fullWidth multiline rows={6} sx={{ mb: 2 }} />
            <TextField label="Nombre de la Rúbrica" value={nombreRubrica} onChange={(e) => setNombreRubrica(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Descripción de la Rúbrica" value={descripcionRubrica} onChange={(e) => setDescripcionRubrica(e.target.value)} fullWidth multiline rows={2} sx={{ mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Criterios de Evaluación</Typography>
            {criterios.map((criterio, index) => (
              <Box key={index} sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0", borderRadius: 2, backgroundColor: "#fafafa" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Criterio {index + 1}</Typography>
                  <Button size="small" color="error" onClick={() => handleEliminarCriterio(index)}>Eliminar</Button>
                </Box>
                <TextField label="Nombre" value={criterio.nombre} onChange={(e) => handleCriterioChange(index, "nombre", e.target.value)} fullWidth size="small" sx={{ mb: 1 }} />
                <TextField label="Descripción" value={criterio.descripcion} onChange={(e) => handleCriterioChange(index, "descripcion", e.target.value)} fullWidth size="small" multiline rows={2} sx={{ mb: 1 }} />
                <TextField label="Puntaje Máximo" type="number" value={criterio.puntaje_maximo}
                  onChange={(e) => handleCriterioChange(index, "puntaje_maximo", parseFloat(e.target.value) || 0)}
                  size="small" inputProps={{ min: 0, max: 5, step: 0.5 }} sx={{ width: 150 }} />
              </Box>
            ))}
            <Button variant="outlined" onClick={handleAgregarCriterio} sx={{ borderColor: "darkgreen", color: "darkgreen" }}>+ Agregar Criterio</Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </Box>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
            <Typography variant="h5" gutterBottom>Caso creado exitosamente</Typography>
            <Typography variant="body1" color="text.secondary">
              El caso "{titulo}" se ha guardado con su rúbrica, {criterios.length} criterios de evaluación y el documento original adjunto.
            </Typography>
          </Box>
        )}

        {cargando && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress sx={{ color: "darkgreen" }} />
            <Typography sx={{ mt: 2 }}>{paso === 1 ? "Analizando documento con IA..." : "Guardando caso..."}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {paso === 1 && !cargando && (
          <Button variant="contained" onClick={handleAnalizar} disabled={!archivo}
            sx={{ backgroundColor: "darkgreen", "&:hover": { backgroundColor: "green" } }}>
            Analizar con IA
          </Button>
        )}
        {paso === 2 && !cargando && (
          <>
            <Button onClick={() => setPaso(1)} sx={{ color: "gray" }}>Volver</Button>
            <Button variant="contained" onClick={handleConfirmar}
              sx={{ backgroundColor: "darkgreen", "&:hover": { backgroundColor: "green" } }}>
              Confirmar y Guardar
            </Button>
          </>
        )}
        {paso === 3 && (
          <Button variant="contained" onClick={handleClose}
            sx={{ backgroundColor: "darkgreen", "&:hover": { backgroundColor: "green" } }}>
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
