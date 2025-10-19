<template>
  <div class="two-step-login">
    <h1>2-Step Login</h1>
    <p class="description">
      Practice logging in with separate username and password screens.
    </p>

    <!-- Step 1: Username -->
    <div v-if="currentStep === 1" class="step-container">
      <div class="step-indicator">
        <span class="step active">1</span>
        <span class="step-line"></span>
        <span class="step">2</span>
      </div>

      <h2>Step 1: Enter Username</h2>

      <form @submit.prevent="submitUsername" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            placeholder="Enter username"
            autocomplete="username"
            ref="usernameInput"
          />
        </div>

        <button type="submit" class="next-btn" :disabled="!form.username">
          Next Step
        </button>
      </form>
    </div>

    <!-- Step 2: Password -->
    <div v-if="currentStep === 2" class="step-container">
      <div class="step-indicator">
        <span class="step completed">1</span>
        <span class="step-line completed"></span>
        <span class="step active">2</span>
      </div>

      <h2>Step 2: Enter Password</h2>
      <p class="username-display">
        Logging in as: <strong>{{ form.username }}</strong>
      </p>

      <form @submit.prevent="submitPassword" class="login-form">
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            placeholder="Enter password"
            autocomplete="current-password"
            ref="passwordInput"
          />
        </div>

        <div class="button-group">
          <button type="button" @click="goBack" class="back-btn">Back</button>
          <button type="submit" class="login-btn" :disabled="!form.password">
            Login
          </button>
        </div>
      </form>
    </div>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <div v-if="loginAttempts.length > 0" class="attempts-list">
      <h3>Recent 2-Step Login Attempts</h3>
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
  name: "TwoStepLogin",
  data() {
    return {
      currentStep: 1,
      form: {
        username: "",
        password: "",
      },
      message: "",
      messageType: "",
      loginAttempts: [],
    };
  },
  mounted() {
    this.loadLoginAttempts();
    this.$nextTick(() => {
      this.focusInput();
    });
  },
  methods: {
    submitUsername() {
      if (!this.form.username) {
        this.showMessage("Please enter a username", "error");
        return;
      }

      this.currentStep = 2;
      this.$nextTick(() => {
        this.focusInput();
      });
    },

    submitPassword() {
      if (!this.form.password) {
        this.showMessage("Please enter a password", "error");
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
        this.showMessage("Invalid password", "error");
        this.form.password = "";
        this.$nextTick(() => {
          this.focusInput();
        });
      }
    },

    goBack() {
      this.currentStep = 1;
      this.form.password = "";
      this.$nextTick(() => {
        this.focusInput();
      });
    },

    resetForm() {
      this.currentStep = 1;
      this.form = {
        username: "",
        password: "",
      };
      this.$nextTick(() => {
        this.focusInput();
      });
    },

    focusInput() {
      const input =
        this.currentStep === 1
          ? this.$refs.usernameInput
          : this.$refs.passwordInput;
      if (input) {
        input.focus();
      }
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
        "twoStepLoginAttempts",
        JSON.stringify(this.loginAttempts)
      );
    },

    loadLoginAttempts() {
      const savedAttempts = localStorage.getItem("twoStepLoginAttempts");
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
.two-step-login {
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

.step-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background-color: #e1e5e9;
  color: #666;
}

.step.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.step.completed {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.step-line {
  width: 60px;
  height: 2px;
  background-color: #e1e5e9;
  margin: 0 1rem;
}

.step-line.completed {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

h2 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.username-display {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
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

.button-group {
  display: flex;
  gap: 1rem;
}

.next-btn,
.login-btn {
  flex: 1;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.login-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.next-btn:hover:not(:disabled),
.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.next-btn:disabled,
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-btn {
  flex: 1;
  padding: 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  background: #5a6268;
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
