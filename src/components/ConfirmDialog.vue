<template>
  <div class="dialog-backdrop" @click="$emit('cancel')">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('cancel')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="dialog-body">
        <p>{{ message }}</p>
      </div>
      <div class="dialog-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="$emit('cancel')"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button 
          type="button" 
          class="btn btn-danger"
          @click="$emit('confirm')"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    title: {
      type: String,
      default: 'Confirm Delete'
    },
    message: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.dialog-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header button{
  background-color: transparent;
  outline: none;
  border: none;
}

.dialog-header h3 {
  margin: 0;
  color: #dc3545;
  font-size: 1.25rem;
}

.dialog-body {
  padding: 1rem;
  color: #000;
}

.dialog-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
