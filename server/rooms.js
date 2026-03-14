let rooms = {};
export const createRoom = (roomId, name, socketId) => {
  if (Object.hasOwn(rooms, roomId)) {
    return "Room exists";
  }
  rooms[roomId] = { users: [{ socketId, name }] };
  console.log(`${name}: Socket ${socketId} joined room: ${roomId}`);
  return "ok";
};

export const joinRoom = (roomId, socketId, name) => {
  if (!Object.hasOwn(rooms, roomId)) {
    return "not_found";
  }
  if (rooms[roomId].users.length >= 2) {
    return "full";
  }
  rooms[roomId].users.push({ socketId, name });
  return "ok";
};

export const leaveRoom = (roomId, socketId) => {
  if (!Object.hasOwn(rooms, roomId)) return "not_found";
  
  rooms[roomId].users = rooms[roomId].users.filter(user => user.socketId !== socketId);
  
  if (rooms[roomId].users.length === 0) {
    delete rooms[roomId];
  }
};
