
// Mock user data
const mockUsers = [
    {
        uid: '1',
        email: 'test@example.com',
        password: '123456',
        displayName: 'Wilson Estrada',
        rol: 'teacher'
    },
];

export const loginUser = async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
        return {
            ok: true,
            ...user,
        };
    } else {
        return {
            ok: false,
            errorMessage: 'Usuario o contraseña incorrectos',
        };
    }
};

export const signUpWithEmailAndPassword = async ({ email, password }) => {
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

export const getUserInfo = async (user) => {
    const found = mockUsers.find(u => u.uid === user.uid);
    return found || null;
};

export const updateUserInfo = async (userUid, updatedFields) => {
    const user = mockUsers.find(u => u.uid === userUid);
    if (user) {
        Object.assign(user, updatedFields);
        return true;
    }
    return false;
};
