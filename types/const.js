import { PedidoEstadoEnum } from "./schemas";

export const PEDIDO_ESTADOS_TEXTO = {
  [PedidoEstadoEnum.Enum.calificado]: "Calificado",
  [PedidoEstadoEnum.Enum.cancelado]: "Cancelado",
  [PedidoEstadoEnum.Enum.con_candidatos]: "Con candidatos",
  [PedidoEstadoEnum.Enum.tecnico_seleccionado]: "Técnico seleccionado",
  [PedidoEstadoEnum.Enum.sin_candidatos]: "Sin candidatos",
  [PedidoEstadoEnum.Enum.finalizado]: "Finalizado",
};
