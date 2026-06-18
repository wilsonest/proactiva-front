import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CircularProgress from "@mui/material/CircularProgress";
import { UserContext } from "../../auth/context/UserContext";
import { BASE_URL } from "../../api/configApi";

const style = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800, maxHeight: "95vh", overflowY: "auto",
  bgcolor: "background.paper", border: "2px solid #1976d2",
  boxShadow: 24, p: 4, borderRadius: 2,
  display: "flex", flexDirection: "column", gap: 2,
};

function LabelConTooltip({ texto, ayuda }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
      <span style={{ fontSize: "0.85rem", color: "#555", fontWeight: 500 }}>{texto}</span>
      <Tooltip title={ayuda} placement="right" arrow>
        <HelpOutlineIcon sx={{ fontSize: 16, color: "#aaa", cursor: "help" }} />
      </Tooltip>
    </Box>
  );
}

async function convertirAMarkdown(texto, token) {
  const response = await fetch(BASE_URL + "carga-caso/convertir-markdown", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ texto }),
  });
  if (!response.ok) throw new Error("Error al convertir");
  const data = await response.json();
  return data.markdown;
}

export default function ViewCaseModal({ open, onClose, onView, ryc, onUpdate }) {
  const [id, setId] = useState("");
  const [titulo, setTitle] = useState("");
  const [descripcion, setDescription] = useState("");
  const [tituloRubrica, setTituloRubrica] = useState("");
  const [rubrica, setRubrica] = useState("");
  const [publica] = useState(true);
  const [openCriterios, setOpenCriterios] = useState(false);
  const [criterios, setCriterios] = useState([]);
  const [nuevoCriterio, setNuevoCriterio] = useState({ nombre: "", descripcion: "", puntaje_maximo: 0 });
  const [editIndex, setEditIndex] = useState(null);
  const [convirtiendo, setConvirtiendo] = useState(false);

  const pesoUsado = criterios.reduce((acc, c, i) => i === editIndex ? acc : acc + c.puntaje_maximo, 0);
  const pesoDisponible = 100 - pesoUsado;
  const maxPermitido = editIndex !== null ? pesoDisponible + (criterios[editIndex]?.puntaje_maximo || 0) : pesoDisponible;
  const sumaTotal = criterios.reduce((acc, c) => acc + c.puntaje_maximo, 0);
  const advertencia =
    sumaTotal > 100 ? `⚠️ Te excediste un ${sumaTotal - 100}% — ajusta los pesos.`
    : sumaTotal < 100 && criterios.length > 0 ? `⚠️ Te falta un ${100 - sumaTotal}% por asignar.`
    : null;

  const handleConvertirMarkdown = async () => {
    if (!descripcion.trim()) return;
    setConvirtiendo(true);
    try {
      const token = JSON.parse(localStorage.getItem("Token"))?.access_token;
      const resultado = await convertirAMarkdown(descripcion, token);
      setDescription(resultado);
    } catch (e) {
      console.error("Error al convertir a Markdown:", e);
    } finally {
      setConvirtiendo(false);
    }
  };

  const handleAgregarCriterio = () => {
    const peso = Number(nuevoCriterio.puntaje_maximo);
    if (peso <= 0 || peso > maxPermitido) return;
    if (!nuevoCriterio.nombre.trim()) return;
    if (editIndex !== null) {
      const nuevos = [...criterios];
      nuevos[editIndex] = { ...nuevoCriterio, puntaje_maximo: peso };
      setCriterios(nuevos);
      setEditIndex(null);
    } else {
      setCriterios([...criterios, { ...nuevoCriterio, puntaje_maximo: peso, orden: criterios.length + 1 }]);
    }
    setNuevoCriterio({ nombre: "", descripcion: "", puntaje_maximo: 0 });
  };

  useEffect(() => {
    if (onView && ryc) {
      setId(onView.id || "");
      setDescription(onView.descripcion || "");
      setTitle(onView.titulo || "");
      setTituloRubrica(ryc.nombre || "");
      setRubrica(ryc.descripcion || "");
      setCriterios(ryc.criterios || []);
    }
  }, [onView, ryc]);

  const handleCreate = () => {
    onUpdate({ id, titulo, descripcion, rubrica: {
      id: ryc.id, nombre: tituloRubrica, descripcion: rubrica,
      tipo_rubrica: "analitica", escala_maxima: 100, publica,
      vigente: true, permitir_autoevaluacion: false, criterios,
    }});
    onClose();
  };

  const formCompleto = titulo.trim() !== "" && descripcion.trim() !== "" &&
    tituloRubrica.trim() !== "" && rubrica.trim() !== "";
  const eliminarCriterio = (i) => { setCriterios(criterios.filter((_, idx) => idx !== i)); setNuevoCriterio({ nombre: "", descripcion: "", puntaje_maximo: 0 }); setEditIndex(null); };
  const editarCriterio = (i) => { setNuevoCriterio(criterios[i]); setEditIndex(i); };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <LabelConTooltip texto="Título del caso" ayuda="Nombre breve y descriptivo del caso empresarial." />
          <TextField value={titulo} onChange={(e) => setTitle(e.target.value)} fullWidth />

          <LabelConTooltip texto="Descripción del caso" ayuda="Narración completa del caso. Puedes pegar texto desde Word y convertirlo a Markdown con el botón ✨." />
          <TextField value={descripcion} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={5} slotProps={{ htmlInput: { maxLength: 200000 } }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined" size="small"
              startIcon={convirtiendo ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
              onClick={handleConvertirMarkdown}
              disabled={!descripcion.trim() || convirtiendo}
              sx={{ borderColor: "darkgreen", color: "darkgreen", fontSize: "0.78rem" }}
            >
              {convirtiendo ? "Convirtiendo..." : "✨ Convertir a Markdown con IA"}
            </Button>
            <span style={{ fontSize: "0.75rem", color: "#888" }}>Convierte tablas y formatos de Word a Markdown</span>
          </Box>

          <LabelConTooltip texto="Título de la rúbrica" ayuda="Nombre que identifica la rúbrica de evaluación." />
          <TextField value={tituloRubrica} onChange={(e) => setTituloRubrica(e.target.value)} fullWidth />

          <LabelConTooltip texto="Descripción de la rúbrica" ayuda="Propósito de la rúbrica y competencias que evalúa." />
          <TextField value={rubrica} onChange={(e) => setRubrica(e.target.value)} fullWidth multiline minRows={4} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" disabled={!formCompleto} onClick={() => setOpenCriterios(true)}>Criterios</Button>
            <Tooltip title={criterios.length > 0 && sumaTotal !== 100 ? `La suma debe ser 100%. Actualmente: ${sumaTotal}%` : ""}>
              <span>
                <Button variant="contained" color="primary" onClick={handleCreate} disabled={!formCompleto}>Editar Caso</Button>
              </span>
            </Tooltip>
            <Button variant="outlined" color="secondary" onClick={onClose}>Cerrar</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openCriterios} onClose={() => setOpenCriterios(false)}>
        <Box sx={style}>
          <h2>Criterios de evaluación</h2>

          <LabelConTooltip texto="Nombre del criterio" ayuda="Ej: Análisis financiero, Propuesta estratégica." />
          <TextField value={nuevoCriterio.nombre} onChange={(e) => setNuevoCriterio({ ...nuevoCriterio, nombre: e.target.value })} fullWidth />

          <LabelConTooltip texto="Descripción del criterio" ayuda="Qué debe demostrar el estudiante para cumplir este criterio." />
          <TextField value={nuevoCriterio.descripcion} onChange={(e) => setNuevoCriterio({ ...nuevoCriterio, descripcion: e.target.value })} fullWidth multiline />

          <LabelConTooltip texto="Peso del criterio (%)" ayuda={`Disponible: ${maxPermitido}%`} />
          <TextField
            placeholder={`Máximo disponible: ${maxPermitido}%`}
            type="number" value={nuevoCriterio.puntaje_maximo}
            onChange={(e) => setNuevoCriterio({ ...nuevoCriterio, puntaje_maximo: Number(e.target.value) })}
            inputProps={{ min: 1, max: 100, step: 1 }} sx={{ width: 220 }}
          />

          <Button variant="contained" onClick={handleAgregarCriterio}>
            {editIndex !== null ? "Actualizar criterio" : "Agregar criterio"}
          </Button>

          <Box sx={{ mt: 1 }}>
            {criterios.map((c, i) => (
              <Box key={i} sx={{ border: "1px solid #e0e0e0", p: 1.5, mb: 1, borderRadius: 1, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
                <Box>
                  <b>{c.nombre}</b>
                  {c.descripcion && <span style={{ color: "#666", fontSize: "0.85rem" }}> — {c.descripcion.slice(0, 60)}{c.descripcion.length > 60 ? "..." : ""}</span>}
                  <Box sx={{ mt: 0.5 }}>
                    <span style={{ background: "#1976d2", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.8rem", fontWeight: 600 }}>{c.puntaje_maximo}%</span>
                  </Box>
                </Box>
                <Box>
                  <IconButton color="primary" size="small" onClick={() => editarCriterio(i)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton color="error" size="small" onClick={() => eliminarCriterio(i)}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          {criterios.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <span style={{ fontSize: "0.85rem", color: "#555" }}>Total asignado</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: sumaTotal === 100 ? "#2e7d32" : sumaTotal > 100 ? "#c62828" : "#e65100" }}>{sumaTotal}% / 100%</span>
              </Box>
              <Box sx={{ height: 8, borderRadius: 4, background: "#e0e0e0", overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: `${Math.min(sumaTotal, 100)}%`, background: sumaTotal === 100 ? "#2e7d32" : sumaTotal > 100 ? "#c62828" : "#ff9800", transition: "width 0.3s" }} />
              </Box>
              {advertencia && (
                <Box sx={{ mt: 1, p: 1, borderRadius: 1, background: sumaTotal > 100 ? "#fef2f2" : "#fff8e1", border: `1px solid ${sumaTotal > 100 ? "#fca5a5" : "#ffe082"}`, fontSize: "0.85rem", color: sumaTotal > 100 ? "#b91c1c" : "#b45309" }}>
                  {advertencia}
                </Box>
              )}
            </Box>
          )}
          <Button variant="outlined" onClick={() => setOpenCriterios(false)}>Guardar y cerrar</Button>
        </Box>
      </Modal>
    </>
  );
}
