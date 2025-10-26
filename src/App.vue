<template>
  <div class="app">
    <div class="sidebar">
      <h2>Login Practice</h2>
      <nav>
        <router-link to="/" class="nav-item">
          <span class="nav-icon">🏠</span>
          Home
        </router-link>
        <router-link to="/create-user" class="nav-item">
          <span class="nav-icon">👤</span>
          Create User
        </router-link>
        <router-link to="/one-step-login" class="nav-item">
          <span class="nav-icon">🔐</span>
          1-Step Login
        </router-link>
        <router-link to="/two-step-login" class="nav-item">
          <span class="nav-icon">🔑</span>
          2-Step Login
        </router-link>
        <router-link to="/change-password" class="nav-item">
          <span class="nav-icon">🔒</span>
          Change Password
        </router-link>
        <router-link to="/admin" class="nav-item">
          <span class="nav-icon">⚙️</span>
          Admin Panel
        </router-link>
      </nav>
    </div>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
}

.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: white;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 1rem;
  }

  nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-item {
    white-space: nowrap;
    min-width: 120px;
  }

  .main-content {
    margin: 0.5rem;
    padding: 1rem;
  }
}
</style>
