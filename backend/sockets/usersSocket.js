// usersSocket.js

let onlineUsers = [];

// Add user
function addUser(user) {
  if (!onlineUsers.some((u) => u.userId === user.userId)) {
    onlineUsers.push(user);
  }
}

// Remove user by socketId
function removeUser(socketId) {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
}

// Get user by userId
function getUser(userId) {
  return onlineUsers.find((user) => user.userId === userId);
}

// Get all online users
function getAllUsers() {
  return onlineUsers;
}

export { addUser, removeUser, getUser, getAllUsers };
