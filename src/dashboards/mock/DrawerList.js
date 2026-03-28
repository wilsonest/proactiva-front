// Mock user data
const mockUsers = [
  {
    uid: "1",
    email: "test@example.com",
    password: "123456",
    displayName: "Wilson Estrada",
    rol: "teacher",
  },
];
export const loginUser = async (email, password) => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password,
  );
  if (user) {
    return { ok: true, ...user };
  } else {
    return { ok: false, errorMessage: "Usuario o contraseña incorrectos" };
  }
};
