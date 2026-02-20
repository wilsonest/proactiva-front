import {TOKEN_ENDPOINT, BASE_URL} from "./configApi";
import axios from "axios";


// Mock user data
// const mockUsers = [
//     {
//         uid: '1',
//         email: 'test@example.com',
//         password: '123456',
//         displayName: 'Wilson Estrada',
//         rol: 'teacher'
//     },
// ];

// export const loginUser = async (email, password) => {
//     const user = mockUsers.find(u => u.email === email && u.password === password);
//     if (user) {
//         return {
//             ok: true,
//             ...user,
//         };
//     } else {
//         return {
//             ok: false,
//             errorMessage: 'Usuario o contraseña incorrectos',
//         };
//     }
// };

export const loginUser = async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

  try {
    const response = await axios.post(TOKEN_ENDPOINT, body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = response.data;
    const expirationTime = new Date().getTime() + tokenData.tiempo_expiracion  * 60 * 1000; // Convertir a milisegundos
    localStorage.setItem("Token", JSON.stringify({
      ...tokenData,
      expirationTime,
    }));

    return{
        ok: true,
        ...tokenData,
    }
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    return null;
  }
};

export const signUp = async ({ email, password }) => {
    const exists = mockUsers.some(u => u.email === email);
    if (exists) {
        return {
            ok: false,
            errorMessage: 'El usuario ya existe',
        };
    }
    const newUser = {
        uid: String(mockUsers.length + 1),
        email,
        password,
        displayName: email.split('@')[0],
        photoURL: 'https://media.istockphoto.com/id/1495088043/es/vector/icono-de-perfil-de-usuario-avatar-o-icono-de-persona-foto-de-perfil-s%C3%ADmbolo-de-retrato.jpg?s=612x612&w=0&k=20&c=mY3gnj2lU7khgLhV6dQBNqomEGj3ayWH-xtpYuCXrzk=',
        country: 'ES',
        darkMode: false,
        followers: 0,
        following: 0,
        isloggedWithSpotify: false,
    };
    mockUsers.push(newUser);
    return {
        ok: true,
        uid: newUser.uid,
    };
};

export const getUserInfo = async (token) => {
  const response = await axios.get(BASE_URL + "/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
    // const found = mockUsers.find(u => u.uid === user.uid);
    // return found || null;


export const updateUserInfo = async (userUid, updatedFields) => {
    const user = mockUsers.find(u => u.uid === userUid);
    if (user) {
        Object.assign(user, updatedFields);
        return true;
    }
    return false;
};
