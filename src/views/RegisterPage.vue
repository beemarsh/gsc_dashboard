<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Create an account</h2>
      <p>Enter your details to register</p>
      <input type="text" placeholder="Full Name" v-model="name" />
      <input type="email" placeholder="Email address" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="password" placeholder="Confirm Password" v-model="confirmPassword" />
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button class="register-button" @click="registerWithEmail">Register</button>
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
    registerWithEmail() {
      this.errorMessage = ''; // Clear previous errors

      if (!this.name) {
        this.errorMessage = 'Please enter your name.';
        return;
      }
      if (!this.email) {
        this.errorMessage = 'Please enter your email.';
        return;
      }
      if (!this.password) {
        this.errorMessage = 'Please enter your password.';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }

      // Password validation (example: at least 8 characters)
      if (this.password.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters long.';
        return;
      }

      // Implement registration logic here (e.g., API call)
      alert('Registration successful!');
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
  color: red;
  margin-bottom: 1rem;
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