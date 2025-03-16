<template>
  <DashboardLayout>
    <div class="dashboard-content">
      <md-card class="md-primary">
        <md-card-header>
          <div class="md-title">Dashboard</div>
        </md-card-header>
      </md-card>

      <div class="md-layout md-gutter md-alignment-center">
        <div class="md-layout-item md-size-33 md-small-size-100">
          <md-card>
            <md-card-header>
              <div class="md-title">Total Users</div>
            </md-card-header>

            <md-card-content>
              <h1 class="stat-number">1,234</h1>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout-item md-size-33 md-small-size-100">
          <md-card>
            <md-card-header>
              <div class="md-title">Revenue</div>
            </md-card-header>

            <md-card-content>
              <h1 class="stat-number">$5,678</h1>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout-item md-size-33 md-small-size-100">
          <md-card>
            <md-card-header>
              <div class="md-title">Active Projects</div>
            </md-card-header>

            <md-card-content>
              <h1 class="stat-number">45</h1>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '../layouts/DashboardLayout.vue'

export default {
  name: 'DashboardView',
  components: {
    DashboardLayout
  }
}
</script>

<style scoped>
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.md-layout {
  margin-top: 24px;
}

.md-card {
  margin-bottom: 16px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 500;
  color: #1a237e;
  margin: 16px 0;
}
</style>
