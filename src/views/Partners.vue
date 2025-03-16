<template>
  <div class="partners-container">
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

    <!-- Partners list placeholder -->
    <div class="partners-grid">
      <div class="partner-card" v-for="i in 6" :key="i">
        <div class="partner-logo">
          <i class="bi bi-building"></i>
        </div>
        <div class="partner-info">
          <h3>Partner Company {{ i }}</h3>
          <p class="text-muted">Healthcare</p>
          <div class="partner-stats">
            <span><i class="bi bi-people"></i> 150 Members</span>
            <span><i class="bi bi-calendar-event"></i> 12 Events</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Partner Dialog -->
    <AddPartnerDialog 
      v-if="showAddDialog"
      @close="showAddDialog = false"
      @submit="handleAddPartner"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AddPartnerDialog from '../components/AddPartnerDialog.vue'

export default defineComponent({
  name: 'Partners',
  components: {
    AddPartnerDialog
  },
  data() {
    return {
      searchQuery: '',
      showAddDialog: false
    }
  },
  methods: {
    handleAddPartner(partnerData) {
      console.log('New partner data:', partnerData)
      // Here you would typically make an API call to save the partner
      // After successful save:
      this.showAddDialog = false
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
</style>
