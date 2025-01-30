const express = require("express");
const Recipe = require("./Recipe")
const router = express.Router();

// 📌 Create a new recipe
router.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json({ success: true, data: newRecipe });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Extract validation messages
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Get all recipes (with pagination)
router.get("/recipes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find().skip(skip).limit(limit);
    const totalRecipes = await Recipe.countDocuments();

    res.json({
      success: true,
      totalRecipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Get a specific recipe by ID
router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Update a recipe by ID
router.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensures validation runs when updating
    });
    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, data: updatedRecipe });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Delete a recipe by ID
router.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
