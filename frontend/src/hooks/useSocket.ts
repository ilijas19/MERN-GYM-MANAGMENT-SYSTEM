import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

const useSocket = () => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    socket = io("https://mern-gym-managment-system.onrender.com");

    socket.on("connect", () => {
      setConnected(true);
      // console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      // console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket, connected };
};

export default useSocket;
