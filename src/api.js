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

/**
 * @typedef {Object} Area
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 */

/**
 * @typedef {Object} Cliente
 * @property {number} id
 * @property {number} usuarioId
 * @property {string} nombre
 * @property {string} apellido
 * @property {string} telefono
 * @property {string} direccion
 * @property {string} fechaRegistro
 */

/**
 * @typedef {Object} Factura
 * @property {number} id
 * @property {number} usuarioId
 * @property {string} fecha
 * @property {string} descripcion
 * @property {number} total
 * @property {string} metodoPago
 */

/**
 * @typedef {Object} Pedido
 * @property {number} id
 * @property {number} clienteId
 * @property {number} tecnicoId
 * @property {string} estado
 * @property {number} areaId
 * @property {string} requerimiento
 * @property {number} calificacion
 * @property {string} comentario
 * @property {string} respuesta
 * @property {string} fechaCreacion
 * @property {string} fechaCierre
 * @property {string} fechaCancelado
 */

/**
 * @typedef {Object} Tecnico
 * @property {number} id
 * @property {number} usuarioId
 * @property {string} nombre
 * @property {string} apellido
 * @property {string} telefono
 * @property {string} direccion
 * @property {string} caracteristicas
 * @property {string} fechaRegistro
 */

/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} rol
 */

// --- ÁREAS ---
/**
 * Obtener todas las áreas
 * @param {string} token
 * @returns {Promise<Area[]>}
 */
export const getAreas = (token) =>
  fetch(`${API_URL}/areas`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

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
 * @returns {Promise<{token: string, user: Usuario}>}
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
 * @returns {Promise<Usuario>}
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
export const getPedidos = (token) =>
  fetch(`${API_URL}/pedidos`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const getPedido = (id, token) =>
  fetch(`${API_URL}/pedidos/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const createPedido = (data, token) =>
  fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updatePedido = (id, data, token) =>
  fetch(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deletePedido = (id, token) =>
  fetch(`${API_URL}/pedidos/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- PEDIDO CANDIDATOS ---
export const getPedidoCandidatos = (token) =>
  fetch(`${API_URL}/pedido-candidatos`, { headers: getHeaders(token) }).then(
    (r) => r.json()
  );

export const getPedidoCandidato = (id, token) =>
  fetch(`${API_URL}/pedido-candidatos/${id}`, {
    headers: getHeaders(token),
  }).then((r) => r.json());

export const createPedidoCandidato = (data, token) =>
  fetch(`${API_URL}/pedido-candidatos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updatePedidoCandidato = (id, data, token) =>
  fetch(`${API_URL}/pedido-candidatos/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deletePedidoCandidato = (id, token) =>
  fetch(`${API_URL}/pedido-candidatos/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- PEDIDO DISPONIBILIDAD ---
export const getPedidoDisponibilidad = (token) =>
  fetch(`${API_URL}/pedido-disponibilidad`, {
    headers: getHeaders(token),
  }).then((r) => r.json());

export const getPedidoDisponibilidadById = (id, token) =>
  fetch(`${API_URL}/pedido-disponibilidad/${id}`, {
    headers: getHeaders(token),
  }).then((r) => r.json());

export const createPedidoDisponibilidad = (data, token) =>
  fetch(`${API_URL}/pedido-disponibilidad`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updatePedidoDisponibilidad = (id, data, token) =>
  fetch(`${API_URL}/pedido-disponibilidad/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deletePedidoDisponibilidad = (id, token) =>
  fetch(`${API_URL}/pedido-disponibilidad/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- TÉCNICOS ---
export const getTecnicos = (token) =>
  fetch(`${API_URL}/tecnicos`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const getTecnico = (id, token) =>
  fetch(`${API_URL}/tecnicos/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const createTecnico = (data, token) =>
  fetch(`${API_URL}/tecnicos`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateTecnico = (id, data, token) =>
  fetch(`${API_URL}/tecnicos/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteTecnico = (id, token) =>
  fetch(`${API_URL}/tecnicos/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- TECNICO AREAS ---
export const getTecnicoAreas = (token) =>
  fetch(`${API_URL}/tecnico-areas`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const getTecnicoArea = (id, token) =>
  fetch(`${API_URL}/tecnico-areas/${id}`, { headers: getHeaders(token) }).then(
    (r) => r.json()
  );

export const createTecnicoArea = (data, token) =>
  fetch(`${API_URL}/tecnico-areas`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateTecnicoArea = (id, data, token) =>
  fetch(`${API_URL}/tecnico-areas/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteTecnicoArea = (id, token) =>
  fetch(`${API_URL}/tecnico-areas/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());

// --- USUARIOS ---
export const getUsuarios = (token) =>
  fetch(`${API_URL}/usuarios`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const getUsuario = (id, token) =>
  fetch(`${API_URL}/usuarios/${id}`, { headers: getHeaders(token) }).then((r) =>
    r.json()
  );

export const createUsuario = (data, token) =>
  fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateUsuario = (id, data, token) =>
  fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteUsuario = (id, token) =>
  fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());
