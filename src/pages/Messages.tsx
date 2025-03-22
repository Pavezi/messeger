import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import {
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<
    { id: string; text: string; status: string; scheduledTime: string }[]
  >([]);
  const [tabValue, setTabValue] = useState(0);

  const fetchMessages = async (status: string) => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "messages"),
      where("userId", "==", auth.currentUser.uid),
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(q);
    const messagesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      status: doc.data().status,
      scheduledTime: doc.data().scheduledTime.toDate().toLocaleString(),
    }));
    setMessages(messagesData);
  };

  useEffect(() => {
    fetchMessages(tabValue === 0 ? "agendada" : "enviada");
  }, [tabValue]);

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
          Mensagens
        </Typography>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Agendadas" />
          <Tab label="Enviadas" />
        </Tabs>
        <List sx={{ width: "100%", mt: 2 }}>
          {messages.map((message) => (
            <ListItem key={message.id}>
              <ListItemText
                primary={message.text}
                secondary={`Status: ${message.status} | Agendada para: ${message.scheduledTime}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Messages;
