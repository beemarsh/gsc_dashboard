<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Welcome back</h2>
      <p>Please enter your details</p>
      <div v-if="error" class="error-message">{{ error }}</div>
      <form @submit.prevent="loginWithEmail">
        <input type="email" placeholder="Email address" v-model="email" @keyup.enter="loginWithEmail" />
        <input type="password" placeholder="Password" v-model="password" @keyup.enter="loginWithEmail" />
        <div class="options">
          <label>
            <input type="checkbox" /> Remember for 30 days
          </label>
          <router-link to="/forgot-password">Forgot password</router-link>
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <button class="google-button" @click="loginWithGoogle">
        <img src="@/assets/google-icon.png" alt="Google icon" /> Sign in with Google
      </button>
      <div class="signup-link">
        Don't have an account? <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { SERVER_URL } from '../../env.js'

export default defineComponent({
  name: 'LoginPage',
  mounted() {
    document.title = 'Login - GSC Health'
  },
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validatePassword(password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    },
    async loginWithEmail() {
      try {
        // Reset error message
        this.error = '';

        // Validate email
        if (!this.validateEmail(this.email)) {
          this.error = 'Invalid email address';
          return;
        }

        // Validate password
        if (!this.validatePassword(this.password)) {
          this.error = 'Password must be at least 8 characters long and uppercase, lowercase letter, and a number';
          return;
        }

        const response = await fetch(`${SERVER_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Store the token if provided in the response
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          // Redirect to dashboard
          this.$router.push('/dashboard');
        } else {
          this.error = data.message || 'Your username or password is wrong.';
        }
      } catch (err) {
        this.error = 'An error occurred during login';
        console.error('Login error:', err);
      }
    },
    loginWithGoogle() {
      // Implement Google OAuth login
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px); /* Adjust the height to be screen height minus navbar height */
  background-color: #ffffff;
  width: 100%;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-form h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: #666;
}

.login-form p {
  margin-bottom: 1.5rem;
  color: #666;
}

.login-form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.options label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.options a {
  font-size: 0.875rem;
  color: #007bff;
  text-decoration: none;
}

.login-button {
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

.signup-link {
  font-size: 0.875rem;
  color: #666;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

@media (max-width: 768px) {
  .login-form {
    padding: 1.5rem;
  }
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
</style>