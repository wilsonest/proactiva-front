// Cambio: Renombrar import para evitar conflicto de nombres
import { getCases, createCase, getCasesById, deleteCases, updateCaseById, createRubricas, getRubricaCriteriosById, updateRubricas, createRespuesta } from "../../api/provider";
import { casesTypes } from "../types/casesTypes";

export const useCases = (dispatch) => {

    const getAllCases = async (token) => {
    try {

        const cases = await getCases(token);

        if(cases.length === 0) {
            console.warn("No se ecnontraron casos");
            return;
        }else{
            const action = {
            type: casesTypes.getCases,
            payload: cases,
        }
        dispatch(action);

        return cases;
        }

        }
        catch (error) {
                console.error("Error fetching cases:", error);
            }
    }

    // Cambio: Usar apiCreateCase para evitar recursividad
    const createCases = async (token, caseData) => {
        try {
            const response = await createCase(token, caseData);
            console.log("Response data:", response);
            const action = {
                type: casesTypes.createCase,
                payload: response,
            };
            dispatch(action);
            return response;
        } catch (error) {
            console.log("La creacion del caso fallo", error);
            throw error;
        }
    } // <-- Fin cambio


    const getCaseById = async (token, id) => {
        try {
            const response = await getCasesById(token, id);
            console.log("Response data:", response);
            const action = {
                type: casesTypes.getCasesByID,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la Vista", error);
            throw error;
        }
    }

    const updateCase = async (token, id) => {
        try {
            const response = await updateCaseById(token, id);
            console.log("Response Update:", response);
            const action = {
                type: casesTypes.updateCase,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la Actualizacion", error)
            throw error;
        }
    }

    const deleteCase = async (token, id) => {
        try {
            const response = await deleteCases(token, id);
            const action = {
                type: casesTypes.deleteCase,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
             console.log("Fallo la eliminacion del caso", error);
            throw error;
        }
    }


    const createRubrica = async (token, data, responseSave) => {
        try {
            const response = await createRubricas(token, data, responseSave);
            console.log("Response data:", response);
            const action = {
                type: casesTypes.createRubrica,
                payload:response,
            }
            dispatch(action);
            return response
        } catch (error) {
            console.log("Fallo en la creacion de la rubrica del caso")
            throw error;
        }
    }

    const updateRubrica = async (token,id, rubrica) => {
        try {
            const response = await updateRubricas(token,id, rubrica);
            const action = {
                type: casesTypes.updateCriteriosRubricas,
                payload: response,

            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("No se pudo actualizar las rubricas y los criterios", error);
            throw error;
        }
    }

    const getRyCbyId = async (token, id) => {
        try {
            const response = await getRubricaCriteriosById(token, id);
            const action = {
                type: casesTypes.getCriteriosRubricas,
                payload: response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("No se pudo obtener los Criterios y Rubricas", error);
            throw error;
        }
    }
    
    const generateResponse = async (token, data) => {
        try {
            const response = await createRespuesta(token, data);
            console.log(response)
            const action = {
                type: casesTypes.generateResponse,
                payload: response,
            }
            dispatch(action);
            return response
        } catch (error) {
            console.log("No se pudo crear la respuesta", error);
            throw error;
        }
        
    }

    return {getAllCases, createCases, getCaseById, deleteCase, updateCase, createRubrica, getRyCbyId, updateRubrica, generateResponse}
};