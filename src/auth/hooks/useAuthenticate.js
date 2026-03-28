import { authTypes } from "../types/authTypes"
import { loginUser, signUp, getUserInfo } from "../../api/provider";

export const useAuthenticate = (dispatch) => {

    const login = async ({ email, password }) => {

        // const {ok,usuario: { id, nombre_usuario, correo_electronico, rol } = {},errorMessage} = await loginUser(email, password);
        const {ok, access_token, errorMessage} = await loginUser(email, password);
        if (!ok) {
            const action = {
                type: authTypes.errors,
                payload: { errorMessage }
            }
            dispatch(action);

            return false;
        }

        const userInfo = await getUserInfo(access_token);
        localStorage.setItem('user', JSON.stringify(userInfo));

        const action = {
            type: authTypes.login,
            payload: userInfo,
        };
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

    const signUpWithEmail = async (data) => {
        const response = await signUp(data)

        const action = {
            type: authTypes.signUp,
            payload: response,
        }

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
