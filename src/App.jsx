import { Cases } from "@mui/icons-material";
import { UserProvider } from "./auth/context/UserProvider";
import StudenPage from "./dashboards/pages/StudenPage";
import { AppRouter } from "./routes/AppRouter";
import { CasesProvider } from "./dashboards/context/CasesProvider";
import { EntregasProvider } from "./Listas/context/EntregasProvider";


export const App = () => {

  return (
    <>
    <EntregasProvider>
    <CasesProvider>
      <UserProvider>
        <AppRouter />   
      </UserProvider>
    </CasesProvider>
    </EntregasProvider>
    </>
  );
};
