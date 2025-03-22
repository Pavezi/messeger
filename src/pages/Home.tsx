import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Gerenciador de conexões!
        </Typography>
        <Typography variant="body1" align="center">
          Gerencie suas conexões, contatos e envie mensagens de forma fácil e
          rápida.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
