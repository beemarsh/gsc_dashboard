<template>
  <div class="partners-container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Main Content (blur when loading) -->
    <div :class="{ 'content-blur': loading }">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 color="#666">Partners</h1>
        <div class="d-flex gap-2">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Search partners..." v-model="searchQuery">
          </div>
          <button class="btn btn-primary" @click="showAddDialog = true">
            <i class="bi bi-plus-lg"></i> Add Partner
          </button>
        </div>
      </div>

      <!-- Partners list or empty state -->
      <div v-if="partners.length > 0" class="partners-grid">
        <div class="partner-card" v-for="partner in partners" :key="partner.partner_id">
          <div class="partner-logo">
            <i class="bi bi-building"></i>
          </div>
          <div class="partner-info">
            <h3>{{ partner.organization_name }}</h3>
            <p class="text-muted">{{ partner.type }}</p>
            <div class="partner-stats">
              <span><i class="bi bi-person"></i> {{ partner.contact_person }}</span>
              <span><i class="bi bi-envelope"></i> {{ partner.contact_email }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <i class="bi bi-people text-muted"></i>
        <h3>No Partners Found</h3>
        <p class="text-muted">Get started by adding your first partner</p>
       
      </div>
      
      <!-- Add Partner Dialog -->
      <AddPartnerDialog 
        v-if="showAddDialog"
        @close="showAddDialog = false"
        @submit="handleAddPartner"
        @error="handleError"
      />

      <!-- Snackbar -->
      <SnackBar
        :show="!!notification.message"
        :message="notification.message"
        :type="notification.type"
        @close="clearNotification"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AddPartnerDialog from '../components/AddPartnerDialog.vue'
import SnackBar from '../components/SnackBar.vue'
import { SERVER_URL } from '../../env.js'

export default defineComponent({
  name: 'Partners',
  components: {
    AddPartnerDialog,
    SnackBar
  },
  data() {
    return {
      searchQuery: '',
      showAddDialog: false,
      partners: [],
      loading: true,
      error: null,
      notification: {
        message: '',
        type: 'success'
      }
    }
  },
  async created() {
    await this.fetchPartners()
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification = { message, type }
      setTimeout(this.clearNotification, type === 'success' ? 3000 : 10000)
    },
    clearNotification() {
      this.notification = { message: '', type: 'success' }
    },
    handleError(message) {
      this.showNotification(message, 'error')
    },
    async fetchPartners() {
      this.loading = true
      try {
        const response = await fetch(`${SERVER_URL}/partner/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.status === 401) {
          this.$router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }

        const data = await response.json();
        this.partners = data.partners || [];
      } catch (error) {
        console.error('Error fetching partners:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async handleAddPartner(partnerData) {
      try {
        const response = await fetch(`${SERVER_URL}/partner/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(partnerData)
        });

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.details || 'Failed to add partner')
        }

        this.showNotification('Partner added successfully')
        this.showAddDialog = false
        // Refresh partners list using the new method
        await this.fetchPartners()
      } catch (error) {
        this.handleError(error.message)
      }
    }
  }
})
</script>

<style scoped>
.partners-container {
  padding: 20px;
}

.partners-container h1 {
  color: #666;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  padding: 8px 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.partner-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  transition: all 0.3s ease;
}

.partner-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.partner-logo {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo i {
  font-size: 24px;
  color: #666;
}

.partner-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #666;
}

.partner-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.partner-stats i {
  margin-right: 5px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.content-blur {
  filter: blur(2px);
  pointer-events: none;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 2rem;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #495057;
}

.empty-state p {
  margin-bottom: 1.5rem;
}
</style>
