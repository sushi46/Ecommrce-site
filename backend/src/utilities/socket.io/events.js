const handleJoin = (socket) => {
   const clerkId = socket.handshake.auth.userId;
 
   if (!clerkId) {
     console.error("Couldn't find the associated user ID");
     socket.emit("error", { message: "User ID is required" });
     socket.disconnect(); 
     return;
   }
 
   socket.join(`User_${clerkId}`);
   console.log(`User ${socket.id} joined room: User_${clerkId}`);
 
   // Handle joining additional rooms (if needed)
   socket.on("join", (roomId) => {
     socket.join(roomId);
     console.log(`User ${socket.id} joined room: ${roomId}`);
   });
};

const handleMessage = (io, socket) => {
 socket.on("message", (data)=> {
    const { roomId, content} = data

    io.to(roomId).emit("message", {sender: socket.id, content})
    console.log(`Message is sent to ${roomId}:: ${content}`)
 })
}

const handleDisconnect = (socket) => {
 socket.on("disconnect", ()=> {
    console.log(`user ${socket.id} left the room.`)

    const rooms = Object.keys(socket.rooms)
    rooms.forEach((room)=> {
     socket.leave(room)
     console.log(`User ${socket.id} left room: ${room}`)
    })
 })
}

export {handleJoin, handleMessage, handleDisconnect}
