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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
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
