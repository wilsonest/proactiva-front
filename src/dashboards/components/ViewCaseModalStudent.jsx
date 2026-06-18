import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserContext } from "../../auth/context/UserContext";
import { getCasesById } from "../../api/provider";

const style = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900, maxHeight: "92vh", overflowY: "auto",
  bgcolor: "background.paper", border: "2px solid #1976d2",
  boxShadow: 24, p: 0, borderRadius: 2,
  display: "flex", flexDirection: "column",
};

export default function ViewCaseModalStudent({
  open, onClose, onView, ryc, onResponse, iaResult,
  entregaRespuesta, MyObservacion,
}) {
  const { userState: { user } } = useContext(UserContext);

  const [tab, setTab] = useState(0);
  const [caso_id, setId] = useState("");
  const [titulo, setTitle] = useState("");
  const [descripcion, setDescription] = useState("");
  const [estudiante_id, setIdEstudiante] = useState();
  const [respuesta, setRespuesta] = useState("");
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [urlLinkAdjunto, setUrlLinkAdjunto] = useState("");
  const [documentoUrl, setDocumentoUrl] = useState(null); // URL Base64 del PDF

  const yaRespondio = (entregaRespuesta || "").length > 15;
  const idUser = user?.id;

  useEffect(() => {
    if (onView) {
      setId(onView.id || "");
      setDescription(onView.descripcion || "");
      setTitle(onView.titulo || "");
      setIdEstudiante(idUser || 0);
      setRespuesta(entregaRespuesta || "");
      setTypedText("");
      setTab(0);
      setSubmitted(false);
      setUrlLinkAdjunto("");
      setDocumentoUrl(null);

      // Cargar el documento PDF si existe
      if (onView.archivos && onView.archivos.length > 0) {
        const archivoPdf = onView.archivos.find(a => a.tipo_archivo === "pdf_base64");
        if (archivoPdf) {
          const base64 = archivoPdf.url_archivo;
          const dataUrl = base64.startsWith("data:")
            ? base64
            : `data:application/pdf;base64,${base64}`;
          setDocumentoUrl(dataUrl);
        }
      }
    }
  }, [onView, idUser, entregaRespuesta]);

  useEffect(() => {
    if (yaRespondio && MyObservacion) {
      if (iaResult?.estado === "final") {
        setTypedText(MyObservacion);
      } else if (iaResult?.estado === "revisada" || iaResult?.estado === "borrador") {
        setTypedText("Tu entrega está siendo revisada por el docente. La retroalimentación estará disponible una vez confirmada la calificación.");
      }
      return;
    }
    if (!iaResult) return;

    if (iaResult.estado !== "final") {
      setTypedText("Tu entrega está siendo revisada por el docente. La retroalimentación estará disponible una vez confirmada la calificación.");
      return;
    }

    const textoCompleto = `Nota final: ${iaResult.nota_total}\n\n${iaResult.detalles
      .map((d, i) => `Criterio ${i + 1}:\n${d.comentario_text}\n(Puntaje: ${d.puntaje_numerico})`)
      .join("\n\n")}`;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= textoCompleto.length) {
        setTypedText(textoCompleto.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [iaResult, MyObservacion, entregaRespuesta]);

  const handleEnviar = async () => {
    if (loading || submitted) return;
    setLoading(true);
    try {
      await onResponse({ caso_id, estudiante_id, respuesta, url_archivo: urlLinkAdjunto || undefined });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const criterios = ryc?.criterios || [];
  const sumaTotal = criterios.reduce((acc, c) => acc + (c.puntaje_maximo || 0), 0);

  // Determinar tabs disponibles
  const tabs = [
    { label: "📄 Descripción" },
    { label: "📋 Rúbrica" },
    { label: "✏️ Solución" },
  ];
  if (documentoUrl) {
    tabs.push({ label: "📁 Documento Original" });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Cabecera */}
        <Box sx={{ px: 4, pt: 3, pb: 1, borderBottom: "1px solid #e0e0e0" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#0f2d1a" }}>{titulo}</h2>
        </Box>

        {/* Pestañas */}
        <Box sx={{ borderBottom: "1px solid #e0e0e0", px: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
            {tabs.map((t, i) => <Tab key={i} label={t.label} />)}
          </Tabs>
        </Box>

        <Box sx={{ px: 4, py: 3, flexGrow: 1, overflowY: "auto" }}>

          {/* DESCRIPCIÓN */}
          {tab === 0 && (
            <Box>
              <style>{`
                .caso-md table { border-collapse: collapse; width: 100%; margin-bottom: 16px; font-size: 0.85rem; }
                .caso-md th { background-color: #1a5c2a; color: #ffffff; padding: 8px 12px; text-align: left; font-weight: 600; border: 1px solid #1a5c2a; }
                .caso-md td { padding: 7px 12px; border: 1px solid #d0e4d6; }
                .caso-md tr:nth-child(even) td { background-color: #f0f7f2; }
                .caso-md tr:hover td { background-color: #e0f0e6; }
                .caso-md h2 { color: #1a5c2a; font-size: 1.1rem; margin: 20px 0 8px; }
                .caso-md h3 { color: #2e7d43; font-size: 1rem; margin: 16px 0 6px; }
                .caso-md p { margin: 6px 0; line-height: 1.7; font-size: 0.9rem; }
                .caso-md ul { padding-left: 20px; margin: 6px 0; }
                .caso-md li { margin: 3px 0; font-size: 0.9rem; }
                .caso-md strong { color: #0f2d1a; }
                .caso-md hr { border: none; border-top: 1px solid #d0e4d6; margin: 16px 0; }
              `}</style>
              <div className="caso-md">
                {descripcion
                  ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{descripcion}</ReactMarkdown>
                  : <p style={{ color: "#888" }}>Sin descripción disponible.</p>
                }
              </div>
            </Box>
          )}

          {/* RÚBRICA */}
          {tab === 1 && (
            <Box>
              {ryc ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <h3 style={{ margin: "0 0 4px", color: "#1a5c2a" }}>{ryc.nombre}</h3>
                    {ryc.descripcion && <p style={{ margin: 0, fontSize: "0.88rem", color: "#555" }}>{ryc.descripcion}</p>}
                  </Box>
                  {criterios.length > 0 ? (
                    <>
                      {criterios.map((c, i) => (
                        <Box key={i} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2, mb: 1.5, background: "#fafafa" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                            <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f2d1a" }}>{i + 1}. {c.nombre}</span>
                            <span style={{ background: "#1a5c2a", color: "#fff", borderRadius: 4, padding: "2px 10px", fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>
                              {c.puntaje_maximo}%
                            </span>
                          </Box>
                          {c.descripcion && <p style={{ margin: 0, fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>{c.descripcion}</p>}
                        </Box>
                      ))}
                      <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, background: "#e8f5ec", border: "1px solid #a5d6b0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a5c2a" }}>Total de la rúbrica</span>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a5c2a" }}>{sumaTotal}%</span>
                      </Box>
                    </>
                  ) : <p style={{ color: "#888" }}>Esta rúbrica no tiene criterios definidos aún.</p>}
                </>
              ) : <p style={{ color: "#888" }}>No hay rúbrica asociada a este caso.</p>}
            </Box>
          )}

          {/* SOLUCIÓN */}
          {tab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Escribe tu solución"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                required fullWidth multiline minRows={6}
                disabled={yaRespondio || submitted}
                helperText={
                  yaRespondio || submitted
                    ? "Ya enviaste tu solución a este caso."
                    : `${respuesta.trim().length} caracteres (mínimo 100)`
                }
              />

              {/* Campo de link adjunto */}
              {!yaRespondio && !submitted && (
                <TextField
                  label="🔗 Enlace de soporte (opcional)"
                  placeholder="Pega aquí el link de tu Google Sheets, OneDrive o Drive con información adicional"
                  value={urlLinkAdjunto}
                  onChange={(e) => setUrlLinkAdjunto(e.target.value)}
                  fullWidth
                  size="small"
                  helperText="Si tu solución requiere tablas o archivos, comparte el link aquí"
                />
              )}

              {/* Mostrar link adjunto si ya respondió */}
              {(yaRespondio || submitted) && onView?.url_archivo && (
                <Box sx={{ p: 1.5, background: "#f5f5f5", borderRadius: 2, border: "1px solid #e0e0e0" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Enlace adjunto:</Typography>
                  <a href={onView.url_archivo} target="_blank" rel="noopener noreferrer" style={{ color: "#1a5c2a", wordBreak: "break-all" }}>
                    {onView.url_archivo}
                  </a>
                </Box>
              )}

              {loading ? (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CircularProgress size={28} sx={{ color: "#1a5c2a" }} />
                  <p style={{ color: "#555", marginTop: 8 }}>Generando evaluación con IA...</p>
                </Box>
              ) : (
                (iaResult || yaRespondio) && (
                  <TextField
                    label={yaRespondio ? "Observación del docente / IA 🤖" : "Evaluación IA 🤖"}
                    value={typedText}
                    fullWidth multiline minRows={6} maxRows={14}
                    InputProps={{ readOnly: true }}
                    sx={{ background: "#f5f5f5", borderRadius: 2 }}
                  />
                )
              )}

              <Button
                variant="contained"
                onClick={handleEnviar}
                disabled={respuesta.trim().length < 100 || yaRespondio || loading || submitted}
                sx={{ background: "#1a5c2a", "&:hover": { background: "#2e7d43" }, alignSelf: "flex-start", px: 4 }}
              >
                {loading ? "Generando..." : submitted || yaRespondio ? "✓ Solución enviada" : "Enviar solución"}
              </Button>
            </Box>
          )}

          {/* DOCUMENTO ORIGINAL */}
          {tab === 3 && documentoUrl && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Documento original del caso. Puedes descargarlo o verlo directamente aquí.
              </Typography>
              <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", height: "70vh" }}>
                <iframe
                  src={documentoUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Documento del caso"
                />
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = documentoUrl;
                  link.download = "documento_caso.pdf";
                  link.click();
                }}
                sx={{ alignSelf: "flex-start", borderColor: "darkgreen", color: "darkgreen" }}
              >
                ⬇️ Descargar documento
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ px: 4, py: 2, borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>Cerrar</Button>
        </Box>
      </Box>
    </Modal>
  );
}
