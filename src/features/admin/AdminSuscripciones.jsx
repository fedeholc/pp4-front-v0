import { Container, Typography } from "@mui/material";
import { Layout } from "../../components/Layout";

export function AdminSuscripciones() {
  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Administración de Suscripciones
        </Typography>
      </Container>
    </Layout>
  );
}
