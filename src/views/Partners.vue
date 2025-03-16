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
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 color="#666">Partners</h1>
        <div class="d-flex gap-2 align-items-center search-controls">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Search partners..." v-model="searchQuery">
          </div>
          <button class="btn btn-primary add-partner-btn" @click="showAddDialog = true">
            <i class="bi bi-plus-lg"></i>
            <span class="d-none d-md-inline">Add Partner</span>
          </button>
        </div>
      </div>

      <!-- Update partners list to use filteredPartners -->
      <div v-if="filteredPartners.length > 0" class="partners-grid">
        <div class="partner-card" v-for="partner in filteredPartners" :key="partner.partner_id">
          <div class="partner-card-header">
            <div class="partner-logo">
              <i class="bi bi-building"></i>
            </div>
            <div class="partner-actions">
              <button class="btn btn-sm btn-outline-primary" @click="editPartner(partner)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(partner)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="partner-info">
            <h3>{{ partner.organization_name }}</h3>
            <p class="text-muted">{{ partner.type }}</p>
            <div class="partner-details">
              <a :href="`mailto:${partner.contact_email}`" class="detail-item" @click.prevent="copyToClipboard(partner.contact_email, 'Email')">
                <i class="bi bi-envelope"></i>
                <span>{{ partner.contact_email }}</span>
              </a>
              <a :href="`tel:${partner.phone_number}`" class="detail-item" @click.prevent="copyToClipboard(partner.phone_number, 'Phone number')">
                <i class="bi bi-telephone"></i>
                <span>{{ partner.phone_number }}</span>
              </a>
              <div class="detail-item">
                <i class="bi bi-person"></i>
                <span>{{ partner.contact_person }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-geo-alt"></i>
                <span>{{ partner.address }}</span>
              </div>
              <div v-if="partner.notes" class="detail-item">
                <i class="bi bi-sticky"></i>
                <span>{{ partner.notes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <i class="bi bi-people text-muted"></i>
        <h3>{{ partners.length === 0 ? 'No Partners Found' : 'No Matching Partners' }}</h3>
        <p class="text-muted">
          {{ partners.length === 0 
            ? 'Get started by adding your first partner' 
            : 'Try adjusting your search term' }}
        </p>
      </div>
      
      <!-- Add/Edit Partner Dialog -->
      <AddPartnerDialog 
        v-if="showAddDialog"
        :editMode="!!editingPartner"
        :partnerData="editingPartner"
        @close="closeDialog"
        @submit="handlePartnerSubmit"
        @error="handleError"
      />

      <!-- Confirm Delete Dialog -->
      <ConfirmDialog
        v-if="showDeleteDialog"
        :message="`Are you sure you want to delete ${deletingPartner?.organization_name}?`"
        :isLoading="isDeleting"
        @confirm="handleDeleteConfirm"
        @cancel="showDeleteDialog = false"
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
import eventBus from '../services/eventBus'
import AddPartnerDialog from '../components/AddPartnerDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import SnackBar from '../components/SnackBar.vue'
import { SERVER_URL } from '../../env.js'

export default defineComponent({
  name: 'Partners',
  components: {
    AddPartnerDialog,
    ConfirmDialog,
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
      },
      editingPartner: null,
      showDeleteDialog: false,
      deletingPartner: null,
      isDeleting: false
    }
  },
  async created() {
    await this.fetchPartners()
  },
  computed: {
    filteredPartners() {
      if (!this.searchQuery) return this.partners;
      
      const searchTerm = this.searchQuery.toLowerCase().trim();
      return this.partners.filter(partner => 
        partner.organization_name.toLowerCase().includes(searchTerm)
      );
    }
  },
  mounted() {
    // Add event listener using mitt
    eventBus.on('open-add-partner-dialog', () => {
      this.showAddDialog = true
    })
  },
  unmounted() {
    // Clean up listener
    eventBus.off('open-add-partner-dialog')
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
    },
    editPartner(partner) {
      this.editingPartner = partner
      this.showAddDialog = true
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingPartner = null
    },
    async confirmDelete(partner) {
      this.deletingPartner = partner;
      this.showDeleteDialog = true;
    },
    async handleDeleteConfirm() {
      if (!this.deletingPartner) return;
      this.isDeleting = true;
      
      try {
        const response = await fetch(`${SERVER_URL}/partner/delete?id=${this.deletingPartner.partner_id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.details || 'Failed to delete partner')
        }

        this.showNotification('Partner deleted successfully')
        await this.fetchPartners()
      } catch (error) {
        this.handleError(error.message)
      } finally {
        this.isDeleting = false
        this.showDeleteDialog = false
        this.deletingPartner = null
      }
    },
    async handlePartnerSubmit(partnerData) {
      if (this.editingPartner) {
        await this.updatePartner(partnerData)
      } else {
        await this.handleAddPartner(partnerData)
      }
    },
    async updatePartner(partnerData) {
      try {
        const response = await fetch(`${SERVER_URL}/partner/edit?id=${this.editingPartner.partner_id}`, {
          method: 'PUT',
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

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.details || 'Failed to update partner')
        }

        this.showNotification('Partner updated successfully')
        this.closeDialog()
        await this.fetchPartners()
      } catch (error) {
        this.handleError(error.message)
      }
    },
    async copyToClipboard(text, type) {
      try {
        await navigator.clipboard.writeText(text);
        this.showNotification(`${type} copied to clipboard`, 'success');
      } catch (err) {
        this.handleError('Failed to copy to clipboard');
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
  transition: all 0.2s ease;
}

.search-box input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
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
  background: white;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.partner-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.partner-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
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

.partner-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.partner-actions {
  display: flex;
  gap: 8px;
}

.partner-actions button {
  padding: 4px 8px;
}

.partner-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #666;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.detail-item:hover {
  background-color: #f8f9fa;
}

.detail-item i {
  font-size: 1rem;
  color: #666;
  margin-top: 3px;
}

.detail-item span {
  flex: 1;
  line-height: 1.4;
  word-break: break-word;
}

a.detail-item {
  cursor: pointer;
  color: #0d6efd;
}

a.detail-item:hover {
  text-decoration: none;
  background-color: #e9ecef;
}

.search-controls {
  width: 100%;
  margin-top: 1rem;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.add-partner-btn {
  white-space: nowrap;
  padding: 8px 16px;
}

@media (min-width: 768px) {
  .search-controls {
    width: auto;
    margin-top: 0;
  }

  .search-box {
    width: 300px;
    flex: none;
  }
}

@media (max-width: 767px) {
  .partners-container h1 {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .search-box input {
    padding: 8px 32px;
  }
  
  .add-partner-btn {
    padding: 8px;
  }
}
</style>
