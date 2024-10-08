const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) =>{
        results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
        });
        res.status(200).send(results);
      })
    const fullChats = await User.populate(chats, {
      
    });
    res.status(200).json(fullChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChats = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name){
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if(users.length < 2){
    return res.status(400).send({ message: "More than two users are required to form a group" });
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const {chatId, chatName} = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedChat){
      res.status(400);
      throw new Error("Chat not found");
    }else{
      res.json(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
  if(!added){
    res.status(400);
    throw new Error("User not added");
  }else{
    res.json(added);
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Log the input for debugging
  console.log("chatId:", chatId, "userId:", userId);

  // Check if the chat exists and the user is part of the chat
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.users.includes(userId)) {
    res.status(400);
    throw new Error("User not found in the chat");
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error("User not removed");
  } else {
    res.json(removed);
  }
});


module.exports = { accessChat, fetchChats, createGroupChats, renameGroup, addToGroup, removeFromGroup };