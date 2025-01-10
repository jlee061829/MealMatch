<template>
  <div id="app">
    <div class="container">
      <div class="logo">MealMatch</div>
      <RecipeSearch />
    </div>
  </div>
</template>

<script>
import RecipeSearch from './components/RecipeSearch.vue'

export default {
  name: 'App',
  components: {
    RecipeSearch,
  },
}
</script>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #f28c28 0%,
    #f49234 5%,
    #f69840 10%,
    #f89e4c 15%,
    #faa458 20%,
    #fcaa64 25%,
    #feb070 30%,
    #ffb67c 35%,
    #ffbc88 40%,
    #ffc294 45%,
    #ffc8a0 50%,
    #ffceac 55%,
    #ffd4b8 60%,
    #ffdac4 65%,
    #ffe0d0 70%,
    #ffe6dc 75%,
    #ffece8 80%,
    #fff2f0 85%,
    #fff8f6 90%,
    #ffffff 100%
  );
  background-attachment: fixed;
}

#app {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15vh;
}

.logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 72px;
  font-weight: 600;
  color: #153954;
  margin-bottom: 0px;
  text-transform: lowercase;
  letter-spacing: -3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
