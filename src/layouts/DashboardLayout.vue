<template>
  <div class="page-container md-layout">
    <md-app>
      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-primary">
          <span class="md-title">GSC Dashboard</span>
        </md-toolbar>

        <md-list>
          <md-list-item v-for="item in navigation" 
                        :key="item.path" 
                        :to="item.path">
            <md-icon>{{ item.icon }}</md-icon>
            <span class="md-list-item-text">{{ item.name }}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-header>
        <md-toolbar class="md-primary">
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="showNavigation = true">
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu md-direction="bottom-start">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>account_circle</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item @click="logout">Logout</md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </md-toolbar>
      </md-app-header>

      <md-app-content>
        <slot></slot>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',
  data() {
    return {
      showNavigation: false,
      navigation: [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Analytics', path: '/analytics', icon: 'analytics' },
        { name: 'Settings', path: '/settings', icon: 'settings' },
      ]
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.page-container {
  height: 100vh;
}

.md-app {
  min-height: 100vh;
  border: 1px solid rgba(#000, .12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>
