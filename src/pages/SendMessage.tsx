import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebaseConfig";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { CircularProgress } from "@mui/material";

const SendMessage: React.FC = () => {
  const [messageText, setMessageText] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!messageText.trim()) {
      setError("O texto da mensagem não pode estar vazio.");
      return;
    }

    const selectedDateTime = new Date(scheduledTime);
    const now = new Date();

    if (selectedDateTime <= now) {
      setIsLoading(false);
      setError("Selecione uma data e hora futuras.");
      return;
    }

    try {
      const scheduleMessage = httpsCallable(functions, "scheduleMessage");
      await scheduleMessage({
        text: messageText,
        contacts: [],
        scheduledTime: selectedDateTime.toISOString(),
      });
      setMessageText("");
      setScheduledTime("");
      setIsLoading(false);

      alert("Mensagem agendada com sucesso!");
    } catch (err) {
      setIsLoading(false);

      setError("Erro ao agendar mensagem.");
      console.error(err);
    }
  };

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
          Enviar Mensagem
        </Typography>
        <form onSubmit={handleSendMessage}>
          <TextField
            label="Texto da Mensagem"
            fullWidth
            margin="normal"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
          />
          <TextField
            label="Data e Hora Programadas"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            {isLoading ? <CircularProgress size={24} /> : "Agendar Mensagem"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SendMessage;
