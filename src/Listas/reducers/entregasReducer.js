import { entregaTypes } from "../types/entregaTypes";
import { evaluacionTypes } from "../types/evaluacionTypes";

export const entregasReducer = (state, action) => {
    switch (action.type){
        case entregaTypes.getEntregasByUser:
            return {
                ... state,
                entregas: action.payload
            }
         case evaluacionTypes.getEvaluacionById:
            return {
                ... state,
                evaluacion: action.payload
            }
        case evaluacionTypes.getEstudiantes:
            return {
                ... state,
                estudiantes: action.payload
            }
        case evaluacionTypes.getEvaluaciones:
            return {
                ... state,
                estudiantes: action.payload
            }
        case entregaTypes.getUsuariosById:
            return {
                ... state,
                entregas: action.payload
            }
        case evaluacionTypes.getCasosById:
            return {
                ... state,
                estudiantes: action.payload
            }
        case entregaTypes.getMisentregas:
            return {
                ... state,
                estudiantes: action.payload
            }
        case evaluacionTypes.getAllcases:
            return {
                ... state,
                evaluacion: action.payload
            }
        case entregaTypes.getEntregasByCaso:
            return {
                ... state,
                entregas: action.payload
            }
    }
}