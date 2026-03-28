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
    }
}