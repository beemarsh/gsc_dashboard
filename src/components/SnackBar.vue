<template>
  <div 
    v-if="show"
    :class="['snackbar', type]"
    @click="$emit('close')"
  >
    <div class="snackbar-content">
      <i :class="icon"></i>
      {{ message }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SnackBar',
  props: {
    show: Boolean,
    message: String,
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    }
  },
  computed: {
    icon() {
      return {
        success: 'bi bi-check-circle',
        error: 'bi bi-x-circle'
      }[this.type]
    }
  }
})
</script>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  z-index: 2000;
  cursor: pointer;
  animation: slideUp 0.3s ease;
}

.snackbar.success {
  background-color: #28a745;
}

.snackbar.error {
  background-color: #dc3545;
}

.snackbar-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>
