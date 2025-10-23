import { LoginPage } from "../auth/pages/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import "../App.css";
import { UserContext } from "../auth/context/UserContext";
import { useContext } from "react";
import StudenPage from "../dashboards/pages/StudenPage";
import TeacherPage from "../dashboards/pages/TeacherPage";
import DashboardLayout from "../dashboards/components/DashboardLayout";


export const AppRouter = () => {
  console.log("AppRouter rendered");
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
  if (rol == 'student') {
    return (
      <>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <StudenPage />
            </DashboardLayout>
            } />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );

  }

  if (rol == 'teacher') {
    return (
      <>
        <Routes>
          <Route path="/" element={

            <DashboardLayout>
              <TeacherPage />
            </DashboardLayout>
             
             } />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );
  }

  if (rol == 'admin') {
    return (
      <>
        <Routes>
          <Route path="/" element={<StudenPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );

  }

  //  if (rol === "teacher") {
  //   return (
  //     <Routes>
  //       <Route
  //         path="/" element={
  //           <DashboardLayout>
  //             <TeacherPage />
  //           </DashboardLayout>
  //         }
  //       />
  //       <Route path="/*" element={<Navigate to="/" />} />
  //     </Routes>
  //   );
  // }
  // return (
  //   <>
  //     <Routes>
  //       <Route path="/" element={<StudenPage />} />
  //       {/* <Route path="/*" element={<Navigate to="/" />} />
  //       <Route path="/callback" element={<SpotifyCallbackPage />} /> */}
  //     </Routes>
  //   </>
  // );
};
