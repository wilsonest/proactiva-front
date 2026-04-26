import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { UserContext } from "../../auth/context/UserContext";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: "90vh", // 🔥 límite de altura
  overflowY: "auto", // 🔥 scroll vertical
  bgcolor: "background.paper",
  border: "2px solid #1976d2",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function ViewCaseModalStudent({
  open,
  onClose,
  onView,
  onResponse,
  iaResult,
  entregaRespuesta,
  MyObservacion,
}) {
  const {
    userState: { user },
  } = useContext(UserContext);
  const [caso_id, setId] = useState("");
  const [titulo, setTitle] = useState("");
  const [descripcion, setDescription] = useState("");
  const [estudiante_id, setIdEstudiante] = useState();
  const [respuesta, setRespuesta] = useState("");
  const estados = ["pendiente", "en_revision"];
  const [estado, setEstado] = useState("");
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    }
  }, [onView, idUser, entregaRespuesta]);

  useEffect(() => {
    if (yaRespondio && MyObservacion) {
      setTypedText(MyObservacion);
      return;
    }

    if (!iaResult) return;

    const textoCompleto = `Nota final: ${iaResult.nota_total}

${iaResult.detalles
  .map(
    (d, i) =>
      `Criterio ${i + 1}:
${d.comentario_text}
(Puntaje: ${d.puntaje_numerico})`,
  )
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

  const handleCreate = async () => {
    if (loading || submitted) return;

    setLoading(true);

    try {
      await onResponse({ caso_id, estudiante_id, respuesta });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-ver-caso">
      <Box sx={style}>
        <h1 id="modal-crear-caso" style={{ margin: 0 }}>
          {titulo}
        </h1>
        <p>{descripcion}</p>
        <TextField
          label="Genera tu respuesta"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          required
          fullWidth
          multiline
          minRows={4}
          inputProps={{ minLength: 100 }}
        />

        {loading ? (
          <TextField
            label="Evaluación IA 🤖"
            value="Generando evaluación..."
            fullWidth
            multiline
            minRows={6}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2, background: "#f5f5f5", borderRadius: 2 }}
          />
        ) : (
          (iaResult || yaRespondio) && (
            <TextField
              label={yaRespondio ? "Observación" : "Evaluación IA 🤖"}
              value={typedText}
              fullWidth
              multiline
              minRows={6}
              maxRows={12}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2, background: "#f5f5f5", borderRadius: 2 }}
            />
          )
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={
            respuesta.trim().length < 100 || yaRespondio || loading || submitted
          }
        >
          {loading
            ? "Generando..."
            : submitted || yaRespondio
              ? "Ya respondiste este caso"
              : "Resolver Caso"}
        </Button>

        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}
