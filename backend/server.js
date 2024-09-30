const express = require("express");
const connectDB = require("./config/db"); // MongoDB connection
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config(); // Load environment variables from .env file

connectDB(); // Connect to MongoDB

const app = express();

app.use(cors()); // Enable CORS

// Middleware to parse JSON bodies (if needed for POST/PUT requests)
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Root route
app.get("/", (req, res) => {
  res.send("API is running successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes );


app.use(notFound)
app.use(errorHandler)

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
