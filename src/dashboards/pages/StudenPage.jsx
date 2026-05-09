import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, { useContext, useEffect, useState } from "react";
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
import ViewCaseModal from "../components/ViewCaseModal";
import ViewCaseModalStuedent from "../components/ViewCaseModalStudent";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

export default function StudentPage() {
  const [openCasos, setOpenCasos] = useState(false);
  const [cases, setCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const casesPerPage = 4;
  const { logout } = useContext(UserContext);
  const { getAllCases, getCaseById, generateResponse, evaluacionIa, getEntregaByCasos, getEvaluacionesByEstudiante } =
    useContext(CasesContext);
  const [open, setOpen] = useState(true);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [casebyid, setcasebyid] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [iaResult, setIaResult] = useState(null);
  const [entregaRespuesta,setentregaRespuesta] = useState("");
  const [MyObservacion,setMyObservacion] = useState("");
  

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Login", { replace: true });
  };

  // Filtro de búsqueda por nombre de caso
  const filteredCases = cases.filter((caseItem) =>
    caseItem.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

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

  async function generarRespuesta(data) {
    try {
      const token = JSON.parse(localStorage.getItem("Token"));

      const respuesta = await generateResponse(token, data);

      const respuestaIa = await evaluacionIa(token, respuesta.id);
      setIaResult(respuestaIa);

      setMessageAlert("Respuesta enviada exitosamente");
      setSuccessAlert(true);
      // setOpenViewModal(false);
    } catch (error) {
      console.error("Error en el proceso:", error);

      setMessageAlert("Error al generar la respuesta o evaluación IA");
      setSuccessAlert(false);
    }
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("Token"));
    if (token && token.access_token) {
      loadCases(token.access_token);
    }
  }, []);

  // Paginación sobre los casos filtrados
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  async function loadCase(id) {
  const token = JSON.parse(localStorage.getItem("Token"));

  if (token && token.access_token) {
    try {
      const caso = await getCaseById(token.access_token, id);

      const entrega = await getEntregaByCasos(token.access_token, caso.id);

      const entregaId = entrega?.[0]?.id;

      setentregaRespuesta(entrega?.[0]?.respuesta || "Responder...");

      let observacion = "";

      if (entregaId) {

        const Myevaluacion = await getEvaluacionesByEstudiante(token.access_token, entregaId);
        observacion = Myevaluacion?.observaciones_text || Myevaluacion?.[0]?.observaciones_text || "";
        
      }

      setMyObservacion(observacion);
      setcasebyid(caso);
      setOpenViewModal(true);

    } catch (error) {
      console.error("Error al abrir el caso:", error);
    }
  } else {
    console.error("No hay token");
  }
}

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
          {/* Casos */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenCasos(!openCasos)}>
              <ListItemText primary="Casos" />
              {openCasos ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCasos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate("/ListaEstudiante")}
              >
                <ListItemText primary="Mis Casos" />
              </ListItemButton>
            </List>
          </Collapse>

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

      <ViewCaseModalStuedent
        open = {openViewModal}
        onClose={() => setOpenViewModal(false)}
        onView = {casebyid}
        onResponse = {generarRespuesta}
        iaResult = {iaResult}
        entregaRespuesta = {entregaRespuesta}
        MyObservacion = {MyObservacion}
      />

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
            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder="Buscar por nombre de caso..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reinicia a la primera página al buscar
              }}
              style={{
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ffffff",
                width: "100%",
                marginTop: 8,
                marginBottom: 8,
                color: "black",
                background: "white",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {currentCases.length === 0 ? (
              <p style={{ color: "gray", width: "100%" }}>
                No se encontraron casos.
              </p>
            ) : (
              currentCases.map((caseItem) => (
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
                  <p>{caseItem.descripcion.slice(0, 20)}</p>
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
                </Box>
              ))
            )}
          </Box>
          {/* Paginación */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
