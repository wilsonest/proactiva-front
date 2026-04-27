import { TOKEN_ENDPOINT, BASE_URL } from "./configApi";
import axios from "axios";
import api from "./apiClient";

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
    console.log(tokenData)
    // const expirationTime = new Date().getTime() + tokenData.tiempo_expiracion  * 60 * 1000; // Convertir a milisegundos
    localStorage.setItem("Token", JSON.stringify({...tokenData,})
        // expirationTime,
      // }),
    );

    return {
      ok: true,
      ...tokenData,
    };
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response?.data || error.message,
    );
    return null;
  }
};

export const signUp = async (data) => {
  try {
    const response = await axios.post(BASE_URL + "usuarios/", data);
    return response.data;

  } catch (error) {

    const mensaje = error.response?.data?.detail || error;
    throw new Error(mensaje);
  }
};

export const getUserInfo = async (token) => {
  // const response = await api.get(BASE_URL + "me", {
  const response = await api.get("me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getCases = async (token) => {
  try {
    // const response = await api.get(BASE_URL + "casos/", {
    const response = await api.get("casos/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.data;
  } catch (error) {
    console.error(
      "Error fetching cases:",
      error.response?.data || error.message,
    );
    return [];
  }
};

export const createCase = async (token, caseData) => {
  try {
    // const response = await api.post(BASE_URL + "casos/", caseData, {
    const response = await api.post("casos/", caseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creando el caso:", error.response?.data || error.message, );
    throw error;
  }
};

export const getCasesById = async (token, id) => {
  // const response = await api.get(BASE_URL + "casos/" + id, {
  const response = await api.get("casos/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCaseById = async (token, id) => {
  // const response = await api.put(BASE_URL + "casos/" + id.id,{
  const response = await api.put("casos/" + id.id,{
      titulo: id.titulo,
      descripcion: id.descripcion,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const deleteCases = async (token, id) => {
  // const response = await api.delete(BASE_URL + "casos/" + id, {
  const response = await api.delete("casos/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createRubricas = async (token, data, responseSave) => {
  // const response = await api.post(BASE_URL + "rubricas/caso/" + responseSave.id,{
  const response = await api.post("rubricas/caso/" + responseSave.id,{
      caso_id: responseSave.id,
      docente_id: responseSave.creador_id,
      nombre: data.tituloRubrica,
      descripcion: data.rubrica,
      tipo_rubrica: data.tipoRubrica,
      puntaje_maximo: data.escalaMax,
      publica: data.publica,
      vigente: data.vigente,
      permitir_autoevaluacion: data.autoEvaluacion,
      criterios: data.criterios
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const updateRubricaById = async (token, id) => {
  // const response = await api.put( BASE_URL + "casos/" + id.id,{
  const response = await api.put("casos/" + id.id,{
      titulo: id.titulo,
      descripcion: id.descripcion,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getRubricaCriteriosById = async (token, id) => {
  // const response = await api.get( BASE_URL + "rubricas/caso/" + id, {
  const response = await api.get("rubricas/caso/" + id, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });
  return response.data
};

export const updateRubricas = async (token, casoId, rubrica) => {

  // const response = await api.put(BASE_URL + "rubricas/caso/" + casoId, rubrica,{
  const response = await api.put("rubricas/caso/" + casoId, rubrica,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createRespuesta = async (token, data) => {
    // const response = await api.post(BASE_URL + "entregas", data, {
    const response = await api.post("entregas", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
}

export const getEntregasById = async (token, id) => {
  // const response = await api.get(BASE_URL + "entregas/" + id , {
  const response = await api.get("entregas/" + id , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getEntregasByCaso = async (token, id) => {
  // const response = await api.get(BASE_URL + "entregas/caso/" + id , {
  const response = await api.get("entregas/caso/" + id , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMisEntregas = async (token) => {
  // const response = await api.get(BASE_URL + "entregas/MisEntregas", {
  const response = await api.get("entregas/MisEntregas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getEvaluacionById = async (token, id) => {
  // const response = await api.get(BASE_URL + "evaluaciones/MisEvaluaciones/" + id , {
  const response = await api.get("evaluaciones/MisEvaluaciones/" + id , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
};

export const getEstudiantes = async (token) => {
  // const response = await api.get(BASE_URL + "estudiantes",{
  const response = await api.get("estudiantes",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data
}

export const getUsuarioById = async (token, id) => {
  // const response = await api.get(BASE_URL + "usuarios/" + id, {
  const response = await api.get("usuarios/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}

export const getEvaluaciones = async (token) => {
  // const response = await api.get(BASE_URL + "evaluaciones", {
  const response = await api.get("evaluaciones", {
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return response.data
}

export const evaluarIa = async (token, entrega_id) => {
  // const response = await api.post(BASE_URL + "evaluaciones/evaluar-con-ia/" + entrega_id, null, {
  const response = await api.post("evaluaciones/evaluar-con-ia/" + entrega_id, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}