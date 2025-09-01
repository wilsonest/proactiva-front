import { UserProvider } from "./auth/context/UserProvider";
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
