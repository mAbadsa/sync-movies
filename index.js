/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
require("dotenv").config();
const socket = require("socket.io");
const logger = require("./logger");
const terminate = require("./terminate");
const shortId = require("shortid");

const {
  env: { PORT },
} = process;

const app = require("./app");

app.use((err, req, res) => {
  logger.log({
    level: "error",
    message: err.message,
  });

  res.status(500).json({ message: "Server Error" });
});

const server = app.listen(PORT || 8080, () =>
  console.log(`server is connected @ http://localhost:${PORT || 8080}`)
);

const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500,
});

process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
process.on("SIGTERM", exitHandler(0, "SIGTERM"));
process.on("SIGINT", exitHandler(0, "SIGINT"));

const io = socket(server);
let movieUrl;

const wrapper = (socketInstance, fun) => (params) => {
  try {
    fun(params);
  } catch (err) {
    socketInstance.use((_socket, next) => {
      logger.log({
        level: "error",
        message: err.message,
      });
      next(err);
    });
  }
};

io.on("connection", (req) => {
  req.on(
    "disconnecting",
    wrapper(io, () => {
      const roomId = [...req.rooms].find((item) => item !== req.id);
      req.leave(roomId);
      const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
      // io.to(roomId).emit('roomId', { roomId, connectedUsers });
      io.to(roomId).emit("socket-disconnect", {
        nickname: req.nickname,
        connectedUsers,
        roomId,
      });
      io.to(roomId).emit("peer-disconnect", { peerId: req.peerId });
    })
  );

  req.on("leave-room", ({ roomId, sid }) => {
    // console.log({ sid });
    req.leave(roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    // console.log({ connectedUsers });
    io.to(roomId).emit("leave-room", {
      connectedUsers,
      sid: socket.id,
    });
  });

  req.on(
    "join-room",
    wrapper(io, ({ roomId, loadedData, nickname }) => {
      // check roomId - should be in rooms

      // if (!io.sockets.adapter.rooms.get(roomId)) return;
      // console.log("room is exists", io.sockets.adapter.rooms.get(roomId));
      // console.log("Sokcet", [...io.sockets.sockets]);
      if (!io.sockets.adapter.rooms.get(roomId)) {
        req.emit("invalid-room", {});
      }
      // console.log({ rooms: io.sockets.adapter.rooms.get(roomId) });
      req.join(roomId);
      const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
      req.loadedData = loadedData;
      req.nickname = nickname;
      const loadDataUsers = [...io.sockets.sockets].filter((item) => {
        // console.log(item);
        io.sockets.adapter.rooms.get(roomId)?.has(item[0]) &&
          item[1].loadedData;
      }).length;
      console.log({movieUrl});
      io.to(roomId).emit("movieUrl", { url: movieUrl });
      io.to(roomId).emit("roomId", {
        roomId,
        connectedUsers,
        loadedData,
        id: req.id,
        loadDataUsers,
        nickname: req.nickname,
        movieUrl,
      });
      // console.log("joined-room", { connectedUsers });
    })
  );

  req.on("number-user-connected", ({ roomId }) => {
    if (io.sockets.adapter.rooms[roomId]) return;
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit("number-user-connected", {
      roomId,
      connectedUsers,
    });
    // console.log("number-users", { connectedUsers });
  });

  req.on(
    "create-room",
    wrapper(io, ({ loadedData, nickname }) => {
      console.log("Backend-end");
      const roomId = shortId.generate();
      req.join(roomId);
      const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
      req.loadedData = loadedData;
      req.nickname = nickname;
      const loadDataUsers = [...io.sockets.sockets].filter(
        (item) =>
          io.sockets.adapter.rooms.get(roomId)?.has(item[0]) &&
          item[1].loadedData
      ).length;
      // io.to(roomId).emit('roomId', {
      //   roomId,
      //   connectedUsers,
      //   loadedData,
      //   id: req.id,
      //   loadDataUsers,
      // });
      io.to(roomId).emit("create-room", {
        roomId,
        connectedUsers,
        loadedData,
        id: req.id,
        loadDataUsers,
        nickname: req.nickname,
      });
      // console.log("create-room", { connectedUsers });
    })
  );

  req.on("peer-connected", ({ peerId }) => {
    req.peerId = peerId || req.peerId;
  });

  req.on("call-peers", ({ roomId }, callback) => {
    console.log(callback);
    const peersId = [...io.sockets.sockets]
      .filter((item) => io.sockets.adapter.rooms.get(roomId)?.has(item[0]))
      .map((item) => item[1].peerId);
    callback({ [roomId]: peersId });
  });

  req.on(
    "loadeddata",
    wrapper(io, ({ roomId, loadedData }) => {
      req.loadedData = loadedData;
      const loadDataUsers = [...io.sockets.sockets].filter(
        (item) =>
          io.sockets.adapter.rooms.get(roomId)?.has(item[0]) &&
          item[1].loadedData
      ).length;

      io.to(roomId).emit("loadeddata", {
        id: req.id,
        loadedData,
        loadDataUsers,
      });
    })
  );

  req.on(
    "timeUpdated",
    wrapper(io, ({ roomId, currentTime }) => {
      req.currentTime = currentTime;
      const usersNickNames = [...io.sockets.sockets]
        .filter((item) => io.sockets.adapter.rooms.get(roomId).has(item[0]))
        .map((item) => ({
          nickname: item[1].nickname,
          currentTime: item[1].currentTime,
        }));
      io.to(roomId).emit("timeUpdated", {
        id: req.id,
        currentTime,
        usersNickNames,
      });
    })
  );

  req.on(
    "movieUrl",
    wrapper(io, ({ roomId, url }) => {
      io.sockets.sockets.forEach((socketItem) => {
        socketItem.loadedData = false;
      });
      // check if data.url is valid
      console.log({ url });
      movieUrl = url;
      io.to(roomId).emit("movieUrl", { url });
    })
  );

  //
  req.on("seeked", ({ time, roomId }) => {
    req.to(roomId).emit("seeked", { time });
  });

  // Handle typing event
  req.on("play", (data) => {
    req.to(data.roomId).emit("play", {
      time: data.currentTime,
      nickname: req.nickname,
    });
  });

  // Handle typing event
  req.on("pause", (roomId) => {
    req.to(roomId).emit("pause", { nickname: req.nickname });
  });

  // Handle chat event
  req.on("chat", (data) => {
    req.to(data.roomId).emit("chat", data.message);
  });

  // Handle typing event
  req.on("typing", (data) => {
    req.to(data.roomId).emit("typing", data.message);
  });
});
