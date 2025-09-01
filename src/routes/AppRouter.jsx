import { LoginPage } from "../auth/pages/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import "../App.css";
import { UserContext } from "../auth/context/UserContext";


export const AppRouter = () => {
  console.log("AppRouter rendered");
  const {userState: { logged },} = useContext(UserContext);

  // return (
  //     <>
  //       <Routes>
  //         <Route path="/Login" element={<LoginPage />} />
  //         <Route path="/*" element={<Navigate to="/Login" />} />
  //       </Routes>
  //     </>
  //   );
  
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
  return (
    <>
      <Routes>
        <Route path="/" element={<Sidenav />} />
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/callback" element={<SpotifyCallbackPage />} />
      </Routes>
    </>
  );
};
