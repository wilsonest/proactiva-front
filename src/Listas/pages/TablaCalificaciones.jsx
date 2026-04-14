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
  { id: "id", label: "Id", minWidth: 100 },
  { id: "nombre", label: "Nombre", minWidth: 100 },
  { id: "caso", label: "Caso", minWidth: 200 },
  { id: "nota", label: "Nota", minWidth: 100 },
  { id: "fecha", label: "Fecha", minWidth: 100 },
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

export default function ListaAllCalificaciones() {
  const [openEstudiantes, setOpenEstudiantes] = React.useState(false);
  const [openCasos, setOpenCasos] = useState(false);
  const { logout } = useContext(UserContext);
  const { getAllCalificaciones, getUsuariosById, getCaseById, getEntregasByEstudent } = useContext(EntregasContext);
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableInfo, setTableInfo] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { userState: { user },} = useContext(UserContext);


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
          caso = await getCaseById(
            token.access_token,
            entrega.caso_id
          );
        } catch {}

        return {
          id: calificacion.id,
          nombre: estudiante?.nombre_usuario ?? "Sin nombre",
          caso: caso?.titulo ?? "Sin título",
          nota: calificacion?.nota_total ?? "-",
          fecha: calificacion?.fecha_evaluacion ? new Date(calificacion.fecha_evaluacion).toLocaleDateString("es-CO") : "-"
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
    (row.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()),
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


          {/* Estudiantes */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setOpenEstudiantes(!openEstudiantes)}
            >
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
          placeholder="Buscar por nombre de usuario..."
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
                      style={{ minWidth: column.minWidth }}
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
