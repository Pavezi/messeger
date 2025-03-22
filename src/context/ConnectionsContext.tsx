import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";

interface Connection {
  id: string;
  name: string;
}

interface ConnectionsContextType {
  connections: Connection[];
  loading: boolean;
}

const ConnectionsContext = createContext<ConnectionsContextType>({
  connections: [],
  loading: true,
});

export const useConnections = () => useContext(ConnectionsContext);

export const ConnectionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!auth.currentUser) return;

      const connectionsQuery = query(
        collection(db, "connections"),
        where("userId", "==", auth.currentUser.uid)
      );
      const connectionsSnapshot = await getDocs(connectionsQuery);

      const connectionsData = connectionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setConnections(connectionsData);
      setLoading(false);
    };

    fetchConnections();
  }, []);

  return (
    <ConnectionsContext.Provider value={{ connections, loading }}>
      {children}
    </ConnectionsContext.Provider>
  );
};
