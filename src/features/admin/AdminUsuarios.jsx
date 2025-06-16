import { Container, Divider, Typography } from "@mui/material";
import { Layout } from "../../components/Layout";

export function AdminUsuarios() {
  return (
    <Layout>
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Typography paddingTop={4} variant="h4" component="h1" gutterBottom>
          Administración de Usuarios
        </Typography>
        <Divider></Divider>
      </Container>
    </Layout>
  );
}
