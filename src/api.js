// src/api.js
// Servicios para consumir la API backend según openapi.yaml

const API_URL = "http://localhost:5000/api";

// Helper para armar headers (con o sin token)
function getHeaders(token, isJson = true) {
  /** @type {Record<string, string>} */
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**@typedef {import('../types').Cliente} Cliente */
/**@typedef {import('../types').Area} Area */
/**@typedef {import('../types').Usuario} Usuario */
/**@typedef {import('../types').Tecnico} Tecnico */
/**@typedef {import('../types').TecnicoCompleto} TecnicoCompleto */
/**@typedef {import('../types').TecnicoArea} TecnicoArea */
/**@typedef {import('../types').Pedido} Pedido */
/**@typedef {import('../types').PedidoCandidato} PedidoCandidato */
/**@typedef {import('../types').PedidoDisponibilidad} PedidoDisponibilidad */
/**@typedef {import('../types').PedidoEstado} PedidoEstado */
/**@typedef {import('../types').PedidoDisponibilidadDia} PedidoDisponibilidadDia */
/**@typedef {import('../types').UsuarioRol} UsuarioRol */
/**@typedef {import('../types').Factura} Factura */
/**@typedef {import('../types').FacturaMetodoPago} FacturaMetodoPago */

// --- ÁREAS ---
/**
 * Obtener todas las áreas
 * @returns {Promise<Area[]>}
 */
export const getAreas = () => fetch(`${API_URL}/areas`).then((r) => r.json());

/**
 * Obtener un área por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Area>}
 */
export const getArea = (id, token) =>
  fetch(`${API_URL}/areas/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Crear un área
 * @param {Partial<Area>} data
 * @param {string} token
 * @returns {Promise<Area>}
 */
export const createArea = (data, token) =>
  fetch(`${API_URL}/areas`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar un área
 * @param {number} id
 * @param {Partial<Area>} data
 * @param {string} token
 * @returns {Promise<Area>}
 */
export const updateArea = (id, data, token) =>
  fetch(`${API_URL}/areas/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar un área
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deleteArea = (id, token) =>
  fetch(`${API_URL}/areas/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- AUTH ---
/**
 * Login de usuario
 * @param {{email: string, password: string}} data
 * @returns {Promise<{token: string, user: import('../types').UsuarioCompleto}>}
 */
export const login = (data) =>
  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Registro de usuario
 * @param {{email: string, password: string, rol: string}} data
 * @returns {Promise<Usuario & { token: string}>}
 */
export const register = (data) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

// --- CLIENTES ---
/**
 * Obtener todos los clientes
 * @param {string} token
 * @returns {Promise<Cliente[]>}
 */
export const getClientes = (token) =>
  fetch(`${API_URL}/clientes`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Obtener un cliente por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Cliente>}
 */
export const getCliente = (id, token) =>
  fetch(`${API_URL}/clientes/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Crear un cliente
 * @param {Partial<Cliente>} data
 * @param {string} token
 * @returns {Promise<Cliente>}
 */
export const createCliente = (data, token) =>
  fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar un cliente
 * @param {number} id
 * @param {Partial<Cliente>} data
 * @param {string} token
 * @returns {Promise<Cliente>}
 */
export const updateCliente = (id, data, token) =>
  fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar un cliente
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deleteCliente = (id, token) =>
  fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- FACTURAS ---
/**
 * Obtener todas las facturas
 * @param {string} token
 * @returns {Promise<Factura[]>}
 */
export const getFacturas = (token) =>
  fetch(`${API_URL}/facturas`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Obtener una factura por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Factura>}
 */
export const getFactura = (id, token) =>
  fetch(`${API_URL}/facturas/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Crear una factura
 * @param {Partial<Factura>} data
 * @param {string} token
 * @returns {Promise<Factura>}
 */
export const createFactura = (data, token) =>
  fetch(`${API_URL}/facturas`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar una factura
 * @param {number} id
 * @param {Partial<Factura>} data
 * @param {string} token
 * @returns {Promise<Factura>}
 */
export const updateFactura = (id, data, token) =>
  fetch(`${API_URL}/facturas/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar una factura
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deleteFactura = (id, token) =>
  fetch(`${API_URL}/facturas/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- PEDIDOS ---
/**
 * Obtener todos los pedidos
 * @param {string} token
 * @param {Object} [searchParams] - Parámetros de búsqueda opcionales
 * @returns {Promise<Pedido[]>}
 */
export const getPedidos = (token, searchParams) => {
  let url = `${API_URL}/pedidos`;
  if (searchParams && Object.keys(searchParams).length > 0) {
    const params = new URLSearchParams(searchParams);
    url += `?${params.toString()}`;
  }
  return fetch(url, { headers: getHeaders(token) }).then((r) => r.json());
};
/**
 * Obtener un pedido por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Pedido>}
 */
export const getPedido = (id, token) =>
  fetch(`${API_URL}/pedidos/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Crear un pedido
 * @param {Partial<Pedido>} data
 * @param {string} token
 * @returns {Promise<Pedido>}
 */
export const createPedido = (data, token) =>
  fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar un pedido
 * @param {number} id
 * @param {Partial<Pedido>} data
 * @param {string} token
 * @returns {Promise<Pedido>}
 */
export const updatePedido = (id, data, token) =>
  fetch(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar un pedido
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deletePedido = (id, token) =>
  fetch(`${API_URL}/pedidos/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- PEDIDO CANDIDATOS ---
/**
 * Obtener todos los candidatos de pedidos
 * @param {string} token
 * @returns {Promise<PedidoCandidato[]>}
 */
export const getPedidoCandidatos = (token) =>
  fetch(`${API_URL}/pedido-candidatos`, { headers: getHeaders(token) }).then(
    (r) => r.json()
  );

/**
 * Obtener un candidato de pedido por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<PedidoCandidato>}
 */
export const getPedidoCandidato = (id, token) =>
  fetch(`${API_URL}/pedido-candidatos/${id}`, {
    headers: getHeaders(token),
  }).then((r) => r.json());

/**
 * Crear un candidato de pedido
 * @param {Partial<PedidoCandidato>} data
 * @param {string} token
 * @returns {Promise<PedidoCandidato>}
 */
export const createPedidoCandidato = (data, token) =>
  fetch(`${API_URL}/pedido-candidatos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar un candidato de pedido
 * @param {number} id
 * @param {Partial<PedidoCandidato>} data
 * @param {string} token
 * @returns {Promise<PedidoCandidato>}
 */
export const updatePedidoCandidato = (id, data, token) =>
  fetch(`${API_URL}/pedido-candidatos/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar un candidato de pedido
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deletePedidoCandidato = (id, token) =>
  fetch(`${API_URL}/pedido-candidatos/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- PEDIDO DISPONIBILIDAD ---
/**
 * Obtener todas las disponibilidades de pedidos
 * @param {string} token
 * @returns {Promise<PedidoDisponibilidad[]>}
 */
export const getPedidoDisponibilidad = (token) =>
  fetch(`${API_URL}/pedido-disponibilidad`, {
    headers: getHeaders(token),
  }).then((r) => r.json());

/**
 * Obtener una disponibilidad de pedido por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<PedidoDisponibilidad>}
 */
export const getPedidoDisponibilidadById = (id, token) =>
  fetch(`${API_URL}/pedido-disponibilidad/${id}`, {
    headers: getHeaders(token),
  }).then((r) => r.json());

/**
 * Crear una disponibilidad de pedido
 * @param {PedidoDisponibilidad} data
 * @param {string} token
 * @returns {Promise<PedidoDisponibilidad>}
 */
export const createPedidoDisponibilidad = (data, token) =>
  fetch(`${API_URL}/pedido-disponibilidad`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar una disponibilidad de pedido
 * @param {number} id
 * @param {Partial<PedidoDisponibilidad>} data
 * @param {string} token
 * @returns {Promise<PedidoDisponibilidad>}
 */
export const updatePedidoDisponibilidad = (id, data, token) =>
  fetch(`${API_URL}/pedido-disponibilidad/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar una disponibilidad de pedido
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deletePedidoDisponibilidad = (id, token) =>
  fetch(`${API_URL}/pedido-disponibilidad/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- TÉCNICOS ---
/**
 * Obtener todos los técnicos
 * @param {string} token
 * @returns {Promise<Tecnico[]>}
 */
export const getTecnicos = (token) =>
  fetch(`${API_URL}/tecnicos`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Obtener un técnico por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<TecnicoCompleto>}
 */
export const getTecnico = (id, token) =>
  fetch(`${API_URL}/tecnicos/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Crear un técnico
 * @param {Partial<Tecnico>} data
 * @param {string} token
 * @returns {Promise<Tecnico>}
 */
export const createTecnico = (data, token) =>
  fetch(`${API_URL}/tecnicos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar un técnico
 * @param {number} id
 * @param {Partial<Tecnico>} data
 * @param {string} token
 * @returns {Promise<Tecnico>}
 */
export const updateTecnico = (id, data, token) =>
  fetch(`${API_URL}/tecnicos/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar un técnico
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deleteTecnico = (id, token) =>
  fetch(`${API_URL}/tecnicos/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- TECNICO AREAS ---
/**
 * Obtener todas las áreas asignadas a técnicos
 * @param {string} token
 * @returns {Promise<TecnicoArea[]>}
 */
export const getTecnicoAreas = (token) =>
  fetch(`${API_URL}/tecnico-areas`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Obtener una asignación de área por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<TecnicoArea>}
 */
export const getTecnicoArea = (id, token) =>
  fetch(`${API_URL}/tecnico-areas/${id}`, { headers: getHeaders(token) }).then(
    (r) => r.json()
  );

/**
 * Asignar un área a un técnico
 * @param {Partial<TecnicoArea>} data
 * @param {string} token
 * @returns {Promise<TecnicoArea>}
 */
export const createTecnicoArea = (data, token) =>
  fetch(`${API_URL}/tecnico-areas`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar una asignación de área
 * @param {number} id
 * @param {Partial<TecnicoArea>} data
 * @param {string} token
 * @returns {Promise<TecnicoArea>}
 */
export const updateTecnicoArea = (id, data, token) =>
  fetch(`${API_URL}/tecnico-areas/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar una asignación de área
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deleteTecnicoArea = (id, token) =>
  fetch(`${API_URL}/tecnico-areas/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- USUARIOS ---
/**
 * Obtener todos los usuarios
 * @param {string} token
 * @returns {Promise<Usuario[]>}
 */
export const getUsuarios = (token) =>
  fetch(`${API_URL}/usuarios`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Obtener un usuario por ID
 * @param {number} id
 * @param {string} token
 * @returns {Promise<Usuario>}
 */
export const getUsuario = (id, token) =>
  fetch(`${API_URL}/usuarios/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

/**
 * Crear un usuario
 * @param {Partial<Usuario>} data
 * @param {string} token
 * @returns {Promise<Usuario & { token: string}>}
 *
 */
export const createUsuario = (data, token) =>
  fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Actualizar un usuario
 * @param {number} id
 * @param {Partial<Usuario>} data
 * @param {string} token
 * @returns {Promise<Usuario>}
 */
export const updateUsuario = (id, data, token) =>
  fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/**
 * Eliminar un usuario
 * @param {number} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export const deleteUsuario = (id, token) =>
  fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());
