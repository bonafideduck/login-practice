<template>
  <div class="admin-page">
    <h1>Admin Panel</h1>
    <p class="description">
      Manage all user accounts. View, edit, and delete user credentials.
    </p>

    <div v-if="users.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No Users Found</h3>
      <p>Create some users first using the "Create User" page.</p>
      <router-link to="/create-user" class="create-link">
        Go to Create User
      </router-link>
    </div>

    <div v-else class="users-management">
      <div class="users-header">
        <h2>User Management ({{ users.length }} users)</h2>
        <button @click="refreshUsers" class="refresh-btn">
          <span class="refresh-icon">🔄</span>
          Refresh
        </button>
      </div>

      <div class="users-grid">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-header">
            <div class="user-info">
              <h3>{{ user.username }}</h3>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <div class="user-actions">
              <button @click="editUser(user)" class="edit-btn">
                <span class="btn-icon">✏️</span>
                Edit
              </button>
              <button @click="confirmDelete(user)" class="delete-btn">
                <span class="btn-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>

          <div class="user-details">
            <div class="detail-row">
              <label>Username:</label>
              <span class="username-display">{{ user.username }}</span>
            </div>
            <div class="detail-row">
              <label>Email:</label>
              <span class="email-display">{{ user.email }}</span>
            </div>
            <div class="detail-row">
              <label>Password:</label>
              <div class="password-display">
                <span v-if="!showPasswords[user.id]" class="password-hidden">
                  ••••••••
                </span>
                <span v-else class="password-visible">{{ user.password }}</span>
                <button
                  @click="togglePassword(user.id)"
                  class="toggle-password-btn"
                  :title="
                    showPasswords[user.id] ? 'Hide password' : 'Show password'
                  "
                >
                  {{ showPasswords[user.id] ? "👁️‍🗨️" : "👁️" }}
                </button>
              </div>
            </div>
            <div class="detail-row">
              <label>Created:</label>
              <span class="created-display">{{
                formatDate(user.createdAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="editingUser" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit User: {{ editingUser.username }}</h3>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>

        <form @submit.prevent="saveUser" class="edit-form">
          <div class="form-group">
            <label for="edit-username">Username</label>
            <input
              type="text"
              id="edit-username"
              v-model="editForm.username"
              required
              placeholder="Enter username"
            />
          </div>

          <div class="form-group">
            <label for="edit-email">Email</label>
            <input
              type="email"
              id="edit-email"
              v-model="editForm.email"
              required
              placeholder="Enter email address"
            />
          </div>

          <div class="form-group">
            <label for="edit-password">Password</label>
            <input
              type="password"
              id="edit-password"
              v-model="editForm.password"
              required
              placeholder="Enter new password"
            />
          </div>

          <div class="form-group">
            <label for="edit-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="edit-confirm-password"
              v-model="editForm.confirmPassword"
              required
              placeholder="Confirm password"
            />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="save-btn" :disabled="!isEditFormValid">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="userToDelete" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete User</h3>
          <button @click="cancelDelete" class="close-btn">×</button>
        </div>

        <div class="delete-content">
          <div class="warning-icon">⚠️</div>
          <p>
            Are you sure you want to delete user
            <strong>{{ userToDelete.username }}</strong
            >?
          </p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>

        <div class="modal-actions">
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
          <button @click="deleteUser" class="delete-confirm-btn">
            Delete User
          </button>
        </div>
      </div>
    </div>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminPage",
  data() {
    return {
      users: [],
      showPasswords: {},
      editingUser: null,
      editForm: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      userToDelete: null,
      message: "",
      messageType: "",
    };
  },
  computed: {
    isEditFormValid() {
      return (
        this.editForm.username &&
        this.editForm.email &&
        this.editForm.password &&
        this.editForm.password === this.editForm.confirmPassword &&
        this.editForm.password.length >= 6
      );
    },
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      const savedUsers = localStorage.getItem("loginPracticeUsers");
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
        // Initialize password visibility state
        this.users.forEach((user) => {
          this.$set(this.showPasswords, user.id, false);
        });
      }
    },

    refreshUsers() {
      this.loadUsers();
      this.showMessage("Users refreshed", "success");
    },

    togglePassword(userId) {
      this.$set(this.showPasswords, userId, !this.showPasswords[userId]);
    },

    editUser(user) {
      this.editingUser = user;
      this.editForm = {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.password,
      };
    },

    saveUser() {
      if (!this.isEditFormValid) {
        this.showMessage("Please fill in all fields correctly", "error");
        return;
      }

      // Check if username already exists (excluding current user)
      const usernameExists = this.users.some(
        (user) =>
          user.username === this.editForm.username &&
          user.id !== this.editingUser.id
      );

      if (usernameExists) {
        this.showMessage("Username already exists", "error");
        return;
      }

      // Update user
      const userIndex = this.users.findIndex(
        (user) => user.id === this.editingUser.id
      );
      if (userIndex !== -1) {
        this.users[userIndex] = {
          ...this.users[userIndex],
          username: this.editForm.username,
          email: this.editForm.email,
          password: this.editForm.password,
        };
        this.saveUsers();
        this.closeEditModal();
        this.showMessage("User updated successfully!", "success");
      }
    },

    closeEditModal() {
      this.editingUser = null;
      this.editForm = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    },

    confirmDelete(user) {
      this.userToDelete = user;
    },

    deleteUser() {
      if (this.userToDelete) {
        this.users = this.users.filter(
          (user) => user.id !== this.userToDelete.id
        );
        this.saveUsers();
        this.cancelDelete();
        this.showMessage("User deleted successfully", "success");
      }
    },

    cancelDelete() {
      this.userToDelete = null;
    },

    saveUsers() {
      localStorage.setItem("loginPracticeUsers", JSON.stringify(this.users));
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
        this.messageType = "";
      }, 3000);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

.create-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.create-link:hover {
  transform: translateY(-2px);
}

.users-management {
  margin-top: 2rem;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.users-header h2 {
  color: #333;
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.refresh-btn:hover {
  background: #5a6268;
}

.refresh-icon {
  font-size: 1rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-info h3 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #17a2b8;
  color: white;
}

.edit-btn:hover {
  background: #138496;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.btn-icon {
  font-size: 0.9rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 600;
  color: #555;
  min-width: 80px;
}

.username-display,
.email-display,
.created-display {
  color: #333;
  font-family: monospace;
}

.password-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.password-hidden,
.password-visible {
  font-family: monospace;
  font-size: 0.9rem;
}

.password-hidden {
  color: #666;
}

.password-visible {
  color: #dc3545;
  font-weight: 600;
}

.toggle-password-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.toggle-password-btn:hover {
  background-color: #f8f9fa;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #f8f9fa;
}

.edit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e1e5e9;
}

.cancel-btn,
.save-btn,
.delete-confirm-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-confirm-btn {
  background: #dc3545;
  color: white;
}

.delete-confirm-btn:hover {
  background: #c82333;
}

.delete-modal {
  max-width: 400px;
}

.delete-content {
  padding: 1.5rem;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.delete-content p {
  margin-bottom: 1rem;
  color: #333;
}

.warning-text {
  color: #dc3545;
  font-weight: 600;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .users-grid {
    grid-template-columns: 1fr;
  }

  .user-header {
    flex-direction: column;
    gap: 1rem;
  }

  .user-actions {
    align-self: stretch;
    justify-content: space-between;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>
