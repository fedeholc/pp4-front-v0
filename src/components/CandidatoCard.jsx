import {
  CalendarMonth,
  CheckCircle,
  Comment,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
/**
 * @param {Object} props
 * @param {import("../../types").CandidatoVista} props.candidato
 * @param {function} props.onSelectTecnico
 */
export function CandidatoCard({ candidato, onSelectTecnico }) {
  const navigate = useNavigate();
  let average =
    candidato.calificaciones.reduce(
      (acc, calificacion) => acc + calificacion,
      0
    ) /
    2 /
    candidato.calificaciones.length;
  return (
    <Paper
      className="gradientBackground"
      elevation={4}
      variant="outlined"
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        background: "linear-gradient(345deg, #eaff0005, #eaff0010)",
        boxShadow: 1,
        border: "1px solid #e0e0e0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" mb={1}>
        <Stack flexDirection={"row"} alignItems={"center"} gap="1rem">
          <Person color="primary" />
          <Typography variant="h6" fontWeight={700}>
            {candidato.nombre} {candidato.apellido}
          </Typography>
        </Stack>
        <Box flexGrow={1} />
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Calificación
          </Typography>

          <Rating
            name="half-rating-read"
            value={average}
            precision={0.5}
            readOnly
            size="small"
            sx={{ ml: 1 }}
          />
          <Typography
            sx={{ marginLeft: "0.2rem" }}
            color="text.secondary"
            variant="body2"
          >
            ({candidato.calificaciones.length})
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Stack spacing={2} flex={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonth fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Fecha de registro:</b> {candidato.fechaRegistro.toString()}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Comment fontSize="small" color="action" />
            <Typography variant="body2">
              <b>Características del servicio:</b> {candidato.caracteristicas}
            </Typography>
          </Stack>
        </Stack>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <Stack
          spacing={2}
          flex={1}
          justifyContent="center"
          direction={"column"}
          alignItems={"flex-end"}
        >
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            sx={{ borderRadius: 2, fontWeight: 600, minWidth: 140 }}
            startIcon={<Person />}
            onClick={() => {
              navigate(`/tecnico/${candidato.id}/perfil`);
            }}
          >
            VER PERFIL
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ borderRadius: 2, fontWeight: 600, minWidth: 140 }}
            startIcon={<CheckCircle />}
            onClick={() => {
              onSelectTecnico(candidato.id);
            }}
          >
            SELECCIONAR
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
