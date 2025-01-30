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
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all recipes with pagination
router.get("/recipes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const totalRecipes = await Recipe.countDocuments();
    
    const recipes = await Recipe.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      totalRecipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / pageSize),
      recipes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get a single recipe by ID
router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update a recipe by ID
router.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe updated successfully", updatedRecipe });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete a recipe by ID
router.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
