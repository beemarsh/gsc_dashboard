<template>
  <div class="events-container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Main Content (blur when loading) -->
    <div :class="{ 'content-blur': loading }">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 color="#666">Events</h1>
        
        <!-- Status Chips - Only visible on larger screens -->
        <div v-if="events.length > 0" class="event-status-chips d-none d-md-flex">
          <span v-if="hasExpiredEvents" class="badge bg-danger">
            <i class="bi bi-clock-history"></i> Expired Events
          </span>
          <span v-if="hasUpcomingEvents" class="badge bg-success">
            <i class="bi bi-calendar-check"></i> Upcoming Events
          </span>
        </div>

        <div class="d-flex gap-2 align-items-center search-controls">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Search events..." v-model="searchQuery">
          </div>
          <button class="btn btn-primary add-event-btn" @click="openAddEventDialog">
            <i class="bi bi-plus-lg"></i>
            <span class="d-none d-md-inline">Add Event</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && events.length === 0" class="empty-state">
        <i class="bi bi-calendar-x text-muted"></i>
        <h3>No Events Found</h3>
        <p class="text-muted">Get started by adding your first event</p>
      </div>

      <!-- Events Grid -->
      <div v-else-if="!loading && !error" class="events-grid">
        <div v-for="event in filteredEvents" :key="event.event_id" class="event-card">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ event.event_name }}</h5>
                <span :class="['status-badge', isExpired(event) ? 'expired' : 'upcoming']">
                  {{ isExpired(event) ? 'Expired' : 'Upcoming' }}
                </span>
              </div>
              <div class="event-details">
                <span><i class="bi bi-calendar"></i> {{ formatDateTime(event.event_datetime) }}</span>
                <span><i class="bi bi-person"></i> {{ event.organizer }}</span>
                <span><i class="bi bi-geo-alt"></i> {{ event.address }}</span>
              </div>
              <p class="card-text">{{ event.notes }}</p>
              <div class="card-actions">
                <button class="btn btn-sm btn-outline-primary" @click="editEvent(event)">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.event_id)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Event Dialog -->
  <AddEventDialog 
    v-if="showAddDialog"
    :editMode="!!editingEvent"
    :eventData="editingEvent"
    @close="closeDialog"
    @submit="handleEventSubmit"
  />

  <!-- Confirm Delete Dialog -->
  <ConfirmDialog
    v-if="showDeleteDialog"
    :message="`Are you sure you want to delete ${deletingEvent?.event_name}?`"
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
</template>

<script>
import { SERVER_URL } from '../../env.js'
import AddEventDialog from '../components/AddEventDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import SnackBar from '../components/SnackBar.vue'

export default {
  name: 'EventsPage',
  components: {
    AddEventDialog,
    ConfirmDialog,
    SnackBar
  },
  data() {
    return {
      searchQuery: '',
      events: [],
      loading: true,
      error: null,
      showAddDialog: false,
      editingEvent: null,
      showDeleteDialog: false,
      deletingEvent: null,
      isDeleting: false,
      notification: {
        message: '',
        type: 'success'
      }
    }
  },
  computed: {
    filteredEvents() {
      return this.events.filter(event => 
        event.event_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.notes?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    hasExpiredEvents() {
      return this.events.some(event => this.isExpired(event))
    },
    hasUpcomingEvents() {
      return this.events.some(event => !this.isExpired(event))
    }
  },
  methods: {
    async fetchEvents() {
      this.loading = true
      try {
        const response = await fetch(`${SERVER_URL}/event/get`, {
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
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        this.events = data.events || [];
      } catch (error) {
        console.error('Error fetching events:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString()
    },
    isExpired(event) {
      return new Date(event.event_datetime) < new Date()
    },
    showNotification(message, type = 'success') {
      this.notification = { message, type }
      setTimeout(this.clearNotification, type === 'success' ? 3000 : 10000)
    },
    
    clearNotification() {
      this.notification = { message: '', type: 'success' }
    },

    openAddEventDialog() {
      this.showAddDialog = true
    },

    closeDialog() {
      this.showAddDialog = false
      this.editingEvent = null
    },

    async handleEventSubmit(eventData, callbacks) {
      if (this.editingEvent) {
        await this.updateEvent(eventData, callbacks)
      } else {
        await this.addEvent(eventData, callbacks)
      }
    },

    async addEvent(eventData, callbacks) {
      try {
        const response = await fetch(`${SERVER_URL}/event/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(eventData)
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.details || 'Failed to add event')
        }

        this.showNotification('Event added successfully')
        await this.fetchEvents()
        callbacks?.success?.()
      } catch (error) {
        this.showNotification(error.message, 'error')
        callbacks?.error?.()
      }
    },

    async updateEvent(eventData, callbacks) {
      try {
        const response = await fetch(`${SERVER_URL}/event/edit?id=${this.editingEvent.event_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(eventData)
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.details || 'Failed to update event')
        }

        this.showNotification('Event updated successfully')
        await this.fetchEvents()
        callbacks?.success?.()
      } catch (error) {
        this.showNotification(error.message, 'error')
        callbacks?.error?.()
      }
    },

    editEvent(event) {
      this.editingEvent = event
      this.showAddDialog = true
    },

    async confirmDelete(event) {
      this.deletingEvent = event
      this.showDeleteDialog = true
    },

    async handleDeleteConfirm() {
      if (!this.deletingEvent) return
      this.isDeleting = true
      
      try {
        const response = await fetch(`${SERVER_URL}/event/delete?id=${this.deletingEvent.event_id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.details || 'Failed to delete event')
        }

        this.showNotification('Event deleted successfully')
        await this.fetchEvents()
      } catch (error) {
        this.showNotification(error.message, 'error')
      } finally {
        this.isDeleting = false
        this.showDeleteDialog = false
        this.deletingEvent = null
      }
    },

    deleteEvent(eventId) {
      const event = this.events.find(e => e.event_id === eventId)
      if (event) {
        this.confirmDelete(event)
      }
    }
  },
  async created() {
    await this.fetchEvents()
  }
}
</script>

<style scoped>
.events-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 1rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.event-card {
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-5px);
}

.event-details {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .input-group {
    flex-direction: column;
  }
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

.event-status-chips {
  display: flex;
  gap: 0.5rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.status-badge.expired {
  background-color: #dc3545;
  color: white;
}

.status-badge.upcoming {
  background-color: #198754;
  color: white;
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
  color: #6c757d;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #495057;
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

.search-controls {
  width: 100%;
  margin-top: 1rem;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.add-event-btn {
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

h1 {
    color: #666;
}

@media (max-width: 767px) {
  .events-container h1 {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .search-box input {
    padding: 8px 32px;
  }
  
  .add-event-btn {
    padding: 8px;
  }
}
</style>
