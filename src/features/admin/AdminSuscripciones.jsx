import { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { Receipt } from "@mui/icons-material";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";
import { getTecnicos, getFacturas } from "../../api";

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function AdminSuscripciones() {
  const { token } = useContext(UserContext) || {};
  const [tecnicos, setTecnicos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [tecnicosData, facturasData] = await Promise.all([
          getTecnicos(token),
          getFacturas(token),
        ]);
        setTecnicos(tecnicosData);
        setFacturas(facturasData);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  // Filtrar facturas pagas por técnico
  function getFacturasPagas(tecnico) {
    if (!tecnico || !facturas) return [];
    return facturas
      .filter(
        (f) => f.usuarioId === tecnico.usuarioId && f.fecha && f.total > 0
      )
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
  }

  function handleOpenDialog(tecnico) {
    setSelectedTecnico(tecnico);
    setOpenDialog(true);
  }
  function handleCloseDialog() {
    setOpenDialog(false);
    setSelectedTecnico(null);
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Administración de Suscripciones
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Última factura paga</TableCell>
                  <TableCell align="right">Detalle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tecnicos.map((tecnico) => {
                  const facturasPagas = getFacturasPagas(tecnico);
                  const ultimaFactura = facturasPagas[0];
                  return (
                    <TableRow key={tecnico.id}>
                      <TableCell>{tecnico.nombre}</TableCell>
                      <TableCell>{tecnico.apellido}</TableCell>
                      <TableCell>{tecnico.email}</TableCell>
                      <TableCell>
                        {ultimaFactura ? formatDate(ultimaFactura.fecha) : "-"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenDialog(tecnico)}>
                          <Receipt />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {tecnicos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay técnicos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Dialogo de detalle de facturas pagas */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Facturas pagas de {selectedTecnico?.nombre}{" "}
            {selectedTecnico?.apellido}
          </DialogTitle>
          <DialogContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Método de pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFacturasPagas(selectedTecnico).map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{formatDate(f.fecha)}</TableCell>
                    <TableCell>{f.descripcion}</TableCell>
                    <TableCell>{f.total}</TableCell>
                    <TableCell>{f.metodoPago}</TableCell>
                  </TableRow>
                ))}
                {getFacturasPagas(selectedTecnico).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay facturas pagas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
