import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>; // Exibe um spinner ou mensagem de carregamento
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Messeger
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Cadastro
              </Button>
            </>
          )}
          {user && (
            <>
              <Button color="inherit" component={Link} to="/connections">
                Conexões
              </Button>
              <Button color="inherit" component={Link} to="/send-message">
                Enviar Mensagem
              </Button>
              <Button color="inherit" component={Link} to="/messages">
                Mensagens
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
