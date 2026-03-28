import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { UserContext } from "../../auth/context/UserContext";

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

export default function ViewCaseModalStudent({ open, onClose, onView, onResponse }) {
  const [caso_id, setId] = useState("")
  const [titulo, setTitle] = useState("");
  const [descripcion, setDescription] = useState("");
  const [estudiante_id, setIdEstudiante] = useState()
  const [respuesta, setRespuesta] = useState("");
  const { userState: { user },} = useContext(UserContext);

  const idUser = user?.id;

useEffect(() => {
  if (onView) {
    setId(onView.id || "");
    setDescription(onView.descripcion || "");
    setTitle(onView.titulo || "");
    setIdEstudiante(idUser || 0);
    setRespuesta(""); // limpiar respuesta
  }
}, [onView, idUser]);


const handleCreate = () => {
  onResponse({ caso_id, estudiante_id, respuesta });
  setRespuesta("");
  onClose();
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
          
          <Button variant="contained" color="primary" onClick={handleCreate} disabled={respuesta.trim().length < 100}>
              Resolver Caso 
          </Button>

          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cerrar
          </Button>
        
      </Box>
    </Modal>
  );
}
