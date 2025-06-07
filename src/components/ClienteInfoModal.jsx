import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider,
  Box,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
} from "@mui/icons-material";

/**
 * Modal para mostrar información detallada del cliente
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {import("../../types").Cliente} props.cliente
 * @param {string} props.clienteEmail - Email del cliente obtenido del usuario
 */
export function ClienteInfoModal({ open, onClose, cliente, clienteEmail }) {
  if (!cliente) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Person color="primary" />
          <Typography variant="h6">Información del Cliente</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Nombre completo */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Nombre completo
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {cliente.apellido}, {cliente.nombre}
            </Typography>
          </Box>

          <Divider />

          {/* Email */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Email color="action" fontSize="small" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {clienteEmail || "No disponible"}
              </Typography>
            </Box>
          </Stack>

          {/* Teléfono */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Phone color="action" fontSize="small" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Teléfono
              </Typography>
              <Typography variant="body1">
                {cliente.telefono || "No disponible"}
              </Typography>
            </Box>
          </Stack>

          {/* Dirección */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocationOn color="action" fontSize="small" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Dirección
              </Typography>
              <Typography variant="body1">
                {cliente.direccion || "No disponible"}
              </Typography>
            </Box>
          </Stack>

          {/* Fecha de registro */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <CalendarToday color="action" fontSize="small" />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Cliente desde
              </Typography>
              <Typography variant="body1">
                {cliente.fechaRegistro
                  ? new Date(cliente.fechaRegistro).toLocaleDateString()
                  : "No disponible"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
