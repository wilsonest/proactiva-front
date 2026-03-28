import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, { useContext, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CreateCaseModal from "../components/CreateCaseModal";
import ViewCaseModal from "../components/ViewCaseModal";
import { UserContext } from "../../auth/context/UserContext";
import { CasesContext } from "../context/CasesContext";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
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

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

export default function CoordinadorPage() {
  const [openEstudiantes, setOpenEstudiantes] = React.useState(false);
  const [openCasos, setOpenCasos] = React.useState(false);
  const [cases, setCases] = useState([]);
  const [casebyid, setcasebyid] = useState([]);
  const [criteriosbyid, setCriteriosByID] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 4;
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const { logout } = useContext(UserContext);
  const { getAllCases, createCases, updateCase, getCaseById, deleteCase, createRubrica, getRyCbyId, updateRubrica } = useContext(CasesContext);

  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/Login", { replace: true });};

  const handleDrawerToggle = () => { setOpen(!open);};

  async function loadCases(token) {
    try {
      const storedCases = await getAllCases(token);
      if (storedCases) {
        setCases(storedCases);
      } else {
        console.warn("No cases found");
        setCases([]);
      }
    } catch (error) {
      console.error("Error loading cases:", error);
      setCases([]);
    }
  }

  async function loadCase(id) {
    const token = JSON.parse(localStorage.getItem("Token"));
    if (token && token.access_token) {
      try {
        const caso = await getCaseById(token.access_token, id);
        setcasebyid(caso);
        const RubricaCriterio = await getRyCbyId(token.access_token, id);
        setCriteriosByID(RubricaCriterio);
        setOpenViewModal(true);
      } catch (error) {
        console.error("Error al abrir el caso:", error);
      }
    } else {
      console.error("No hay token");
    }
  }

  async function crearCaso(data) {
    console.log("data", data);
    const token = JSON.parse(localStorage.getItem("Token"));
    if (token && token.access_token) {
      try {
        const guardar = await createCases(token.access_token, data);
        console.log("responseSave", guardar)
        await createRubrica(token.access_token,data,guardar);
        await loadCases(token.access_token);
        setMessageAlert("Caso creado exitosamente");
        setSuccessAlert(true); // <-- Mostrar alerta de éxito
        setOpenCreateModal(false); // <-- Cerrar modal
      } catch (error) {
        console.error("Error al crear caso:", error);
      }
    } else {
      console.error("No hay token");
    }
  }

  async function updateCaso(data){
    const token = JSON.parse(localStorage.getItem("Token"));

    if (!token?.access_token){
      console.log("No hay token");
      return;
    }

    try {

      await updateCase(token.access_token, data);
      await updateRubrica(token.access_token, data.id, data.rubrica);
      await loadCases(token.access_token);
      setMessageAlert("Caso actualizado exitosamente");
      setSuccessAlert(true);
      setOpenViewModal(false);

    } catch (error) {
      console.log("Error al actualizar:", error);
    }

  }

  async function deleteC(id){
    const token = JSON.parse(localStorage.getItem("Token"));
    if (token && token.access_token){
      try {
        const response = await deleteCase(token.access_token, id)
        await loadCases(token.access_token);
        setMessageAlert("Caso eliminado exitosamente");
        setSuccessAlert(true);
      } catch (error) {
        console.error("Error al eliminar caso:", error);
      }
    }else {
      console.error("No hay token");
    }
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("Token"));
    if (token && token.access_token) {
      loadCases(token.access_token);
    }
  }, []);

  // Paginación
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(cases.length / casesPerPage);

  const handlePageChange = (pageNumber) => { setCurrentPage(pageNumber);};

  return (
    <Box sx={{ display: "flex" }}>
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
              <ListItemText primary="Panel Del Coordinador" />
              {openCasos ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCasos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => setOpenCreateModal(true)}
              >
                <ListItemText primary=" Ver Analsiis" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Ver" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Estudiantes */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenEstudiantes(!openEstudiantes)}
            >
              <ListItemText primary="Casos de Estudio" />
              {openEstudiantes ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openEstudiantes} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Ver Casos" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Ver Casos" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Calificaciones */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Estudiantes" />
            </ListItemButton>
          </ListItem>

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

      {/* Popup para crear caso */}
      <ViewCaseModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        onView={casebyid}
        ryc= {criteriosbyid}
        onUpdate={updateCaso}
      />

      {/* Popup para crear caso */}
      <CreateCaseModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={crearCaso}
      />

      {/* Cambio: Snackbar de éxito */}
      <Snackbar
        open={successAlert}
        autoHideDuration={3000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSuccessAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {messageAlert}
        </MuiAlert>
      </Snackbar>
      {/* Contenido principal: Casos */}
      <Main open={open}>
        <Toolbar />
        <Box sx={{ maxWidth: 900, margin: "0 auto", mt: 4 }}>
          <Box sx={{ mb: 3 }}>
            <h2 style={{ color: "black", marginBottom: 8 }}>
              Tablero de Casos
            </h2>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {currentCases.map((caseItem) => (
              <Box
                key={caseItem.id}
                sx={{
                  flex: "1 1 40%",
                  minWidth: 250,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  background: "#fff",
                }}
              >
                <h3>{caseItem.titulo}</h3>
                <p>{caseItem.descripcion.slice(0,20)}</p>
                <button
                  style={{
                    padding: "6px 16px",
                    margin: "6px",
                    borderRadius: 4,
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => loadCase(caseItem.id)}
                >
                  Ver
                </button>
                <button
                  style={{
                    padding: "6px 16px",
                    borderRadius: 4,
                    border: "1px solid #red",
                    color: "#ffffff",
                    background: "red",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteC(caseItem.id)}
                >
                  Eliminar
                </button>
              </Box>
            ))}
          </Box>
          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      margin: "0 4px",
                      padding: "6px 12px",
                      borderRadius: 4,
                      border:
                        page === currentPage
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                      background: page === currentPage ? "#1976d2" : "#fff",
                      color: page === currentPage ? "#fff" : "#1976d2",
                      cursor: "pointer",
                      fontWeight: page === currentPage ? "bold" : "normal",
                    }}
                  >
                    {page}
                  </button>
                ),
              )}
            </Box>
          )}
        </Box>
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
    </Box>
  );
}
