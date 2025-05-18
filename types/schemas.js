import { z } from "zod";

// Cliente
export const ClienteSchema = z.object({
  id: z.number().nullable(),
  usuarioId: z.number().nullable(),
  nombre: z.string().nullable(),
  apellido: z.string().nullable(),
  telefono: z.string().nullable(),
  direccion: z.string().nullable(),
  fechaRegistro: z.coerce.date().nullable(), // Cambiado a z.coerce.date()
});

// Area
export const AreaSchema = z.object({
  id: z.number().nullable(),
  nombre: z.string().nullable(),
  descripcion: z.string().nullable(),
});

export const UsuarioRolEnum = z.enum(["cliente", "tecnico", "admin"]);
// Usuario
export const UsuarioSchema = z.object({
  id: z.number().nullable(),
  email: z.string().nullable(),
  password: z.string().nullable().optional(),
  rol: UsuarioRolEnum.nullable(),
});

// Tecnico
export const TecnicoSchema = z.object({
  id: z.number().nullable(),
  usuarioId: z.number().nullable(),
  nombre: z.string().nullable(),
  apellido: z.string().nullable(),
  telefono: z.string().nullable(),
  direccion: z.string().nullable(),
  caracteristicas: z.string().nullable(),
  fechaRegistro: z.coerce.date().nullable(),
});

// TecnicoArea
export const TecnicoAreaSchema = z.object({
  id: z.number().nullable(),
  tecnicoId: z.number().nullable(),
  areaId: z.number().nullable(),
});

// PedidoEstado
export const PedidoEstadoEnum = z.enum([
  "sin_candidatos",
  "con_candidatos",
  "tecnico_seleccionado",
  "cancelado",
  "finalizado",
  "calificado",
]);

// Pedido
export const PedidoSchema = z.object({
  id: z.number().nullable(),
  clienteId: z.number().nullable(),
  tecnicoId: z.number().nullable(),
  estado: PedidoEstadoEnum.nullable(),
  areaId: z.number().nullable(),
  requerimiento: z.string().nullable(),
  calificacion: z.number().nullable(),
  comentario: z.string().nullable(),
  respuesta: z.string().nullable(),
  fechaCreacion: z.coerce.date().nullable(),
  fechaCierre: z.coerce.date().nullable(),
  fechaCancelado: z.coerce.date().nullable(),
});

// PedidoDisponibilidadDia
export const PedidoDisponibilidadDiaEnum = z.enum([
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
]);

// PedidoDisponibilidad
export const PedidoDisponibilidadSchema = z.object({
  id: z.number().nullable(),
  pedidoId: z.number().nullable(),
  clienteId: z.number().nullable(),
  dia: PedidoDisponibilidadDiaEnum.nullable(),
  horaInicio: z.string().nullable(),
  horaFin: z.string().nullable(),
});

// PedidoCandidatos
export const PedidoCandidatosSchema = z.object({
  id: z.number().nullable(),
  pedidoId: z.number().nullable(),
  tecnicoId: z.number().nullable(),
});

// FacturaMetodoPago
export const FacturaMetodoPagoEnum = z.enum(["tarjeta", "transferencia"]);

// Factura
export const FacturaSchema = z.object({
  id: z.number().nullable(),
  usuarioId: z.number().nullable(),
  fecha: z.coerce.date().nullable(),
  descripcion: z.string().nullable(),
  total: z.number().nullable(),
  metodoPago: FacturaMetodoPagoEnum.nullable(),
});

export const UsuarioCompletoSchema = UsuarioSchema.extend({
  cliente: ClienteSchema.optional().nullable(),
  tecnico: TecnicoSchema.optional().nullable(),
});

export const PedidoCompletoSchema = PedidoSchema.extend({
  cliente: ClienteSchema.optional().nullable(),
  tecnico: TecnicoSchema.optional().nullable(),
  area: AreaSchema.optional().nullable(),
  disponibilidad: z.array(PedidoDisponibilidadSchema).optional().nullable(),
  candidatos: z.array(PedidoCandidatosSchema).optional().nullable(),
});