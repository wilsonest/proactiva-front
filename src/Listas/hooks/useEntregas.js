import { getCasesById, getEntregasById, getUsuarioById, getEstudiantes, getEvaluacionById, getEvaluaciones, getMisEntregas, getCases, getEntregasByCaso, getAllEntregasByCaso } from "../../api/provider"
import { entregaTypes } from "../types/entregaTypes";
import { evaluacionTypes } from "../types/evaluacionTypes";

export const useEntregas = (dispatch) => {
    const getEntregasByEstudent = async (Token, id) => {
        try {
            const response = await getEntregasById(Token, id);
            const action = {
                type: entregaTypes.getEntregasByUser,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la Vista de casos", error);
            throw error;
        }
    }

        const getEntregasByCasoId = async (Token, id) => {
        try {
            const response = await getAllEntregasByCaso(Token, id);
            const action = {
                type: entregaTypes.getEntregasByUser,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la Vista de casos", error);
            throw error;
        }
    }

        const getMiEntrega = async (Token) => {
        try {
            const response = await getMisEntregas(Token);
            const action = {
                type: entregaTypes.getMisentregas,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la Vista de entregas", error);
            throw error;
        }
    }

    const getEvaluacionesByEstudiante = async (Token, id)  => {
        try {
            const response = await getEvaluacionById(Token, id);
            const action = {
                action: evaluacionTypes.getEvaluacionById,
                payload: response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la obtencion de evaluaciones", error);
            throw error;
        }
    }

        const getUsuariosById = async (Token, id)  => {
        try {
            const response = await getUsuarioById(Token, id);
            const action = {
                action: entregaTypes.getUsuariosById,
                payload: response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la obtencion de usuarios", error);
            throw error;
        }
    }

    const getAllEstudiantes = async (Token) => {
        try {
            const response = await getEstudiantes(Token);
            const action = {
                action: evaluacionTypes.getEstudiantes,
                payload: response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo la consulta de estudiantes", error);
            throw error;
        }
    }

    const getAllCalificaciones = async (Token) => {
        try {
            const response = await getEvaluaciones(Token);
            const action = {
                action: evaluacionTypes.getEvaluaciones,
                payload: response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("No se Obtuvieron las Evaluaciones")
        }
    }

    const getCaseById = async (token, id) => {
        try {
            const response = await getCasesById(token, id);
            const action = {
                type: evaluacionTypes.getCasosById,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallo el caso", error);
            throw error;
        }
    }

    const getAllCases = async (token) => {
        try {
            const response = await getCases(token);
            const action = {
                type: evaluacionTypes.getAllcases,
                payload:response,
            }
            dispatch(action);
            return response;
        } catch (error) {
            console.log("Fallaron los casos", error);
            throw error;
        }
    }

    return {getEntregasByEstudent, getEvaluacionesByEstudiante, getAllEstudiantes, getAllCalificaciones, getUsuariosById, getCaseById, getMiEntrega, getAllCases, getEntregasByCasoId}
};