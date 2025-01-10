<template>
  <div class="recipe-search">
    <!-- Error Alert -->
    <div v-if="error" class="error-alert">
      {{ error }}
      <button @click="error = null" class="close-button">×</button>
    </div>

    <!-- Recipe Details Modal -->
    <div v-if="selectedRecipe" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="modal-close">×</button>

        <div class="modal-header">
          <h2>{{ selectedRecipe.title }}</h2>
          <img :src="selectedRecipe.image" :alt="selectedRecipe.title" />
        </div>

        <div class="modal-body">
          <div class="recipe-info">
            <p><strong>Ready in:</strong> {{ selectedRecipe.readyInMinutes }} minutes</p>
            <p><strong>Servings:</strong> {{ selectedRecipe.servings }}</p>
          </div>

          <div class="recipe-ingredients">
            <h3>Ingredients</h3>
            <ul>
              <li v-for="(ingredient, index) in selectedRecipe.extendedIngredients" :key="index">
                {{ ingredient.original }}
              </li>
            </ul>
          </div>

          <div class="recipe-instructions" v-if="selectedRecipe.analyzedInstructions?.length">
            <h3>Instructions</h3>
            <ol>
              <li
                v-for="(step, index) in selectedRecipe.analyzedInstructions[0].steps"
                :key="index"
              >
                {{ step.step }}
              </li>
            </ol>
          </div>

          <div class="recipe-summary" v-if="selectedRecipe.summary">
            <h3>Summary</h3>
            <div v-html="selectedRecipe.summary"></div>
          </div>

          <a :href="selectedRecipe.sourceUrl" target="_blank" class="source-link">
            View Original Recipe
          </a>
        </div>
      </div>
    </div>

    <div class="search-area">
      <div class="search-container">
        <input
          v-model="ingredientInput"
          @keyup.enter="addIngredient"
          placeholder="Enter an ingredient (e.g., tomatoes)"
          class="ingredient-input"
        />
        <button
          @click="addIngredient"
          class="add-button"
          :disabled="!ingredientInput.trim() || ingredients.length >= 10"
        >
          Add Ingredient
        </button>

        <button v-if="ingredients.length > 0" @click="clearIngredients" class="clear-button">
          Clear All
        </button>
      </div>

      <div class="ingredients-list">
        <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-tag">
          {{ ingredient }}
          <button @click="removeIngredient(index)" class="remove-button">×</button>
        </div>
      </div>

      <button
        @click="searchRecipes"
        :disabled="!ingredients.length || isLoading"
        class="search-button"
      >
        <span v-if="isLoading">Searching...</span>
        <span v-else>Search Recipes</span>
      </button>
    </div>

    <div v-if="!isLoading && recipes.length === 0 && hasSearched" class="no-results">
      No recipes found with these ingredients. Try different combinations!
    </div>

    <div v-if="isLoading" class="loading-spinner">Loading recipes...</div>

    <div class="recipes-grid" v-else-if="recipes.length > 0">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <img :src="recipe.image" :alt="recipe.title" />
        <div class="recipe-content">
          <h3>{{ recipe.title }}</h3>
          <div class="recipe-details">
            <p>Used ingredients: {{ recipe.usedIngredientCount }}</p>
            <p>Missing ingredients: {{ recipe.missedIngredientCount }}</p>
          </div>
          <button
            @click="getRecipeDetails(recipe.id)"
            class="view-recipe-button"
            :disabled="isLoadingRecipe"
          >
            {{ isLoadingRecipe ? 'Loading...' : 'View Recipe' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RecipeSearch',
  data() {
    return {
      ingredientInput: '',
      ingredients: [],
      recipes: [],
      isLoading: false,
      isLoadingRecipe: false,
      error: null,
      hasSearched: false,
      selectedRecipe: null,
    }
  },
  methods: {
    addIngredient() {
      const ingredient = this.ingredientInput.trim().toLowerCase()
      if (ingredient) {
        if (this.ingredients.length >= 10) {
          this.error = 'Maximum 10 ingredients allowed'
          return
        }
        if (this.ingredients.includes(ingredient)) {
          this.error = 'This ingredient is already added'
          return
        }
        this.ingredients.push(ingredient)
        this.ingredientInput = ''
        this.error = null
      }
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1)
    },
    clearIngredients() {
      this.ingredients = []
      this.recipes = []
      this.hasSearched = false
    },
    async searchRecipes() {
      this.isLoading = true
      this.error = null
      this.hasSearched = true

      try {
        const response = await axios.get('http://localhost:3000/api/recipes', {
          params: {
            ingredients: this.ingredients.join(','),
          },
        })
        this.recipes = response.data
      } catch (error) {
        this.error = 'Failed to fetch recipes. Please try again.'
        console.error('Error fetching recipes:', error)
      } finally {
        this.isLoading = false
      }
    },
    async getRecipeDetails(id) {
      try {
        this.isLoadingRecipe = true
        const response = await axios.get(`http://localhost:3000/api/recipe/${id}`)
        this.selectedRecipe = response.data
      } catch (error) {
        this.error = 'Failed to fetch recipe details'
        console.error('Error fetching recipe details:', error)
      } finally {
        this.isLoadingRecipe = false
      }
    },
    closeModal() {
      this.selectedRecipe = null
    },
  },
}
</script>

<style scoped>
.recipe-search {
  font-family: inherit;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
}

.ingredient-input {
  width: 100%;
  max-width: 800px;
  padding: 15px 25px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  font-size: 16px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ingredient-input:focus {
  outline: none;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.add-button,
.search-button {
  font-family: 'FranklinGothic URW Cond Medium', 'Franklin Gothic Medium';
  padding: 15px 25px;
  padding: 15px 25px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
}

.clear-button {
  font-family: 'FranklinGothic URW Cond Medium', 'Franklin Gothic Medium';
  padding: 15px 25px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.search-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 800px;
  padding: 20px;
  min-height: 60px;
  margin-bottom: 0;
}

.ingredient-tag {
  font-family: Helvetica, Arial, sans-serif;
  background-color: white;
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
  font-size: 16px;
  margin-bottom: 10px;
}

.remove-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
}

.recipes-grid {
  margin-top: 50px;
}

.recipe-card {
  background-color: white;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-content {
  font-family: Arial, sans-serif;
  padding: 15px;
}

.recipe-card h3 {
  font-family: 'FranklinGothic URW Cond Medium', 'Franklin Gothic Medium', Arial, sans-serif;
  padding: 15px;
  margin: 0;
  color: #333;
}

.recipe-card p {
  padding: 0 15px 15px;
  margin: 5px 0;
  color: #666;
}

.view-recipe-button {
  font-family: 'FranklinGothic URW Cond Medium', 'Franklin Gothic Medium';
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
}

.view-recipe-button:hover {
  background-color: #45a049;
}

.error-alert {
  background-color: rgba(255, 235, 238, 0.9);
  color: #c62828;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-spinner {
  text-align: center;
  padding: 20px;
  color: white;
  font-size: 18px;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: white;
  font-style: italic;
  font-size: 18px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 20px;
  color: #333;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-family: 'FranklinGothic URW Cond Medium', 'Franklin Gothic Medium', Arial, sans-serif;
  color: #333;
  margin-bottom: 15px;
}

.modal-header img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 10px;
}

.recipe-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #333;
}

.recipe-ingredients {
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
  color: #333;
}

.recipe-ingredients h3 {
  color: #333;
  margin-bottom: 10px;
}

.recipe-ingredients ul {
  list-style-type: none;
  padding-left: 0;
}

.recipe-ingredients li {
  padding: 5px 0;
}

.recipe-instructions {
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
  color: #333;
}

.recipe-instructions h3 {
  color: #333;
  margin-bottom: 10px;
}

.recipe-instructions ol {
  padding-left: 20px;
}

.recipe-instructions li {
  margin-bottom: 10px;
}

.source-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.source-link:hover {
  background-color: #313b31;
}

.recipe-summary {
  font-family: Arial, sans-serif;
  margin: 20px 0;
  color: 10px;
}

.recipe-summary h3 {
  color: #333;
  margin-bottom: 10px;
}

.recipe-summary :deep(a) {
  color: #4caf50;
  text-decoration: none;
}

.recipe-summary :deep(b) {
  color: #333;
}

html,
body {
  min-height: 100vh;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
