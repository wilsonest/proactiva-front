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
import { EntregasContext } from "../context/EntregasContext";

const drawerWidth = 240;

const columns = [
  { id: "id", label: "Id Caso", minWidth: 100 },
  { id: "caso", label: "Caso", minWidth: 100 },
  { id: "profesor", label: "Profesor", minWidth: 100 },
  { id: "fecha", label: "Fecha", minWidth: 100 },
  { id: "aprobados", label: "Aprobados", minWidth: 100 },
  { id: "reprobados", label: "Reprobados", minWidth: 100 },
];

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

export default function ProfesoresTable() {
  const [openEstudiantes, setOpenEstudiantes] = React.useState(false);
  const [openCasos, setOpenCasos] = useState(false);
  const { logout } = useContext(UserContext);
  const {
    getAllCases,
    getUsuariosById,
    getCaseById,
    getEvaluacionesByEstudiante,
    getEntregasByCasoId,
  } = useContext(EntregasContext);
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
    loadCasosByProfesor();
  }, []);

  async function loadCasosByProfesor() {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (!token?.access_token) {
      console.error("No hay token");
      return;
    }

    try {
      const casos = await getAllCases(token.access_token);

      const tableData = await Promise.all(
        casos.map(async (caso) => {
          let profesor = null;
          try {
            profesor = await getUsuariosById(
              token.access_token,
              caso.creador_id,
            );
          } catch {}

          let entregas = [];
          try {
            entregas = await getEntregasByCasoId(token.access_token, caso.id);
          } catch {
            entregas = [];
          }

          let aprobados = 0;
          let reprobados = 0;

          await Promise.all(
            entregas.map(async (entrega) => {
              try {
                const evaluacion = await getEvaluacionesByEstudiante(token.access_token, entrega.id,);

                if (evaluacion?.nota_total >= 3) {
                  aprobados++;
                } else {
                  reprobados++;
                }
              } catch {}
            }),
          );

          return {
            id: caso.id,
            caso: caso?.titulo ?? "Sin título",
            profesor: profesor?.nombre_usuario ?? "Sin nombre",
            fecha: caso?.fecha_creacion
              ? new Date(caso.fecha_creacion).toLocaleDateString("es-CO")
              : "-",
            aprobados,
            reprobados,
          };
        }),
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
    (row.profesor || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          placeholder="Buscar por nombre de profesor..."
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
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {/* <TableContainer sx={{ maxHeight: 440 }}> */}
          <TableContainer sx={{}}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight: "bold",}}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "text"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredData.length} // 👈 aquí
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
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
