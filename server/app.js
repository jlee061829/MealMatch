// import necessary packages
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// creates server
const app = express();

// process requests
app.use(cors()); // allows other websites to communicate with server
app.use(express.json()); // handles json data

app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// creates a recipe search route
app.get("/api/recipes", async (req, res) => {
  try {
    const { ingredients } = req.query;
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          ingredients: ingredients,
          number: 10,
          ranking: 2,
          ignorePantry: true,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.get("/api/recipe/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});

const PORT = process.env.PORT || 3000;
// starts server on port 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Test the server by visiting http://localhost:3000/test");
});
