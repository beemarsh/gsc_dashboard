<template>
  <div class="dialog-overlay">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>{{ editMode ? 'Edit Event' : 'Add New Event' }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form>
        <div class="form-group">
          <label>Event Name</label>
          <input 
            type="text" 
            v-model="formData.event_name" 
            required
            :class="{ 'is-invalid': errors.event_name }"
          >
          <div class="invalid-feedback" v-if="errors.event_name">
            {{ errors.event_name }}
          </div>
        </div>

        <div class="form-group">
          <label>Date & Time</label>
          <VueDatePicker
            v-model="formData.event_datetime"
            :min-date="new Date()"
            :enable-time-picker="true"
            :format="'MM/dd/yyyy hh:mm a'"
            :auto-apply="true"
            required
            position="left"
            :class="{ 'is-invalid': errors.event_datetime }"
          />
          <div class="invalid-feedback" v-if="errors.event_datetime">
            {{ errors.event_datetime }}
          </div>
        </div>

        <div class="form-group">
          <label>Organizer</label>
          <input 
            type="text" 
            v-model="formData.organizer" 
            required
            :class="{ 'is-invalid': errors.organizer }"
          >
          <div class="invalid-feedback" v-if="errors.organizer">
            {{ errors.organizer }}
          </div>
        </div>

        <div class="form-group">
          <label>Address</label>
          <input 
            type="text" 
            v-model="formData.address" 
            required
            :class="{ 'is-invalid': errors.address }"
          >
          <div class="invalid-feedback" v-if="errors.address">
            {{ errors.address }}
          </div>
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea 
            v-model="formData.notes" 
            rows="3"
            :class="{ 'is-invalid': errors.notes }"
          ></textarea>
          <div class="invalid-feedback" v-if="errors.notes">
            {{ errors.notes }}
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('close')" :disabled="loading">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading" @click="validateAndSubmit">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ editMode ? 'Update' : 'Add' }} Event
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'AddEventDialog',
  components: {
    VueDatePicker
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    eventData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        event_name: '',
        event_datetime: new Date(),
        organizer: '',
        address: '',
        notes: ''
      },
      errors: {
        event_name: '',
        event_datetime: '',
        organizer: '',
        address: '',
        notes: ''
      }
    }
  },
  created() {
    if (this.editMode && this.eventData) {
      this.formData = {
        // Map server fields to form fields
        event_name: this.eventData.eventName || this.eventData.event_name,
        event_datetime: new Date(this.eventData.eventDateTime || this.eventData.event_datetime),
        organizer: this.eventData.organizer,
        address: this.eventData.address,
        notes: this.eventData.notes
      }
    }
  },
  methods: {
    formatDateForMySQL(date) {
      const pad = (num) => String(num).padStart(2, '0');
      
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    validateAndSubmit(e) {
      e.preventDefault(); // Prevent form submission
      
      // Reset errors
      this.errors = {
        event_name: '',
        event_datetime: '',
        organizer: '',
        address: '',
        notes: ''
      }

      // Validate event name
      if (!this.formData.event_name.trim()) {
        this.errors.event_name = 'Event name is required'
      } else if (this.formData.event_name.length < 3) {
        this.errors.event_name = 'Event name must be at least 3 characters'
      }

      // Validate date time
      if (!this.formData.event_datetime) {
        this.errors.event_datetime = 'Date and time is required'
      } else if (new Date(this.formData.event_datetime) < new Date()) {
        this.errors.event_datetime = 'Event date cannot be in the past'
      }

      // Validate organizer
      if (!this.formData.organizer.trim()) {
        this.errors.organizer = 'Organizer is required'
      }

      // Validate address
      if (!this.formData.address.trim()) {
        this.errors.address = 'Address is required'
      }

      // Check if there are any errors
      if (Object.values(this.errors).some(error => error)) {
        return;
      }

      // Format the data before submitting with the correct parameter names and date format
      const formattedData = {
        eventName: this.formData.event_name, // Ensure correct field name for server
        eventDateTime: this.formatDateForMySQL(this.formData.event_datetime),
        organizer: this.formData.organizer,
        address: this.formData.address,
        notes: this.formData.notes
      }

      // Set loading state
      this.loading = true;
      
      // Emit submit event with formatted data
      this.$emit('submit', formattedData, {
        success: () => {
          this.loading = false;
          this.$emit('close');
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  margin: 1rem;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
}

.btn-primary {
  background: #0d6efd;
  color: white;
  border: none;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

:deep(.dp__input) {
  padding: 0.5rem 2rem 0.5rem 0.5rem !important;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  height: 38px;
}

:deep(.dp__input_icon) {
  right: 0.5rem;
  transform: translateY(-50%);
}

:deep(.dp__clear_icon) {
  right: 1.8rem;
}

:deep(.dp__input_wrap) {
  position: relative;
}

:deep(.dp__input.is-invalid) {
  border-color: #dc3545;
}
</style>
