const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Recipe title is required"],
    trim: true,
  },
  ingredients: {
    type: [String], // Array of ingredient names
    required: [true, "Ingredients are required"],
  },
  instructions: {
    type: String,
    required: [true, "Instructions are required"],
  },
  cookingTime: {
    type: Number, // Time in minutes
    required: [true, "Cooking time is required"],
    min: [1, "Cooking time must be at least 1 minute"],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"], // Restrict values to these options
    required: [true, "Difficulty level is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation timestamp
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
