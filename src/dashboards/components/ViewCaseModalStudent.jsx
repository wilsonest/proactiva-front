import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { UserContext } from "../../auth/context/UserContext";
import MenuItem from "@mui/material/MenuItem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
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
  const yaRespondio = (entregaRespuesta || "").length > 15;

  const idUser = user?.id;

  useEffect(() => {
    if (onView) {
      setId(onView.id || "");
      setDescription(onView.descripcion || "");
      setTitle(onView.titulo || "");
      setIdEstudiante(idUser || 0);

      // 👇 aquí está la clave
      setRespuesta(entregaRespuesta || "");

      setTypedText("");
    }
  }, [onView, idUser, entregaRespuesta]);

  useEffect(() => {
    // 🔥 prioridad: si ya respondió → mostrar observación
    if (yaRespondio && MyObservacion) {
      setTypedText(MyObservacion);
      return;
    }

    // 🤖 si no, usa la IA
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

  const handleCreate = () => {
    onResponse({ caso_id, estudiante_id, respuesta });
    // setRespuesta("");
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

        {(iaResult || yaRespondio) && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: "#f5f5f5",
              border: "1px solid #ddd",
              maxHeight: 200,
              overflowY: "auto",
              whiteSpace: "pre-line",
            }}
          >
            <strong>
              {yaRespondio ? "Observación" : "Evaluación IA 🤖"}
            </strong>

            <p style={{ marginTop: 10 }}>{typedText}</p>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={respuesta.trim().length < 100 || yaRespondio}
        >
          {yaRespondio ? "Ya respondiste este caso" : "Resolver Caso"}
        </Button>

        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}
