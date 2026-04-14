import { useReducer } from "react";
import { CasesContext } from "./CasesContext";
import {casesReducer} from '../reducers/casesReducer'
import { useCases } from "../hooks/useCases";


const casesInitialState = {
    cases: [],
    errorMessage: null,
};

export const CasesProvider = ({ children }) => {
    const [casesState, dispatch] = useReducer(casesReducer, casesInitialState);
    const {getAllCases, createCases, getCaseById, deleteCase, updateCase, createRubrica, getRyCbyId, updateRubrica, generateResponse, evaluacionIa, getEntregaByCasos} = useCases(dispatch);

    return (
        <CasesContext.Provider value={{ casesState, getAllCases, createCases, getCaseById, deleteCase, updateCase, createRubrica, getRyCbyId, updateRubrica, generateResponse, evaluacionIa, getEntregaByCasos }}>
            {children}
        </CasesContext.Provider>
    );
}