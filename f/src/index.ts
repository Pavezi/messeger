import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

interface ScheduleMessageData {
  text: string;
  contacts: string[];
  scheduledTime: string;
}

export const scheduleMessage = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado.");
  }

  const { text, contacts, scheduledTime } = request.data as ScheduleMessageData;

  try {
    const messageRef = await getFirestore()
      .collection("messages")
      .add({
        text,
        contacts,
        scheduledTime: new Date(scheduledTime),
        status: "agendada",
        userId: request.auth.uid,
      });
    return { id: messageRef.id };
  } catch (error) {
    throw new HttpsError("internal", "Erro ao agendar mensagem.");
  }
});

export const updateMessageStatus = onSchedule("every 1 minutes", async () => {
  const now = new Date();
  const messagesRef = getFirestore().collection("messages");

  const querySnapshot = await messagesRef
    .where("status", "==", "agendada")
    .where("scheduledTime", "<=", now)
    .get();

  const batch = getFirestore().batch();
  querySnapshot.forEach((doc) => {
    batch.update(doc.ref, { status: "enviada" });
  });

  await batch.commit();
  console.log(`Atualizadas ${querySnapshot.size} mensagens.`);
});
