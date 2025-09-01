import { authTypes } from "../types/authTypes";

export const authReducer = (state = {}, action = {}) => {

    console.log('action.type:', action.type);
    switch (action.type) {
        case authTypes.login:
            return {
                ...state,
                logged: true,
                user: action.payload,
                errorMessage: null
            };
        case authTypes.logout:
            return {
                logged: false,
                user: {},
                errorMessage: null
            };
        case authTypes.errors:
            return {
                ...state,
                logged: false,
                errorMessage: action.payload.errorMessage
            };
        case authTypes.signUp:
            return {
                logged: false,
                user: {},
                errorMessage: null
            };
        default:
            return state;
    }

}