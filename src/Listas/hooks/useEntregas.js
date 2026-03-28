import { getEntregasById, getEvaluacionById } from "../../api/provider"
import { entregaTypes } from "../types/entregaTypes";
import { evaluacionTypes } from "../types/evaluacionTypes";

export const useEntregas = (dispatch) => {
    const getEntregasByEstudent = async (Token, id) => {
        try {
            const response = await getEntregasById(Token, id);
            console.log("Response data:", response);
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

    const getEvaluacionesByEstudiante = async (Token, id)  => {
        try {
            const response = await getEvaluacionById(Token, id);
            console.log("response ", response)
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

    return {getEntregasByEstudent, getEvaluacionesByEstudiante}
};