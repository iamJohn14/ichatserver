// // [Section] Dependencies and Modules
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// const messageRoutes = require("./routes/messagesRoute");
// const socket = require("socket.io");

// // [Section] Environment Setup
// dotenv.config();

// let account = process.env.CREDENTIALS;
// const port = process.env.PORT;

// app.use(function (req, res) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);
// });

// // [Section] Server Setup
// const app = express();
// app.use(express.json());
// app.use(cors());

// // [Section] Database Connection
// mongoose.set("strictQuery", true);
// mongoose.connect(account);
// const connectStatus = mongoose.connection;
// connectStatus.once("open", () =>
//   console.log("Connected to iChat Cloud Database")
// );

// // [Section] Backend Routes
// app.use("/api/auth", userRoutes);
// app.use("/api/message", messageRoutes);

// // [Section] Server Gateway Response
// app.get("/", (req, res) => {
//   res.send("Welcome to the iChat Backend");
// });

// const server = app.listen(port, () => {
//   console.log(`Server initialized and started at Port ${port} .`);
// });

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:5000",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     online;
//     Users.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-received", data.msg);
//     }
//   });
// });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.CREDENTIALS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-received", data.message);
    }
  });
});
