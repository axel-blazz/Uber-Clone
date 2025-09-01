const { Server } = require("socket.io");
const UserModel = require("./models/user.model");
const CaptainModel = require("./models/captain.model");

let io = null;

function initializeSocketConnection(server) {

  // Keep CORS aligned with the app for dev
  io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", async (data) => {
        const { userId, userType } = data;
        if (userType === "user") {
          await UserModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
            await CaptainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }   
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await CaptainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        }
      }, { new: true });
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket ${socket.id} disconnected: ${reason}`);
    });
  });
}


const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  }
};



module.exports = {
  initializeSocketConnection,
  sendMessageToSocketId,
};
