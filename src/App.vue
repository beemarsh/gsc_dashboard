<script setup>
import NavBar from './components/NavBar.vue'
</script>

<script>
export default {
  created() {
    this.$router.beforeEach((to, from, next) => {
      document.title = to.meta.title || 'GSC Health';
      next();
    });
  }
}
</script>

<template>
  <div id="app">
    <!-- <NavBar /> -->
    <router-view />
  </div>
</template>

<style src="./assets/base.css"></style>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}

@media (min-width: 1024px) {
  #app {
    /* padding-right: calc(var(--section-gap) / 2); */
  }
}
</style>