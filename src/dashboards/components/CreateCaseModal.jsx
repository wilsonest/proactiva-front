import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const styleCriterios = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxHeight: "95vh", // 👈 límite vertical
  bgcolor: "background.paper",
  // border: "2px solid #1976d2",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  overflowY: "auto", // 👈 scroll automático
};

export default function CreateCaseModal({ open, onClose, onCreate }) {
  const [titulo, setTitle] = useState("");
  const [descripcion, setDescription] = useState("");
  const [tituloRubrica, setTituloRubrica] = useState("");
  const [rubrica, setRubrica] = useState("");
  const [tipoRubrica, setTipoRubrica] = useState("");
  const [escalaMax, setEscalaMax] = useState(0);
  const [publica, setPublica] = useState(false);
  const [vigente, setVigente] = useState(false);
  const [autoEvaluacion, setAutoEvaluacion] = useState(false);
  const [openCriterios, setOpenCriterios] = useState(false);
  const [criterios, setCriterios] = useState([]);
  const [nuevoCriterio, setNuevoCriterio] = useState({ nombre: "", descripcion: "", puntaje_maximo: 0, orden: ""});
  const [editIndex, setEditIndex] = useState(null);

  const puntajeUsado = criterios.reduce((acc, c) => acc + c.puntaje_maximo, 0);
  const puntajeDisponible = escalaMax - puntajeUsado;

  const ordenesUsados = criterios.map(c => c.orden);

const handleAgregarCriterio = () => {

  if (nuevoCriterio.puntaje > puntajeDisponible && editIndex === null) return;

  if ( ordenesUsados.includes(nuevoCriterio.orden) && criterios[editIndex]?.orden !== nuevoCriterio.orden)
    return;

  if (editIndex !== null) {
    const nuevos = [...criterios];
    nuevos[editIndex] = nuevoCriterio;
    setCriterios(nuevos);
    setEditIndex(null);
  } else {
    setCriterios([...criterios, nuevoCriterio]);
  }

  setNuevoCriterio({
    nombre: "",
    descripcion: "",
    puntaje_maximo: 0,
    orden: "",
  });
};

  const handleCreate = () => {
    onCreate({ titulo, descripcion, tituloRubrica, rubrica, tipoRubrica, escalaMax, publica, vigente, autoEvaluacion, criterios});

    setTitle("");
    setDescription("");
    setTituloRubrica("");
    setRubrica("");
    setTipoRubrica("")
    setEscalaMax(0);
    setPublica(false);
    setVigente(false);
    setAutoEvaluacion(false);
    setCriterios([]);
    onClose();
  };

  const formCompleto = titulo.trim() !== "" && descripcion.trim() !== "" && tituloRubrica.trim() !== "" && rubrica.trim() !== "" 
  && tipoRubrica.trim() !== "" && escalaMax > 0;

  const puedeCrear = formCompleto && criterios.length > 0;

  const eliminarCriterio = (index) => { const nuevos = criterios.filter((_, i) => i !== index);
    setCriterios(nuevos);
  
  };

  const editarCriterio = (index) => { setNuevoCriterio(criterios[index]);
    setEditIndex(index);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>

          <h2>Crear Caso</h2>

          <TextField
            label="Título Caso"
            value={titulo}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            label="Descripción Caso"
            value={descripcion}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />

          <TextField
            label="Título Rubrica"
            value={tituloRubrica}
            onChange={(e) => setTituloRubrica(e.target.value)}
            fullWidth
          />

          <TextField
            label="Descripción Rubrica"
            value={rubrica}
            onChange={(e) => setRubrica(e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />

          <TextField
            label="Tipo Rubrica"
            value={tipoRubrica}
            onChange={(e) => setTipoRubrica(e.target.value)}
            fullWidth
          />

          <TextField
            label="Escala maxima"
            type="number"
            value={escalaMax}
            onChange={(e) => setEscalaMax(Number(e.target.value))}
            inputProps={{ min: 0, max: 100 }}
            sx={{ width: 200 }}
          />

          <Box>
            <FormControlLabel
              control={<Checkbox checked={publica} onChange={(e) => setPublica(e.target.checked)} />}
              label="Pública"
            />

            <FormControlLabel
              control={<Checkbox checked={vigente} onChange={(e) => setVigente(e.target.checked)} />}
              label="Vigente"
            />

            <FormControlLabel
              control={<Checkbox checked={autoEvaluacion} onChange={(e) => setAutoEvaluacion(e.target.checked)} />}
              label="Auto evaluación"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>

            <Button
              variant="contained"
              disabled={!formCompleto}
              onClick={() => setOpenCriterios(true)}
            >
              Criterios
            </Button>

            <Button
              variant="contained"
              disabled={!puedeCrear}
              onClick={handleCreate}
            >
              Crear Caso
            </Button>

            <Button variant="outlined" onClick={onClose}>
              Cerrar
            </Button>

          </Box>
        </Box>
      </Modal>


      <Modal open={openCriterios} onClose={() => setOpenCriterios(false)}>
        <Box sx={styleCriterios}>

          <h2>Agregar Criterios</h2>

          <TextField
            label="Nombre"
            value={nuevoCriterio.nombre}
            onChange={(e) =>
              setNuevoCriterio({ ...nuevoCriterio, nombre: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Descripción"
            value={nuevoCriterio.descripcion}
            onChange={(e) =>
              setNuevoCriterio({ ...nuevoCriterio, descripcion: e.target.value })}
            fullWidth
            multiline
          />

          <TextField
            label={`Puntaje (max ${puntajeDisponible})`}
            type="number"
            value={nuevoCriterio.puntaje_maximo}
            onChange={(e) =>
              setNuevoCriterio({ ...nuevoCriterio, puntaje_maximo: Number(e.target.value)})}
            inputProps={{ min: 0, max: puntajeDisponible }}
          />

          <TextField
            label="Orden"
            select
            value={nuevoCriterio.orden}
            onChange={(e) =>
              setNuevoCriterio({ ...nuevoCriterio, orden: Number(e.target.value)})}
          >
            {[1,2,3,4,5,6,7,8,9,10]
              .filter(n => !ordenesUsados.includes(n))
              .map(n => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
          </TextField>

          <Button variant="contained" onClick={handleAgregarCriterio}>
            Agregar
          </Button>


          <Box sx={{ mt:2 }}>

  {criterios.map((c,i)=>(
    <Box
      key={i}
      sx={{
        border:"1px solid #ccc",
        p:1,
        mb:1,
        borderRadius:1,
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}
    >

      <Box>
        <b>{c.nombre}</b> | <b>{c.descripcion}</b> | Puntaje: {c.puntaje_maximo} | Orden: {c.orden}
      </Box>

      <Box>

        <IconButton
          color="primary"
          onClick={() => editarCriterio(i)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          color="error"
          onClick={() => eliminarCriterio(i)}
        >
          <DeleteIcon />
        </IconButton>

      </Box>

    </Box>
  ))}

</Box>


          <Button
            variant="outlined"
            onClick={() => setOpenCriterios(false)}
          >
            Guardar
          </Button>

        </Box>
      </Modal>
    </>
  );
}