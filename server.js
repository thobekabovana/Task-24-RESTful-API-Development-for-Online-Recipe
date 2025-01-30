const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const recipeRoutes = require("./Routes/RecipeRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON body
app.use("/api", recipeRoutes); // Use recipe routes

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
