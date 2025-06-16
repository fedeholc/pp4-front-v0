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
import { Edit, Delete, Add } from "@mui/icons-material";
import { Layout } from "../../components/Layout";
import { UserContext } from "../../contexts/UserContext";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../api";

const roles = ["admin", "tecnico", "cliente"];
const severities = ["success", "info", "warning", "error"];
function toRol(val) {
  return roles.includes(val) ? val : "cliente";
}
function toSeverity(val) {
  return severities.includes(val) ? val : "success";
}

export function AdminUsuarios() {
  const { token } = useContext(UserContext) || {};
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", rol: "cliente" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [order, setOrder] = useState("asc"); // "asc" | "desc"
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios(token);
      setUsuarios(data);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al cargar usuarios",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, [token]);

  const handleOpenDialog = (user = null) => {
    setEditUser(user);
    setForm(
      user
        ? { email: user.email || "", password: "", rol: user.rol || "cliente" }
        : { email: "", password: "", rol: "cliente" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null);
    setForm({ email: "", password: "", rol: "cliente" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "rol" && roles.includes(value) ? value : value,
    }));
  };

  const handleSave = async () => {
    try {
      const safeRol = toRol(form.rol);
      if (editUser) {
        await updateUsuario(
          editUser.id,
          {
            email: form.email,
            rol: safeRol,
            ...(form.password ? { password: form.password } : {}),
          },
          token
        );
        setSnackbar({
          open: true,
          message: "Usuario actualizado",
          severity: "success",
        });
      } else {
        await createUsuario({ ...form, rol: safeRol }, token);
        setSnackbar({
          open: true,
          message: "Usuario creado",
          severity: "success",
        });
      }
      handleCloseDialog();
      fetchUsuarios();
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar usuario",
        severity: "error",
      });
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    try {
      await deleteUsuario(user.id, token);
      setSnackbar({
        open: true,
        message: "Usuario eliminado",
        severity: "success",
      });
      fetchUsuarios();
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar usuario",
        severity: "error",
      });
    }
  };

  // Filtrado de usuarios
  const filteredUsuarios = usuarios.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.rol && u.rol.toLowerCase().includes(q)) ||
      (u.id && String(u.id).includes(q))
    );
  });

  // Ordenar usuarios
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
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Administración de Usuarios
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 2 }}
        >
          Nuevo Usuario
        </Button>
        <TextField
          label="Buscar usuario"
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
                    orderBy === "rol"
                      ? order === "desc"
                        ? "desc"
                        : "asc"
                      : false
                  }
                >
                  <TableSortLabel
                    active={orderBy === "rol"}
                    direction={
                      orderBy === "rol" && order === "desc" ? "desc" : "asc"
                    }
                    onClick={(e) => handleRequestSort(e, "rol")}
                  >
                    Rol
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredUsuarios, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.rol}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpenDialog(u)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(u)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {usuarios.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay usuarios
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsuarios.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
          />
        </TableContainer>
        {/* Dialogo para crear/editar usuario */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {editUser ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogContent sx={{ minWidth: 350 }}>
            <TextField
              margin="normal"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="normal"
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              helperText={editUser ? "Dejar vacío para no cambiar" : ""}
            />
            <FormControl margin="normal" fullWidth>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                name="rol"
                value={form.rol}
                label="Rol"
                onChange={handleChange}
              >
                {roles.map((rol) => (
                  <MenuItem key={rol} value={rol}>
                    {rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            severity={toSeverity(snackbar.severity)}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
