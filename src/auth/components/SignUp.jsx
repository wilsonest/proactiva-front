import { useState } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  
  // 🔥 Responsive aquí
  width: {
    xs: "90%",   // móvil
    sm: "80%",   // tablet
    md: 500,     // laptop
    lg: 600      // pantallas grandes
  },

  maxHeight: "90vh", // evita que se salga en móviles
  overflowY: "auto", // scroll si se necesita

  bgcolor: "background.paper",
  border: "2px solid darkgreen",
  boxShadow: 24,
  p: {
    xs: 2,
    sm: 3,
    md: 4
  },
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function SignUp({ open, onClose, onCreate }) {
  const [nombre_usuario, setNombre] = useState("");
  const [correo_electronico, setEmail] = useState("");
  const [contrasena, setClave] = useState("");
  const [rol, setRol] = useState("");

  const estudiante = correo_electronico.endsWith("@correo.tdea.edu.co");
  const roles = estudiante
    ? ["estudiante"]
    : ["estudiante", "profesor", "coordinador"];

  const handleCreate = () => {
    onCreate({ nombre_usuario, correo_electronico, contrasena, rol });

    setNombre("");
    setEmail("");
    setClave("");
    setRol("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <TextField
          label="Nombre"
          value={nombre_usuario}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
        />

        <TextField
          label="Correo Institucional"
          value={correo_electronico}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setClave(e.target.value)}
          fullWidth
        />

        <TextField
          label="Rol"
          select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          fullWidth
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        {/* 🔥 Botones responsive */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row"
            },
            gap: 1
          }}
        >
          <Button variant="contained" onClick={handleCreate} fullWidth style={{ backgroundColor: "darkgreen", color: "white" }}>
            Crear Usuario
          </Button>

          <Button variant="outlined" onClick={onClose} fullWidth style={{ color: "darkgreen", borderColor: "darkgreen" }}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}