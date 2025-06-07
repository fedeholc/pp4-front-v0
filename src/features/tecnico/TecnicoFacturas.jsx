import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";
import * as api from "../../api";
import { formatCurrencyUSD } from "../../utils/utils";
import {
  CreditCard,
  AccountBalance,
  CheckCircle,
  Receipt,
} from "@mui/icons-material";

const MEMBERSHIP_FEE = 10;  

export function TecnicoFacturas() {
  const { token, user } = useContext(UserContext);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  /**@type {[import("../../../types").FacturaMetodoPago, React.Dispatch<React.SetStateAction<import("../../../types").FacturaMetodoPago>>]} */
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [processing, setProcessing] = useState(false);
  const [isCreatingNewInvoice, setIsCreatingNewInvoice] = useState(false);

  useEffect(() => {
    loadFacturas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadFacturas = async () => {
    setLoading(true);
    setError("");

    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    try {
      const data = await api.getFacturas(token);
      // Filter only the current technician's invoices
      const tecnicoFacturas = data.filter((f) => f.usuarioId === user.id);
      setFacturas(tecnicoFacturas);
    } catch (err) {
      setError("Error al cargar las facturas. Inténtalo más tarde.");
      console.error("Error loading facturas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (factura) => {
    setSelectedFactura(factura);
    setPaymentDialog(true);
    setPaymentMethod("tarjeta");
  };

  const processPayment = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      if (isCreatingNewInvoice) {
        // Creating new invoice flow - create invoice with payment data
        console.log("Creating new paid invoice");

        /**@type {import("../../../types").Factura} */
        const newFactura = {
          usuarioId: user.id,
          fecha: new Date(),
          descripcion: "Cuota de membresía mensual",
          total: MEMBERSHIP_FEE,
          metodoPago: paymentMethod,
        };

        console.log("Creating new factura with payment:", newFactura);
        await api.createFactura(newFactura, token);

        setSuccess("¡Factura creada y pago procesado exitosamente!");
      } else {
        // Existing invoice payment flow
        if (!selectedFactura) {
          console.error("No selected factura");
          return;
        }

        console.log(
          "Processing payment for existing factura:",
          selectedFactura.id
        );

        const updatedFactura = {
          ...selectedFactura,
          metodoPago: paymentMethod,
          fecha: new Date().toISOString(),
        };

        console.log("Updating factura with:", updatedFactura);
        const result = await api.updateFactura(
          selectedFactura.id,
          updatedFactura,
          token
        );
        console.log("Update result:", result);

        setSuccess("¡Pago procesado exitosamente!");
      }

      // Refresh facturas list
      console.log("Refreshing facturas list...");
      await loadFacturas();

      setPaymentDialog(false);
      setSelectedFactura(null);
      setIsCreatingNewInvoice(false);
      console.log("Payment process completed successfully");
    } catch (err) {
      setError("Error al procesar el pago. Inténtalo nuevamente.");
      console.error("Payment error:", err);
      console.error("Error details:", err.message, err.stack);
    } finally {
      setProcessing(false);
    }
  };

  const createNewInvoice = async () => {
    setError("");
    setSuccess("");

    // Don't create the invoice yet, just open the payment dialog
    console.log("Opening payment dialog for new invoice");
    setIsCreatingNewInvoice(true);
    setSelectedFactura(null); // No existing invoice
    setPaymentDialog(true);
    setPaymentMethod("tarjeta");
  };

  const getStatusChip = (factura) => {
    const isPaid = factura.metodoPago && factura.fecha;
    return (
      <Chip
        icon={isPaid ? <CheckCircle /> : <Receipt />}
        label={isPaid ? "Pagada" : "Pendiente"}
        color={isPaid ? "success" : "warning"}
        variant={isPaid ? "filled" : "outlined"}
      />
    );
  };

  const formatDate = (date) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Mis Facturas
        </Typography>
        <Divider />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <Typography variant="body1" color="text.secondary">
            Cuota de membresía: {formatCurrencyUSD(MEMBERSHIP_FEE)} mensual
          </Typography>
          <Button
            variant="outlined"
            onClick={createNewInvoice}
            disabled={loading}
            startIcon={<Receipt />}
          >
            Nueva Factura
          </Button>
        </Stack>

        <Box padding={2}>
          {loading && !error && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={4}
            >
              <CircularProgress />
              <Typography ml={2}>Cargando facturas...</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {!loading && facturas.length === 0 && (
            <Alert severity="info">
              No tienes facturas aún. Crea tu primera factura de membresía.
            </Alert>
          )}

          <Stack spacing={2}>
            {facturas.map((factura) => {
              const isPaid = factura.metodoPago && factura.fecha;
              return (
                <Card key={factura.id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Typography variant="h6" component="h2">
                        Factura #{factura.id}
                      </Typography>
                      {getStatusChip(factura)}
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {factura.descripcion}
                    </Typography>

                    <Stack direction="row" spacing={4} mt={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Monto
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrencyUSD(factura.total)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Fecha de pago
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(factura.fecha)}
                        </Typography>
                      </Box>

                      {isPaid && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Método de pago
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            {factura.metodoPago === "tarjeta" ? (
                              <CreditCard fontSize="small" />
                            ) : (
                              <AccountBalance fontSize="small" />
                            )}
                            <Typography variant="body1">
                              {factura.metodoPago === "tarjeta"
                                ? "Tarjeta"
                                : "Transferencia"}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>

                  {!isPaid && (
                    <CardActions>
                      <Button
                        variant="contained"
                        onClick={() => handlePayment(factura)}
                        startIcon={<CreditCard />}
                      >
                        Pagar ahora
                      </Button>
                    </CardActions>
                  )}
                </Card>
              );
            })}
          </Stack>
        </Box>

        {/* Payment Dialog */}
        <Dialog
          open={paymentDialog}
          onClose={() => {
            if (!processing) {
              setPaymentDialog(false);
              setSelectedFactura(null);
              setIsCreatingNewInvoice(false);
            }
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isCreatingNewInvoice
              ? "Procesar Pago - Nueva Factura"
              : `Procesar Pago - Factura #${selectedFactura?.id}`}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} pt={1}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Descripción:</strong>{" "}
                  {isCreatingNewInvoice
                    ? "Cuota de membresía mensual"
                    : selectedFactura?.descripcion ||
                      "Cuota de membresía mensual"}
                </Typography>
                <Typography variant="h5" color="primary">
                  <strong>
                    Total a pagar:{" "}
                    {formatCurrencyUSD(
                      isCreatingNewInvoice
                        ? MEMBERSHIP_FEE
                        : selectedFactura?.total || MEMBERSHIP_FEE
                    )}
                  </strong>
                </Typography>
              </Box>

              <Box>
                <Typography variant="body1" gutterBottom>
                  Selecciona el método de pago:
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={paymentMethod}
                    // @ts-ignore
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="tarjeta"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CreditCard />
                          <span>Tarjeta de crédito/débito</span>
                        </Stack>
                      }
                    />
                    <FormControlLabel
                      value="transferencia"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccountBalance />
                          <span>Transferencia bancaria</span>
                        </Stack>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Alert severity="info">
                Esta es una simulación de pasarela de pago. El pago se marcará
                como procesado automáticamente.
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setPaymentDialog(false);
                setSelectedFactura(null);
                setIsCreatingNewInvoice(false);
              }}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={processPayment}
              disabled={processing}
              startIcon={
                processing ? <CircularProgress size={20} /> : <CheckCircle />
              }
            >
              {processing ? "Procesando..." : "Confirmar Pago"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
