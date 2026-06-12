import { useState } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 500, lg: 600 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #1976d2",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
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
  const [error, setError] = useState("");

  // Determinar roles disponibles según el dominio del correo
  const esEstudiante = correo_electronico.endsWith("@correo.tdea.edu.co");
  const esProfesorOCoord = correo_electronico.endsWith("@tdea.edu.co");
  const dominioValido = esEstudiante || esProfesorOCoord;

  const rolesDisponibles = esEstudiante
    ? ["estudiante"]
    : esProfesorOCoord
    ? ["profesor", "coordinador"]
    : [];

  // Mensaje de ayuda según el dominio
  const getMensajeDominio = () => {
    if (!correo_electronico) return "";
    if (esEstudiante) return "✅ Correo de estudiante válido — rol: estudiante";
    if (esProfesorOCoord) return "✅ Correo institucional válido — roles: profesor o coordinador";
    if (correo_electronico.includes("@")) {
      return "❌ Dominio no permitido. Use @correo.tdea.edu.co (estudiantes) o @tdea.edu.co (profesores/coordinadores)";
    }
    return "";
  };

  const colorMensaje = (esEstudiante || esProfesorOCoord) ? "success" : "error";

  const handleCreate = () => {
    setError("");

    // Validaciones antes de enviar
    if (!nombre_usuario.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!correo_electronico.trim()) {
      setError("El correo es obligatorio.");
      return;
    }
    if (!dominioValido) {
      setError("El correo debe ser @correo.tdea.edu.co (estudiantes) o @tdea.edu.co (profesores/coordinadores).");
      return;
    }
    if (!contrasena.trim()) {
      setError("La contraseña es obligatoria.");
      return;
    }
    if (!rol) {
      setError("Selecciona un rol.");
      return;
    }

    // Validar coherencia correo-rol
    if (rol === "estudiante" && !esEstudiante) {
      setError("Los estudiantes deben usar un correo @correo.tdea.edu.co.");
      return;
    }
    if ((rol === "profesor" || rol === "coordinador") && !esProfesorOCoord) {
      setError("Los profesores y coordinadores deben usar un correo @tdea.edu.co.");
      return;
    }

    onCreate({ nombre_usuario, correo_electronico, contrasena, rol });

    // Limpiar formulario
    setNombre("");
    setEmail("");
    setClave("");
    setRol("");
    setError("");
    onClose();
  };

  // Resetear rol si el dominio cambia y el rol actual no es válido
  const handleEmailChange = (e) => {
    const nuevoCorreo = e.target.value;
    setEmail(nuevoCorreo);
    setError("");

    const nuevoEsEst = nuevoCorreo.endsWith("@correo.tdea.edu.co");
    const nuevoEsProf = nuevoCorreo.endsWith("@tdea.edu.co");

    if (nuevoEsEst && (rol === "profesor" || rol === "coordinador")) setRol("estudiante");
    if (nuevoEsProf && rol === "estudiante") setRol("");
    if (!nuevoEsEst && !nuevoEsProf) setRol("");
  };

  const mensajeDominio = getMensajeDominio();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>

        <TextField
          label="Nombre"
          value={nombre_usuario}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
        />

        <Box>
          <TextField
            label="Correo Institucional"
            placeholder="usuario@tdea.edu.co o usuario@correo.tdea.edu.co"
            value={correo_electronico}
            onChange={handleEmailChange}
            fullWidth
            error={!!correo_electronico && !dominioValido && correo_electronico.includes("@")}
          />
          {mensajeDominio && (
            <Alert
              severity={colorMensaje}
              sx={{ mt: 0.5, py: 0, fontSize: "0.78rem" }}
            >
              {mensajeDominio}
            </Alert>
          )}
        </Box>

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
          disabled={!dominioValido}
          helperText={
            !correo_electronico
              ? "Ingresa tu correo primero para ver los roles disponibles"
              : !dominioValido
              ? "Dominio de correo no válido"
              : ""
          }
        >
          {rolesDisponibles.map((r) => (
            <MenuItem key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {/* Error de validación */}
        {error && (
          <Alert severity="error" sx={{ fontSize: "0.85rem" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleCreate}
            fullWidth
            disabled={!dominioValido || !rol}
            sx={{ background: "darkgreen", "&:hover": { background: "#1b5e20" } }}
          >
            Crear Usuario
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cerrar
          </Button>
        </Box>

      </Box>
    </Modal>
  );
}
