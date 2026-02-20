import { authTypes } from "../types/authTypes"
import { loginUser, signUp, getUserInfo } from "../../api/provider";

export const useAuthenticate = (dispatch) => {

    const login = async ({ email, password }) => {

        // const {ok,usuario: { id, nombre_usuario, correo_electronico, rol } = {},errorMessage} = await loginUser(email, password);
        const {ok, access_token, token_type, tiempo_expiracion, errorMessage} = await loginUser(email, password);
        if (!ok) {
            const action = {
                type: authTypes.errors,
                payload: { errorMessage }
            }
            dispatch(action);

            return false;
        }

        const tokenPayload = { access_token }

        const action = {
            type: authTypes.login,
            payload: tokenPayload,
        };
        const userInfo = await getUserInfo(tokenPayload, false);
        localStorage.setItem('user', JSON.stringify(userInfo));
        dispatch(action);

        return true;
    };

    const logout = () => {
        const action = {
            type: authTypes.logout,
        }
        localStorage.clear();
        dispatch(action)

    }

    const signUpWithEmail = async ({ email, password, country, fullname }) => {
        const { ok, errorMessage, uid } = await signUp({ email, password })
        if (!ok) {
            sendErrorAction(errorMessage)
            return false;
        }

        const userPayload = {
            uid: uid,
            country: country,
            displayName: fullname,
            rol: rol
        }
        const action = {
            type: authTypes.login,
            payload: userPayload,
        };
        const userInfo = await getUserInfo(userPayload, false);
        localStorage.setItem('user', JSON.stringify(userInfo));

        dispatch(action)

        return true;
    }

    const sendErrorAction = (errorMessage) => {
        const action = {
            type: authTypes.errors,
            payload: { errorMessage }
        }
        dispatch(action);

    }

    return { login, logout, signUpWithEmail };
};
