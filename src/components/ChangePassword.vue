<template>
  <div class="change-password">
    <h1>Change Password</h1>
    <p class="description">Select a username, enter your old password, then choose a new password and verify it.</p>

    <form @submit.prevent="handleSubmit" class="change-form">
      <div class="form-group">
        <label for="username">Username</label>
        <select id="username" v-model="form.username" required>
          <option v-for="user in users" :key="user.id" :value="user.username">
            {{ user.username }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="old-password">Old Password</label>
        <input
          id="old-password"
          type="password"
          v-model="form.oldPassword"
          autocomplete="current-password"
          required
          placeholder="Enter current password"
        />
      </div>

      <div class="form-group">
        <label for="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          v-model="form.newPassword"
          autocomplete="new-password"
          required
          placeholder="Enter new password (min 6 chars)"
        />
      </div>

      <div class="form-group">
        <label for="verify-password">Verify New Password</label>
        <input
          id="verify-password"
          type="password"
          v-model="form.verifyPassword"
          autocomplete="new-password"
          required
          placeholder="Re-enter new password"
        />
      </div>

      <div class="actions">
        <button type="submit" :disabled="!isFormValid" class="save-btn">Change Password</button>
      </div>
    </form>

    <div v-if="message" class="message" :class="messageType">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",
  data() {
    return {
      users: [],
      form: {
        username: "",
        oldPassword: "",
        newPassword: "",
        verifyPassword: "",
      },
      message: "",
      messageType: "",
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.username &&
        this.form.oldPassword &&
        this.form.newPassword &&
        this.form.newPassword === this.form.verifyPassword &&
        this.form.newPassword.length >= 6
      );
    },
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      const saved = localStorage.getItem("loginPracticeUsers");
      this.users = saved ? JSON.parse(saved) : [];

      // select most recently used username if available
      const recent = localStorage.getItem("mostRecentUsername");
      if (recent && this.users.some((u) => u.username === recent)) {
        this.form.username = recent;
      } else if (this.users.length > 0) {
        // default to first user
        this.form.username = this.users[0].username;
      }
    },

    handleSubmit() {
      const userIndex = this.users.findIndex(
        (u) => u.username === this.form.username
      );
      if (userIndex === -1) {
        this.showMessage("Selected user not found", "error");
        return;
      }

      const user = this.users[userIndex];

      if (user.password !== this.form.oldPassword) {
        this.showMessage("Old password is incorrect", "error");
        return;
      }

      if (this.form.newPassword !== this.form.verifyPassword) {
        this.showMessage("New passwords do not match", "error");
        return;
      }

      if (this.form.newPassword.length < 6) {
        this.showMessage("New password must be at least 6 characters", "error");
        return;
      }

      // update password
      this.users[userIndex].password = this.form.newPassword;
      localStorage.setItem("loginPracticeUsers", JSON.stringify(this.users));

      // save most recent username
      localStorage.setItem("mostRecentUsername", this.form.username);

      this.showMessage("Password changed successfully", "success");
      // clear sensitive fields
      this.form.oldPassword = "";
      this.form.newPassword = "";
      this.form.verifyPassword = "";
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
        this.messageType = "";
      }, 3000);
    },
  },
};
</script>

<style scoped>
.change-password {
  max-width: 700px;
  margin: 0 auto;
}

.description {
  color: #666;
  margin-bottom: 1rem;
}

.change-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
