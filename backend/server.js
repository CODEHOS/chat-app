const express = require("express");
const chats = require('./data/data');
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const cors = require("cors");

app.use(cors());


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get('/api/chats/:id', (req, res) => {
  // console.log(req.params.id);
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));