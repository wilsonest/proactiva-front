import { useReducer } from "react";
import { EntregasContext } from "./EntregasContext";
import { useEntregas } from "../hooks/useEntregas";
import { entregasReducer } from "../reducers/entregasReducer";


const casesInitialState = {
    entregas: [],
    errorMessage: null,
};

export const EntregasProvider = ({ children }) => {
    const [entregasState, dispatch] = useReducer(entregasReducer, casesInitialState);
    const {getEntregasByEstudent, getEvaluacionesByEstudiante} = useEntregas(dispatch);

    return (
        <EntregasContext.Provider value={{entregasState, getEntregasByEstudent, getEvaluacionesByEstudiante }}>
            {children}
        </EntregasContext.Provider>
    );
}