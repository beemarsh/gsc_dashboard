<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Create an account</h2>
      <p>Enter your details to register</p>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <form @submit.prevent="registerWithEmail">
        <input type="text" placeholder="Full Name" v-model="name" @keyup.enter="registerWithEmail" />
        <input type="email" placeholder="Email address" v-model="email" @keyup.enter="registerWithEmail" />
        <input type="password" placeholder="Password" v-model="password" @keyup.enter="registerWithEmail" />
        <input type="password" placeholder="Confirm Password" v-model="confirmPassword" @keyup.enter="registerWithEmail" />
        <button type="submit" class="register-button">Register</button>
      </form>
      <button class="google-button" @click="registerWithGoogle">
        <img src="@/assets/google-icon.png" alt="Google icon" /> Register with Google
      </button>
      <div class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_URL } from '../../env.js';

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    validatePassword(password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    },
    async registerWithEmail() {
      try {
        this.errorMessage = ''; // Clear previous errors

        // Basic validations
        if (!this.name || !this.email || !this.password) {
          this.errorMessage = 'All fields are required';
          return;
        }

        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Passwords do not match';
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          this.errorMessage = 'Please enter a valid email address';
          return;
        }

        // Password validation
        if (!this.validatePassword(this.password)) {
          this.errorMessage = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
          return;
        }

        const response = await fetch(`${SERVER_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Redirect to login page on successful registration
          this.$router.push('/login');
        } else {
          this.errorMessage = data.message || 'Please provide proper details.';
        }
      } catch (err) {
        this.errorMessage = 'An error occurred during registration';
        console.error('Registration error:', err);
      }
    },
    registerWithGoogle() {
      // Implement Google OAuth registration
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
  background-color: #ffffff;
  width: 100%;
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-form h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.register-form p {
  margin-bottom: 1.5rem;
  color: #666;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: left;
  font-size: 0.875rem;
}

.register-form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.google-button {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-button img {
  height: 20px;
  margin-right: 0.5rem;
}

.login-link {
  font-size: 0.875rem;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

@media (max-width: 768px) {
  .register-form {
    padding: 1.5rem;
  }
}
</style>