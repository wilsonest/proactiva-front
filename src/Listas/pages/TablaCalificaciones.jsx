import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../auth/context/UserContext";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { EntregasContext } from "../context/EntregasContext";
import { getEvaluacionDetalle } from "../../api/provider";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

// Componente de fila expandible con detalles de evaluación
function FilaExpandible({ row }) {
  const [abierto, setAbierto] = useState(false);
  const [detalles, setDetalles] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleClick = async () => {
    setAbierto(!abierto);

    // Cargar detalles solo la primera vez que se abre
    if (!abierto && !detalles) {
      setCargando(true);
      try {
        const token = JSON.parse(localStorage.getItem("Token"));
        const data = await getEvaluacionDetalle(token.access_token, row.evaluacionId);
        setDetalles(data);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setCargando(false);
      }
    }
  };

  // Color según la nota
  const getColorNota = (nota) => {
    if (nota >= 4) return "#4caf50"; // verde
    if (nota >= 3) return "#ff9800"; // naranja
    return "#f44336"; // rojo
  };

  return (
    <>
      <TableRow hover sx={{ cursor: "pointer" }} onClick={handleClick}>
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {abierto ? (
              <KeyboardArrowUpIcon fontSize="small" color="primary" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" color="primary" />
            )}
            <span style={{ color: "#1976d2", fontWeight: "bold" }}>
              {row.nombre}
            </span>
          </Box>
        </TableCell>
        <TableCell>{row.caso}</TableCell>
        <TableCell>
          <Chip
            label={row.nota}
            size="small"
            sx={{
              fontWeight: "bold",
              backgroundColor: getColorNota(row.nota),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>{row.fechaEntrega}</TableCell>
        <TableCell>{row.fechaEvaluacion}</TableCell>
        <TableCell>
          {row.esIA ? (
            <Chip label="IA" size="small" color="secondary" variant="outlined" />
          ) : (
            <Chip label="Profesor" size="small" color="primary" variant="outlined" />
          )}
        </TableCell>
      </TableRow>

      {/* Fila expandible con respuesta y evaluación */}
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 0, borderBottom: abierto ? "2px solid #1976d2" : "none" }}>
          <Collapse in={abierto} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, my: 1, maxHeight: 500, overflowY: "auto"}}>

              {/* Respuesta del estudiante */}
              <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, color: "darkgreen" }}>
                  Respuesta del Estudiante:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    backgroundColor: "white",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid #e0e0e0",
                    maxHeight: 120,
                    overflowY: "auto",
                  }}
                >
                  {row.respuesta || "Sin respuesta registrada"}
                </Typography>
              </Box>

              {/* Cargando detalles */}
              {cargando && (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CircularProgress size={30} sx={{ color: "darkgreen" }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>Cargando evaluación...</Typography>
                </Box>
              )}

              {/* Detalles de la evaluación por criterio */}
              {detalles && detalles.detalles && (
                <Box sx={{ backgroundColor: "#e8f5e9", p: 2, borderRadius: 1, mb: 2, maxHeight: 400, overflowY: "auto"  }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 2, color: "darkgreen" }}>
                    {row.esIA ? "Evaluación por IA:" : "Evaluación por Profesor:"}
                  </Typography>

                  {detalles.detalles.map((detalle, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: "white",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid #c8e6c9",
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          {detalle.criterio?.nombre || `Criterio ${index + 1}`}
                        </Typography>
                        <Chip
                          label={`${detalle.puntaje_numerico} / 5`}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: getColorNota(detalle.puntaje_numerico),
                            color: "white",
                          }}
                        />
                      </Box>

                      {/* Barra de progreso */}
                      <LinearProgress
                        variant="determinate"
                        value={(detalle.puntaje_numerico / 5) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mb: 1,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: getColorNota(detalle.puntaje_numerico),
                            borderRadius: 4,
                          },
                        }}
                      />

                      {/* Descripción del criterio */}
                      {detalle.criterio?.descripcion && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                          {detalle.criterio.descripcion}
                        </Typography>
                      )}

                      {/* Comentario de la evaluación */}
                      {detalle.comentario_text && (
                        <Typography variant="body2" sx={{ fontStyle: "italic", color: "#555", mt: 0.5 }}>
                          💬 {detalle.comentario_text}
                        </Typography>
                      )}
                    </Box>
                  ))}

                  {/* Nota final y observaciones */}
                  <Box sx={{ backgroundColor: "white", p: 2, borderRadius: 1, border: "2px solid darkgreen", mt: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "darkgreen" }}>
                        Nota Final:
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: getColorNota(detalles.nota_total),
                        }}
                      >
                        {detalles.nota_total} / 5
                      </Typography>
                    </Box>

                    {detalles.observaciones_text && (
                      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid #e0e0e0" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                          Retroalimentación General:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          {detalles.observaciones_text}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ListaAllCalificaciones() {
  const [openEstudiantes, setOpenEstudiantes] = React.useState(false);
  const [openCasos, setOpenCasos] = useState(false);
  const { logout } = useContext(UserContext);
  const { getAllCalificaciones, getUsuariosById, getCaseById, getEntregasByEstudent } =
    useContext(EntregasContext);
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableInfo, setTableInfo] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    userState: { user },
  } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    loadCalificaciones();
  }, []);

  async function loadCalificaciones() {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (!token?.access_token) {
      console.error("No hay token");
      return;
    }

    try {
      const calificaciones = await getAllCalificaciones(token.access_token);

      const tableData = await Promise.all(
        calificaciones.map(async (calificacion) => {
          let entrega = null;
          try {
            entrega = await getEntregasByEstudent(
              token.access_token,
              calificacion.entrega_id
            );
          } catch {}

          let estudiante = null;
          try {
            estudiante = await getUsuariosById(
              token.access_token,
              entrega.estudiante_id
            );
          } catch {}

          let caso = null;
          try {
            caso = await getCaseById(token.access_token, entrega.caso_id);
          } catch {}

          return {
            id: calificacion.id,
            evaluacionId: calificacion.id,
            nombre: estudiante?.nombre_usuario ?? "Sin nombre",
            caso: caso?.titulo ?? "Sin título",
            nota: calificacion?.nota_total ?? "-",
            fechaEntrega: entrega?.fecha_entrega
              ? new Date(entrega.fecha_entrega).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            fechaEvaluacion: calificacion?.fecha_evaluacion
              ? new Date(calificacion.fecha_evaluacion).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-",
            respuesta: entrega?.respuesta ?? "Sin respuesta registrada",
            esIA: calificacion.docente_id === null,
          };
        })
      );

      setTableInfo(tableData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate("/Login", { replace: true });
  };

  const filteredData = tableInfo.filter((row) =>
    (row.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "darkgreen",
            color: "white",
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

          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenEstudiantes(!openEstudiantes)}>
              <ListItemText primary="Estudiantes" />
              {openEstudiantes ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openEstudiantes} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/ListaAllEstudiante")}>
                <ListItemText primary="Lista de estudiantes" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Calificaciones" />
              </ListItemButton>
            </List>
          </Collapse>

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
          placeholder="Buscar por nombre de usuario..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "10px",
            color: "black",
            background: "white",
          }}
        />
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader aria-label="tabla calificaciones">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estudiante</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Caso</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nota</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha Entrega</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha Evaluación</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Evaluado por</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <FilaExpandible key={row.id} row={row} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Main>

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