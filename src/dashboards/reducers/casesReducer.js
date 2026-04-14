import {casesTypes} from "../types/casesTypes";

export const casesReducer = (state, action) => {
    switch (action.type) {
        case casesTypes.getCases:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.createCase:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.getCasesByID:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.deleteCase:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.updateCase:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.createRubrica:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.getCriteriosRubricas:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.generateResponse:
            return {
                ...state,
                cases: action.payload,
            };
        case casesTypes.evaluacionIa:
            return {
                ...state,
                cases: action.payload,
            };   
        case casesTypes.getEntregasByIdCasos:
            return {
                ...state,
                cases: action.payload,
            };     
        default:
            break
    }
};