import { CreateMessage } from "../controllers/messageController.js";
import { addUser, removeUser, getAllUsers, getUser } from "./usersSocket.js";

const socketSetup = (io, socket) => {
  socket.on("joined", (data) => {
    const joinedUser = { ...data.currentUser, socketId: data.socketId };
    // console.log(joinedUser);
    addUser(joinedUser);
  });

  socket.on("join-room", (roomName) => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    socket.join(roomName);
    console.log("rom", roomName);
  });

  socket.on("send-message", async ({ roomName, message }) => {
    io.to(roomName).emit("receive-message", message);
    const trainerId = roomName.toString().split("&")[0];
    const trainer = getUser(trainerId);
    io.to(trainer.socketId).emit("notification", message.chat);
    await CreateMessage(message);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
};

export default socketSetup;
