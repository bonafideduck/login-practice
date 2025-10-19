<template>
  <div class="one-step-login">
    <h1>1-Step Login</h1>
    <p class="description">
      Practice logging in with username and password on a single screen.
    </p>

    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          required
          placeholder="Enter username"
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          placeholder="Enter password"
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="login-btn" :disabled="!isFormValid">
        Login
      </button>
    </form>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <div v-if="loginAttempts.length > 0" class="attempts-list">
      <h3>Recent Login Attempts</h3>
      <div class="attempt-cards">
        <div
          v-for="attempt in loginAttempts"
          :key="attempt.id"
          class="attempt-card"
        >
          <div class="attempt-info">
            <span class="username">{{ attempt.username }}</span>
            <span class="timestamp">{{ formatTime(attempt.timestamp) }}</span>
          </div>
          <span class="status" :class="attempt.success ? 'success' : 'failed'">
            {{ attempt.success ? "✓ Success" : "✗ Failed" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OneStepLogin",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      message: "",
      messageType: "",
      loginAttempts: [],
    };
  },
  computed: {
    isFormValid() {
      return this.form.username && this.form.password;
    },
  },
  mounted() {
    this.loadLoginAttempts();
  },
  methods: {
    login() {
      if (!this.isFormValid) {
        this.showMessage("Please enter both username and password", "error");
        return;
      }

      const users = this.getUsers();
      const user = users.find((u) => u.username === this.form.username);

      const attempt = {
        id: Date.now(),
        username: this.form.username,
        timestamp: new Date().toISOString(),
        success: user && user.password === this.form.password,
      };

      this.loginAttempts.unshift(attempt);
      this.saveLoginAttempts();

      if (attempt.success) {
        this.showMessage("Login successful!", "success");
        this.resetForm();
      } else {
        this.showMessage("Invalid username or password", "error");
      }
    },

    resetForm() {
      this.form = {
        username: "",
        password: "",
      };
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
        this.messageType = "";
      }, 3000);
    },

    getUsers() {
      const savedUsers = localStorage.getItem("loginPracticeUsers");
      return savedUsers ? JSON.parse(savedUsers) : [];
    },

    saveLoginAttempts() {
      // Keep only last 10 attempts
      this.loginAttempts = this.loginAttempts.slice(0, 10);
      localStorage.setItem(
        "oneStepLoginAttempts",
        JSON.stringify(this.loginAttempts)
      );
    },

    loadLoginAttempts() {
      const savedAttempts = localStorage.getItem("oneStepLoginAttempts");
      if (savedAttempts) {
        this.loginAttempts = JSON.parse(savedAttempts);
      }
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
  },
};
</script>

<style scoped>
.one-step-login {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.login-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.attempts-list {
  margin-top: 2rem;
}

.attempts-list h3 {
  color: #333;
  margin-bottom: 1rem;
}

.attempt-cards {
  display: grid;
  gap: 0.75rem;
}

.attempt-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.attempt-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username {
  font-weight: 600;
  color: #333;
}

.timestamp {
  color: #666;
  font-size: 0.9rem;
}

.status {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.status.success {
  background-color: #d4edda;
  color: #155724;
}

.status.failed {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
