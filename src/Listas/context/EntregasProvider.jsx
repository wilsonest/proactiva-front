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
    const {getEntregasByEstudent, getEvaluacionesByEstudiante, getAllEstudiantes, getAllCalificaciones, getUsuariosById, getCaseById, getMiEntrega, getAllCases, getEntregasByCasoId} = useEntregas(dispatch);

    return (
        <EntregasContext.Provider value={{entregasState, getEntregasByEstudent, getEvaluacionesByEstudiante, getAllEstudiantes, getAllCalificaciones, getUsuariosById, getCaseById, getMiEntrega, getAllCases, getEntregasByCasoId }}>
            {children}
        </EntregasContext.Provider>
    );
}