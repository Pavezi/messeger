import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const Connections: React.FC = () => {
  const [connectionName, setConnectionName] = useState("");
  const [connections, setConnections] = useState<
    { id: string; name: string }[]
  >([]);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "connections"),
      where("userId", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const connectionsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setConnections(connectionsData);
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!auth.currentUser) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      await addDoc(collection(db, "connections"), {
        name: connectionName,
        userId: auth.currentUser.uid,
      });
      setConnectionName("");
      fetchConnections(); // Atualiza a lista de conexões
    } catch (err) {
      setError("Erro ao adicionar conexão.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

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
        <Typography variant="h4" component="h1" gutterBottom>
          Conexões
        </Typography>
        <form onSubmit={handleAddConnection}>
          <TextField
            label="Nome da Conexão"
            fullWidth
            margin="normal"
            value={connectionName}
            onChange={(e) => setConnectionName(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Adicionar Conexão
          </Button>
        </form>
        <List sx={{ width: "100%", mt: 4 }}>
          {connections.map((connection) => (
            <ListItem key={connection.id}>
              <ListItemText primary={connection.name} />
              <Button
                component={Link}
                to={`/connections/${connection.id}/contacts`}
              >
                Ver Contatos
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Connections;
