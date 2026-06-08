import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useNavigate } from "react-router-dom";
import {
  getEvaluaciones,
  getEvaluacionDetalle,
  updateEvaluacion,
} from "../../api/provider";
import ReviewEvaluationModal from "../components/ReviewEvaluationModal";
import { EntregasContext } from "../../Listas/context/EntregasContext";
import { UserContext } from "../../auth/context/UserContext";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 175;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

export default function ListaAllCalificaciones() {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEval, setSelectedEval] = useState(null);
  const [openReview, setOpenReview] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSev, setAlertSev] = useState("success");
  const [tableInfo, setTableInfo] = useState([]);
  const [open, setOpen] = useState(true);
  const [openCasos, setOpenCasos] = useState(false);
  const { logout } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const {
    getAllCalificaciones,
    getUsuariosById,
    getCaseById,
    getEntregasByEstudent,
  } = useContext(EntregasContext);

  const {
    userState: { user },
  } = useContext(UserContext);

  useEffect(() => {
    loadEvaluaciones();
  }, []);

  const loadEvaluaciones = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      if (!token?.access_token) return;
      // const evaluaciones = await getEvaluaciones(token.access_token);
      const calificaciones = await getAllCalificaciones(token.access_token);

      const tableData = await Promise.all(
        calificaciones.map(async (calificacion) => {
          const entrega = await getEntregasByEstudent(
            token.access_token,
            calificacion.entrega_id,
          );

          const estudiante = await getUsuariosById(
            token.access_token,
            entrega.estudiante_id,
          );

          const caso = await getCaseById(token.access_token, entrega.caso_id);

          return {
            id: calificacion.id,
            entregaId: entrega.id,
            estudianteNombre: estudiante.nombre_usuario,
            casoTitulo: caso.titulo,
            nota: calificacion.nota_total,
            estado: calificacion.estado,
            fechaEvaluacion: calificacion.fecha_evaluacion,
            docenteId: calificacion.docente_id,
            evaluacionId: calificacion.id,
          };
        }),
      );
      setTableInfo(tableData);

      // setEvaluaciones(calificaciones || []);
    } catch (e) {
      console.error("Error cargando evaluaciones:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRevisar = async (ev) => {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      const detalle = await getEvaluacionDetalle(token.access_token, ev.id);
      setSelectedEval({
        ...detalle,
        id: ev.id,
        evaluacion_id: ev.id,
        estudiante: ev.estudiante_nombre || ev.entrega_id,
        caso: ev.caso_titulo || "—",
        nota_total: ev.nota_total,
      });
      setOpenReview(true);
    } catch (e) {
      console.error("Error cargando detalle:", e);
      setAlertMsg("Error al cargar el detalle de la evaluación");
      setAlertSev("error");
      setOpenAlert(true);
    }
  };

  const handleConfirmar = async (data) => {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));
      await updateEvaluacion(token.access_token, data.evaluacion_id, {
        detalles: data.detalles,
        observaciones_text: data.observaciones_text,
        nota_total: data.nota_total,
        estado: "revisada",
      });
      setAlertMsg("Evaluación confirmada como revisada ✅");
      setAlertSev("success");
      setOpenAlert(true);
      await loadEvaluaciones();
    } catch (e) {
      console.error("Error confirmando evaluación:", e);
      setAlertMsg("Error al confirmar la evaluación");
      setAlertSev("error");
      setOpenAlert(true);
      throw e;
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };


  const handleLogout = () => {
    logout();
    navigate("/Login", { replace: true });
  };

  const filtradas = tableInfo.filter((ev) => {
    const nombre = (ev.estudianteNombre || "").toLowerCase();
    const caso = (ev.casoTitulo || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return nombre.includes(term) || caso.includes(term);
  });

  const getEstadoChip = (estado) => {
    if (estado === "revisada")
      return <Chip label="Revisada" color="success" size="small" />;
    return <Chip label="IA (borrador)" color="warning" size="small" />;
  };

  const getNotaColor = (nota) => {
    if (nota >= 4) return "#2e7d32";
    if (nota >= 3) return "#f57c00";
    return "#c62828";
  };

  return (
    <>
      <CssBaseline />

      {/* Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "darkgreen", // 👈 Fondo
            color: "white", // 👈 Color texto por defecto
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {/* Casos */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenCasos(!openCasos)}>
              <ListItemText primary="Casos" />
              {openCasos ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openCasos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/")}>
                <ListItemText primary="Casos" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Salir */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ color: "#e0e0e0", fontWeight: "bold" }}
            >
              <ListItemText primary="Salir" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main open={open}>
        <Toolbar />

        <input
          type="text"
          placeholder="Buscar por nombre de estudiante..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // resetear paginación
          }}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "10px",
            color: "black",
            background: "white",
            borderColor: "darkgreen", 
            borderWidth: "2px"
          }}
        />

        {/* Tabla */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={2} sx={{ maxHeight: "700px", overflowY: "auto", }}>
            <Table>
              <TableHead sx={{ background: "darkgreen" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Entrega
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Estudiante
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Caso
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Nota
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Evaluado por
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtradas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "gray" }}
                    >
                      No hay evaluaciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtradas.map((ev, i) => (
                    <TableRow
                      key={ev.id}
                      sx={{ background: i % 2 === 0 ? "#fff" : "#f5faf6" }}
                    >
                      <TableCell>{ev.id}</TableCell>

                      <TableCell>{ev.entregaId}</TableCell>

                      <TableCell>
                        {ev.estudianteNombre || "Sin estudiante"}
                      </TableCell>

                      <TableCell>{ev.casoTitulo || "Sin caso"}</TableCell>

                      <TableCell>
                        <Typography
                          fontWeight="bold"
                          sx={{ color: getNotaColor(ev.nota) }}
                        >
                          {Number(ev.nota).toFixed(1)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {ev.fechaEvaluacion
                          ? new Date(ev.fechaEvaluacion).toLocaleDateString(
                              "es-CO",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {ev.docente_id === null ? (
                          <Chip
                            label="IA"
                            size="small"
                            sx={{ background: "#e3f2fd", color: "#1565c0" }}
                          />
                        ) : (
                          <Chip label="Docente" size="small" color="success" />
                        )}
                      </TableCell>
                      <TableCell>{getEstadoChip(ev.estado)}</TableCell>
                      <TableCell>
                        {ev.estado !== "revisada" ? (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RateReviewIcon />}
                            onClick={() => handleRevisar(ev)}
                            sx={{
                              borderColor: "darkgreen",
                              color: "darkgreen",
                              "&:hover": { background: "#e8f5e9" },
                            }}
                          >
                            Revisar
                          </Button>
                        ) : (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleRevisar(ev)}
                            sx={{ color: "gray" }}
                          >
                            Ver detalle
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Modal de revisión */}
        <ReviewEvaluationModal
          open={openReview}
          onClose={() => setOpenReview(false)}
          evaluacion={selectedEval}
          onConfirm={handleConfirmar}
        />

        {/* Snackbar */}
        <Snackbar
          open={openAlert}
          autoHideDuration={4000}
          onClose={() => setOpenAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={() => setOpenAlert(false)}
            severity={alertSev}
            sx={{ width: "100%" }}
          >
            {alertMsg}
          </MuiAlert>
        </Snackbar>


      </Main>

        {/* Botón flotante para abrir */}
      {!open && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            backgroundColor: "darkgreen",
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

    </>
  );
}
