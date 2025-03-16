<template>
  <div class="dashboard-container">
    <!-- Mobile Header -->
    <div class="mobile-header d-lg-none">
      <button class="menu-btn" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </button>
      <h1>Dashboard</h1>
    </div>

    <!-- Sidebar -->
    <nav :class="['sidebar', { 'show': isSidebarOpen }]">
        <button class="close-btn d-lg-none" @click="toggleSidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      <div class="sidebar-header">
        <div class="company-info">
          <img src="@/assets/logo.png" alt="Company Logo" class="company-logo">
          <h2 color="#666">GSC Health</h2>
        </div>
        
      </div>

      <div class="add-partner-section">
        <button class="btn btn-primary w-100">
          <i class="bi bi-plus-lg"></i> Add Partner
        </button>
      </div>

      <div class="nav-links">
        <router-link to="/dashboard/partners" class="nav-item" active-class="active">
          <i class="bi bi-people"></i> Partners
        </router-link>
        <router-link to="/dashboard/events" class="nav-item" active-class="active">
          <i class="bi bi-calendar-event"></i> Events
        </router-link>
        <router-link to="/dashboard/training" class="nav-item" active-class="active">
          <i class="bi bi-book"></i> Training Programs
        </router-link>
      </div>

      <div class="logout-section">
        <button class="btn btn-outline-danger w-100" @click="handleLogout">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Backdrop for mobile -->
    <div 
      class="sidebar-backdrop d-lg-none" 
      v-if="isSidebarOpen"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DashboardPage',
  data() {
    return {
      isSidebarOpen: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleLogout() {
      // Clear local storage
      localStorage.removeItem('token');
      // Redirect to login
      this.$router.push('/login');
    }
  },
  created() {
    this.$router.push('/dashboard/partners');
  }
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
}

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1030;
}

.mobile-header h1 {
  margin: 0;
  font-size: 1.25rem;
  margin-left: 1rem;
}

.menu-btn, .close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
}

.close-btn{
    position: absolute;
  right: 15px;
  top: 15px;
}


.sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.company-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  color: #666;
}

.company-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.add-partner-section {
  margin-bottom: 2rem;
  min-width: 200px;
}

.nav-links {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
  padding: 15px 30px;
}

.nav-item:hover, .nav-item.active {
  background: #e9ecef;
  color: #0d6efd;
}

.nav-item i {
  font-size: 1.25rem;
}

.main-content {
  margin-left: 280px;
  padding: 2rem;
  width: calc(100% - 280px);
}

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1029;
}

.logout-section > button {
  padding: 15px 30px;
}

@media (max-width: 991.98px) {
  .sidebar {
    transform: translateX(-100%);
    z-index: 1031;
  }

  .sidebar.show {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    width: 100%;
    padding-top: 80px;
  }
}
</style>
