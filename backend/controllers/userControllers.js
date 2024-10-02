const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    throw new Error('Please enter all fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    throw new Error('Failed to create user');
  }
});


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    throw new Error('Invalid email or password');
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or:[
      {name: {
        $regex: req.query.search,
        $options: 'i'
      }},
      {email: {
        $regex: req.query.search,
        $options: 'i'
      }}
    ]
  }: {};

  const users = await User.find({...keyword}).find({_id: {$ne: req.user._id}});
  res.send(users);
  
});

module.exports = { registerUser, authUser, allUsers };
