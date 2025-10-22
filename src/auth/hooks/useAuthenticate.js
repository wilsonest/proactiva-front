import { authTypes } from "../types/authTypes"
import { loginUser, signUpWithEmailAndPassword, getUserInfo } from "../providers/provider"

export const useAuthenticate = (dispatch) => {

    const login = async ({ email, password }) => {

        const { ok, uid, displayName, errorMessage } = await loginUser(email, password)

        if (!ok) {
            const action = {
                type: authTypes.errors,
                payload: { errorMessage }
            }
            dispatch(action);

            return false;
        }

        const userPayload = { email, uid, displayName }

        const action = {
            type: authTypes.login,
            payload: userPayload,
        };
        const userInfo = await getUserInfo(userPayload, false);
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
        const { ok, errorMessage, uid } = await signUpWithEmailAndPassword({ email, password })
        if (!ok) {
            sendErrorAction(errorMessage)
            return false;
        }

        const userPayload = {
            uid: uid,
            country: country,
            displayName: fullname,
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
