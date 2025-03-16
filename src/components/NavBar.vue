<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="Company Logo" class="logo" />
    </div>
    <div class="navbar-right">
      <div class="nav-links">
        <router-link to="/about">About</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/career">Career</router-link>
        <router-link to="/services">Services</router-link>
      </div>
      <button @click="toggleDrawer" class="menu-button">
        <i class="material-icons" style="color: white; font-size: 24px;">menu</i>
      </button>
    </div>
    <div class="drawer" :class="{ open: drawerOpen }" v-click-outside="closeDrawer">
      <div class="drawer-header">
        <button @click="closeDrawer" class="close-button">
          <i class="material-icons" style="color: black; font-size: 20px;">close</i>
        </button>
      </div>
      <div class="drawer-content">
        <router-link to="/about" @click="closeDrawer">About</router-link>
        <router-link to="/login" @click="closeDrawer">Login</router-link>
        <router-link to="/career" @click="closeDrawer">Career</router-link>
        <router-link to="/services" @click="closeDrawer">Services</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      drawerOpen: false
    };
  },
  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    closeDrawer() {
      this.drawerOpen = false;
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: #fff;
  height: 60px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.nav-links {
  display: none;
}

.menu-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: #f0f0f0;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 100;
}

.drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;
}

.close-button {
  background: none;
  border: none;
  color: #333;
  font-size: 20px;
  cursor: pointer;
}

.drawer-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.drawer-content a {
  margin-bottom: 1rem;
  color: #333;
  text-decoration: none;
}

/* Media query for screens larger than 700px */
@media (min-width: 700px) {
  .nav-links {
    display: flex; /* Show navigation links */
  }

  .nav-links a {
    margin-right: 1rem;
    color: #fff;
    text-decoration: none;
  }

  .menu-button {
    display: none; /* Hide menu button */
  }
}
</style>