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
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { Receipt } from "@mui/icons-material";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";
import { getTecnicos, getFacturas, getUsuarios } from "../../api";

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
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nombre");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [tecnicosData, facturasData, usuariosData] = await Promise.all([
          getTecnicos(token),
          getFacturas(token),
          getUsuarios(token),
        ]);
        setTecnicos(tecnicosData);
        setFacturas(facturasData);
        setUsuarios(usuariosData);
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

  // Ordenar técnicos
  function stableSort(array, comparator) {
    const stabilized = array.map((el, idx) => [el, idx]);
    stabilized.sort((a, b) => {
      const cmp = comparator(a[0], b[0]);
      if (cmp !== 0) return cmp;
      return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
  }
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function descendingComparator(a, b, orderBy) {
    // Para columna email, buscar el usuario correspondiente
    if (orderBy === "email") {
      const usuarioA = usuarios.find((u) => u.id === a.usuarioId);
      const usuarioB = usuarios.find((u) => u.id === b.usuarioId);
      const emailA = usuarioA?.email || "";
      const emailB = usuarioB?.email || "";
      if (emailB < emailA) return -1;
      if (emailB > emailA) return 1;
      return 0;
    }
    // Para columna ultimaFactura, comparar fecha
    if (orderBy === "ultimaFactura") {
      const fa = getFacturasPagas(a)[0]?.fecha || "";
      const fb = getFacturasPagas(b)[0]?.fecha || "";
      if (fb < fa) return -1;
      if (fb > fa) return 1;
      return 0;
    }
    // Por defecto comparar string o número
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                  <TableCell
                    sortDirection={
                      orderBy === "nombre"
                        ? order === "desc"
                          ? "desc"
                          : "asc"
                        : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "nombre"}
                      direction={
                        orderBy === "nombre" && order === "desc"
                          ? "desc"
                          : "asc"
                      }
                      onClick={(e) => handleRequestSort(e, "nombre")}
                    >
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      orderBy === "apellido"
                        ? order === "desc"
                          ? "desc"
                          : "asc"
                        : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "apellido"}
                      direction={
                        orderBy === "apellido" && order === "desc"
                          ? "desc"
                          : "asc"
                      }
                      onClick={(e) => handleRequestSort(e, "apellido")}
                    >
                      Apellido
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      orderBy === "email"
                        ? order === "desc"
                          ? "desc"
                          : "asc"
                        : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "email"}
                      direction={
                        orderBy === "email" && order === "desc" ? "desc" : "asc"
                      }
                      onClick={(e) => handleRequestSort(e, "email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      orderBy === "ultimaFactura"
                        ? order === "desc"
                          ? "desc"
                          : "asc"
                        : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "ultimaFactura"}
                      direction={
                        orderBy === "ultimaFactura" && order === "desc"
                          ? "desc"
                          : "asc"
                      }
                      onClick={(e) => handleRequestSort(e, "ultimaFactura")}
                    >
                      Última factura paga
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(tecnicos, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tecnico) => {
                    const facturasPagas = getFacturasPagas(tecnico);
                    const ultimaFactura = facturasPagas[0];
                    const usuario = usuarios.find(
                      (u) => u.id === tecnico.usuarioId
                    );
                    return (
                      <TableRow key={tecnico.id}>
                        <TableCell>{tecnico.nombre}</TableCell>
                        <TableCell>{tecnico.apellido}</TableCell>
                        <TableCell>{usuario?.email || "-"}</TableCell>
                        <TableCell>
                          {ultimaFactura
                            ? formatDate(ultimaFactura.fecha)
                            : "-"}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            startIcon={<Receipt />}
                            size="small"
                            onClick={() => handleOpenDialog(tecnico)}
                          >
                            Ver&nbsp;facturas
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            SUSPENDER
                          </Button>
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tecnicos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
            />
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
