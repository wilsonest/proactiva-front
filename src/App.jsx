import { UserProvider } from "./auth/context/UserProvider";
import StudenPage from "./dashboards/pages/StudenPage";
import { AppRouter } from "./routes/AppRouter";


export const App = () => {

  return (
    <>
      <UserProvider>
        <AppRouter />   
      </UserProvider>
    </>
  );
};
