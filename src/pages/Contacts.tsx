import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const Contacts: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchContacts = async () => {
    if (!connectionId) {
      console.error("connectionId is undefined");
      return;
    }

    try {
      const q = query(collection(db, `connections/${connectionId}/contacts`));
      const querySnapshot = await getDocs(q);
      const contactsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        phone: doc.data().phone,
      }));
      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Erro ao buscar contatos.");
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!connectionId) {
      setError("ID da conexão não encontrado.");
      return;
    }

    try {
      await addDoc(collection(db, `connections/${connectionId}/contacts`), {
        name: contactName,
        phone: contactPhone,
      });
      setContactName("");
      setContactPhone("");
      fetchContacts();
    } catch (err) {
      setError("Erro ao adicionar contato.");
      console.error(err);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!connectionId) {
      setError("ID da conexão não encontrado.");
      return;
    }

    try {
      await deleteDoc(
        doc(db, `connections/${connectionId}/contacts`, contactId)
      );
      fetchContacts();
    } catch (err) {
      setError("Erro ao deletar contato.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [connectionId]);

  if (!connectionId) {
    return <Typography>ID da conexão não encontrado.</Typography>;
  }

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
          Contatos para Conexão: {connectionId}
        </Typography>
        <Button onClick={() => navigate("/connections")} sx={{ mb: 2 }}>
          Voltar para Conexões
        </Button>
        <form onSubmit={handleAddContact}>
          <TextField
            label="Nome do Contato"
            fullWidth
            margin="normal"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          <TextField
            label="Telefone do Contato"
            fullWidth
            margin="normal"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Adicionar Contato
          </Button>
        </form>
        <List sx={{ width: "100%", mt: 4 }}>
          {contacts.map((contact) => (
            <ListItem
              key={contact.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={contact.name} secondary={contact.phone} />
            </ListItem>
          ))}
        </List>
        {contacts.length === 0 && (
          <Typography>Nenhum contato encontrado.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Contacts;