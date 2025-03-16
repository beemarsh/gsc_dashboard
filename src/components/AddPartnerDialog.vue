<template>
  <div class="dialog-backdrop" @click="$emit('close')">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>Add New Partner</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="dialog-body">
        <div class="form-group">
          <label>Organization Name *</label>
          <input 
            type="text" 
            v-model="formData.organization_name"
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Contact Person *</label>
          <input 
            type="text" 
            v-model="formData.contact_person"
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Contact Email *</label>
          <input 
            type="email" 
            v-model="formData.contact_email"
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Phone Number *</label>
          <input 
            type="tel" 
            v-model="formData.phone_number"
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Address *</label>
          <textarea 
            v-model="formData.address"
            class="form-control" 
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Partner Type *</label>
          <select v-model="formData.type" class="form-control" required>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="distributor">Distributor</option>
          </select>
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea 
            v-model="formData.notes"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="dialog-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Add Partner
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddPartnerDialog',
  data() {
    return {
      formData: {
        organization_name: '',
        contact_person: '',
        contact_email: '',
        phone_number: '',
        address: '',
        type: 'supplier',
        notes: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      // Emit the form data to parent
      this.$emit('submit', this.formData)
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  color: #212529;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #6c757d;
}

.dialog-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #212529;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
}

.dialog-footer {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
