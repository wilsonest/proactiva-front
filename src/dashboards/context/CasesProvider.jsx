import { useReducer } from "react";
import { CasesContext } from "./CasesContext";
import {casesReducer} from '../reducers/casesReducer'
import { useCases } from "../hooks/useCases";
import { useEntregas } from "../../Listas/hooks/useEntregas";


const casesInitialState = {
    cases: [],
    errorMessage: null,
};

export const CasesProvider = ({ children }) => {
    const [casesState, dispatch] = useReducer(casesReducer, casesInitialState);
    const {getAllCases, createCases, getCaseById, deleteCase, updateCase, createRubrica, getRyCbyId, updateRubrica, generateResponse, evaluacionIa, getEntregaByCasos} = useCases(dispatch);
    // Importar función de entregas
    const { getEvaluacionesByEstudiante } = useEntregas(dispatch);

    return (
        <CasesContext.Provider value={{
            casesState,
            getAllCases,
            createCases,
            getCaseById,
            deleteCase,
            updateCase,
            createRubrica,
            getRyCbyId,
            updateRubrica,
            generateResponse,
            evaluacionIa,
            getEntregaByCasos,
            getEvaluacionesByEstudiante // <-- ahora disponible en el contexto
        }}>
            {children}
        </CasesContext.Provider>
    );
}