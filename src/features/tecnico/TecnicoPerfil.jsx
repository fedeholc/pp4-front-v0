import { useParams } from "react-router";
import { Layout } from "../../components/Layout";
import { Typography } from "@mui/material";

export function TecnicoPerfil() {
  const params = useParams();
  return (
    <Layout>
      <Typography variant="h4">Perfil del tecnico id: {params.id}</Typography>
      <Typography variant="body1">
        {/* TODO */}
        Pendiente implementar
      </Typography>
    </Layout>
  );
}
