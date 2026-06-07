import { LoginPage } from "../auth/pages/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import "../App.css";
import { UserContext } from "../auth/context/UserContext";
import { useContext } from "react";
import StudenPage from "../dashboards/pages/StudenPage";
import TeacherPage from "../dashboards/pages/TeacherPage";
import CoordinadorPage from "../dashboards/pages/CoordinadorPage";
import ListaEstudiante from "../Listas/pages/TablaListaEstudiante";
import ListaAllEstudiante from "../Listas/pages/TablaRegistroEstudiantes";
import ListaAllCalificaciones from "../dashboards/pages/ListaAllCalificaciones";
import ProfesoresTable from "../Listas/pages/TablaProfesores";


export const AppRouter = () => {
  const { userState: { logged, user } } = useContext(UserContext);
  const rol = user?.rol;

  if (!logged) {
    return (
      <>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/Login" />} />
        </Routes>
      </>
    );
  }
  if (rol == 'estudiante') {
    return (
      <>
        <Routes>
          <Route path="/" element={ <StudenPage /> } />
          <Route path="/*" element={<Navigate to="/" />} />
          <Route path="/ListaEstudiante" element={<ListaEstudiante />} />
        </Routes>
      </>
    );

  }

  if (rol == 'profesor') {
    return (
      <>
        <Routes>
          <Route path="/" element={<TeacherPage /> } />
          <Route path="/*" element={<Navigate to="/" />} />
          <Route path="/ListaAllEstudiante" element={<ListaAllEstudiante />} />
          <Route path="/ListaAllCalificaciones" element={<ListaAllCalificaciones />} />
        </Routes>
      </>
    );
  }

  if (rol == 'coordinador') {
    return (
      <>
        <Routes>
          <Route path="/" element={<CoordinadorPage />} />
          <Route path="/profesores" element={<ProfesoresTable />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );
  }
};
