const express = require("express");
const Recipe = require("../Recipe");

const router = express.Router();

// ✅ Create a new recipe
router.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json({ message: "Recipe created successfully", newRecipe });
  } catch (error) {
    console.error(error);  // Log error details for debugging

    // Check if the error is related to validation
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }

    // General error
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Get all recipes with pagination
router.get("/recipes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page < 1) {
      return res.status(400).json({ message: "Page number must be greater than 0" });
    }

    const totalRecipes = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      totalRecipes,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRecipes / pageSize),
      recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Get a single recipe by ID
router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Update a recipe by ID
router.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,  // Ensures validation happens on update
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe updated successfully", updatedRecipe });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Delete a recipe by ID
router.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
