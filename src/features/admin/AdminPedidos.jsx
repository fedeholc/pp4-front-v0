import { useContext, useEffect, useState } from "react";
import {
  Container,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";
import {
  getPedidos,
  updatePedido,
  deletePedido,
  getClientes,
  getTecnicos,
  getAreas,
} from "../../api";
import { PedidoEstadoEnum } from "../../../types/schemas";

const estados = PedidoEstadoEnum.options;
function getEstadoValido(valor) {
  return estados.includes(valor) ? valor : "sin_candidatos";
}

export function AdminPedidos() {
  const { token } = useContext(UserContext) || {};
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPedido, setEditPedido] = useState(null);
  const [form, setForm] = useState({
    clienteId: "",
    tecnicoId: "",
    areaId: "",
    estado: "sin_candidatos",
    requerimiento: "",
    calificacion: "",
    comentario: "",
    respuesta: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pedidosData, clientesData, tecnicosData, areasData] =
        await Promise.all([
          getPedidos(token),
          getClientes(token),
          getTecnicos(token),
          getAreas(),
        ]);
      setPedidos(pedidosData);
      setClientes(clientesData);
      setTecnicos(tecnicosData);
      setAreas(areasData);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al cargar pedidos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [token]);

  const handleOpenDialog = (pedido = null) => {
    setEditPedido(pedido);
    setForm(
      pedido
        ? {
            clienteId: pedido.clienteId || "",
            tecnicoId: pedido.tecnicoId || "",
            areaId: pedido.areaId || "",
            estado: pedido.estado || "sin_candidatos",
            requerimiento: pedido.requerimiento || "",
            calificacion: pedido.calificacion || "",
            comentario: pedido.comentario || "",
            respuesta: pedido.respuesta || "",
          }
        : {
            clienteId: "",
            tecnicoId: "",
            areaId: "",
            estado: "sin_candidatos",
            requerimiento: "",
            calificacion: "",
            comentario: "",
            respuesta: "",
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditPedido(null);
    setForm({
      clienteId: "",
      tecnicoId: "",
      areaId: "",
      estado: "sin_candidatos",
      requerimiento: "",
      calificacion: "",
      comentario: "",
      respuesta: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const estadoValido = getEstadoValido(form.estado);
      await updatePedido(
        editPedido.id,
        {
          ...form,
          estado: estadoValido,
          clienteId: form.clienteId ? Number(form.clienteId) : null,
          tecnicoId: form.tecnicoId ? Number(form.tecnicoId) : null,
          areaId: form.areaId ? Number(form.areaId) : null,
          calificacion: form.calificacion ? Number(form.calificacion) : null,
        },
        token
      );
      setSnackbar({
        open: true,
        message: "Pedido actualizado",
        severity: "success",
      });
      handleCloseDialog();
      fetchAll();
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar pedido",
        severity: "error",
      });
    }
  };

  const handleDelete = async (pedido) => {
    if (!window.confirm("¿Eliminar pedido?")) return;
    try {
      await deletePedido(pedido.id, token);
      setSnackbar({
        open: true,
        message: "Pedido eliminado",
        severity: "success",
      });
      fetchAll();
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar pedido",
        severity: "error",
      });
    }
  };

  // Filtrado de pedidos
  const filteredPedidos = pedidos.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.id && String(p.id).includes(q)) ||
      (p.estado && p.estado.toLowerCase().includes(q)) ||
      (p.requerimiento && p.requerimiento.toLowerCase().includes(q))
    );
  });

  // Ordenar pedidos
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
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Administración de Pedidos
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          label="Buscar pedido"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ mb: 2, ml: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sortDirection={
                    orderBy === "id"
                      ? order === "desc"
                        ? "desc"
                        : "asc"
                      : false
                  }
                >
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={
                      orderBy === "id" && order === "desc" ? "desc" : "asc"
                    }
                    onClick={(e) => handleRequestSort(e, "id")}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={
                    orderBy === "estado"
                      ? order === "desc"
                        ? "desc"
                        : "asc"
                      : false
                  }
                >
                  <TableSortLabel
                    active={orderBy === "estado"}
                    direction={
                      orderBy === "estado" && order === "desc" ? "desc" : "asc"
                    }
                    onClick={(e) => handleRequestSort(e, "estado")}
                  >
                    Estado
                  </TableSortLabel>
                </TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Técnico</TableCell>
                <TableCell>Área</TableCell>
                <TableCell>Requerimiento</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredPedidos, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((p) => {
                  const cliente = clientes.find((c) => c.id === p.clienteId);
                  const tecnico = tecnicos.find((t) => t.id === p.tecnicoId);
                  const area = areas.find((a) => a.id === p.areaId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.estado}</TableCell>
                      <TableCell>
                        {cliente
                          ? `${cliente.nombre} ${cliente.apellido}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {tecnico
                          ? `${tecnico.nombre} ${tecnico.apellido}`
                          : "-"}
                      </TableCell>
                      <TableCell>{area ? area.nombre : "-"}</TableCell>
                      <TableCell>{p.requerimiento}</TableCell>
                      <TableCell>{p.calificacion ?? "-"}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenDialog(p)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(p)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {pedidos.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No hay pedidos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPedidos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </TableContainer>
        {/* Dialogo para editar pedido */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editPedido ? "Editar Pedido" : "Nuevo Pedido"}
          </DialogTitle>
          <DialogContent sx={{ minWidth: 350 }}>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="cliente-label">Cliente</InputLabel>
              <Select
                labelId="cliente-label"
                name="clienteId"
                value={form.clienteId}
                label="Cliente"
                onChange={handleChange}
              >
                <MenuItem value="">-</MenuItem>
                {clientes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="tecnico-label">Técnico</InputLabel>
              <Select
                labelId="tecnico-label"
                name="tecnicoId"
                value={form.tecnicoId}
                label="Técnico"
                onChange={handleChange}
              >
                <MenuItem value="">-</MenuItem>
                {tecnicos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.nombre} {t.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="area-label">Área</InputLabel>
              <Select
                labelId="area-label"
                name="areaId"
                value={form.areaId}
                label="Área"
                onChange={handleChange}
              >
                <MenuItem value="">-</MenuItem>
                {areas.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                name="estado"
                value={form.estado}
                label="Estado"
                onChange={handleChange}
              >
                {estados.map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              label="Requerimiento"
              name="requerimiento"
              value={form.requerimiento}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Calificación"
              name="calificacion"
              type="number"
              value={form.calificacion}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Comentario"
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Respuesta"
              name="respuesta"
              value={form.respuesta}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert
            severity={
              /** @type {"success"|"error"|"info"|"warning"} */ (
                snackbar.severity
              )
            }
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
