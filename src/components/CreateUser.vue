<template>
  <div class="create-user">
    <h1>Create New User</h1>
    <p class="description">
      Create a new user account to practice with your password manager.
    </p>

    <form @submit.prevent="createUser" class="user-form">
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
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          placeholder="Enter email address"
          autocomplete="email"
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
          autocomplete="new-password"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          required
          placeholder="Confirm password"
          autocomplete="new-password"
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="!isFormValid">
        Create User
      </button>
    </form>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <div v-if="users.length > 0" class="users-list">
      <h3>Existing Users</h3>
      <div class="user-cards">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-info">
            <strong>{{ user.username }}</strong>
            <span>{{ user.email }}</span>
          </div>
          <button @click="deleteUser(user.id)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateUser",
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      message: "",
      messageType: "",
      users: [],
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.username &&
        this.form.email &&
        this.form.password &&
        this.form.password === this.form.confirmPassword &&
        this.form.password.length >= 6
      );
    },
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    createUser() {
      if (!this.isFormValid) {
        this.showMessage("Please fill in all fields correctly", "error");
        return;
      }

      // Check if username already exists
      if (this.users.some((user) => user.username === this.form.username)) {
        this.showMessage("Username already exists", "error");
        return;
      }

      const newUser = {
        id: Date.now(),
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
        createdAt: new Date().toISOString(),
      };

      this.users.push(newUser);
      this.saveUsers();
      this.resetForm();
      this.showMessage("User created successfully!", "success");
    },

    deleteUser(userId) {
      this.users = this.users.filter((user) => user.id !== userId);
      this.saveUsers();
      this.showMessage("User deleted successfully", "success");
    },

    resetForm() {
      this.form = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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

    saveUsers() {
      localStorage.setItem("loginPracticeUsers", JSON.stringify(this.users));
    },

    loadUsers() {
      const savedUsers = localStorage.getItem("loginPracticeUsers");
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
    },
  },
};
</script>

<style scoped>
.create-user {
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

.user-form {
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

.submit-btn {
  width: 100%;
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

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
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

.users-list {
  margin-top: 2rem;
}

.users-list h3 {
  color: #333;
  margin-bottom: 1rem;
}

.user-cards {
  display: grid;
  gap: 1rem;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-info strong {
  color: #333;
}

.user-info span {
  color: #666;
  font-size: 0.9rem;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>
