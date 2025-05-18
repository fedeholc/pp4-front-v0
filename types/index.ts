import { z } from 'zod';
import { ClienteSchema, AreaSchema, UsuarioSchema, TecnicoSchema, PedidoSchema, PedidoCandidatosSchema, PedidoDisponibilidadSchema, PedidoEstadoEnum, PedidoDisponibilidadDiaEnum, TecnicoAreaSchema, UsuarioRolEnum, FacturaSchema, FacturaMetodoPagoEnum, UsuarioCompletoSchema, PedidoCompletoSchema } from './schemas';
export type Cliente = z.infer<typeof ClienteSchema>;
export type Area = z.infer<typeof AreaSchema>;
export type Usuario = z.infer<typeof UsuarioSchema>;
export type Tecnico = z.infer<typeof TecnicoSchema>;
export type TecnicoArea = z.infer<typeof TecnicoAreaSchema>;
export type Pedido = z.infer<typeof PedidoSchema>;
export type PedidoCandidatos = z.infer<typeof PedidoCandidatosSchema>;
export type PedidoDisponibilidad = z.infer<typeof PedidoDisponibilidadSchema>;
export type PedidoEstado = z.infer<typeof PedidoEstadoEnum>;
export type PedidoDisponibilidadDia = z.infer<typeof PedidoDisponibilidadDiaEnum>;
export type UsuarioRol = z.infer<typeof UsuarioRolEnum>;
export type Factura = z.infer<typeof FacturaSchema>;
export type FacturaMetodoPago = z.infer<typeof FacturaMetodoPagoEnum>;
export type UsuarioCompleto = z.infer<typeof UsuarioCompletoSchema>;
export type PedidoCompleto = z.infer<typeof PedidoCompletoSchema>;


export type TecnicoConAreas = Tecnico & {
  areas: Area[] | null;
};

export type PedidoConCliente = Pedido & {
  cliente: Cliente | null;
};

export type UpdateResult = { affectedRows: number } | null;
export type DeleteResult = { affectedRows: number } | null;

