# Login Practice - Architecture Documentation

## Project Overview

A Vue.js application designed for practicing password manager usage. The application provides three different login scenarios to help users become familiar with how password managers interact with various login forms.

## Technology Stack

- **Frontend Framework**: Vue.js 3.4.0 with Composition API
- **Build Tool**: Vite 5.0.0
- **Package Manager**: pnpm 8.15.0
- **Routing**: Vue Router 4.2.5
- **Styling**: CSS3 with modern features (Grid, Flexbox, CSS Variables)
- **Storage**: Browser localStorage for data persistence
- **Deployment**: GitHub Pages

## Project Structure

```
login-practice/
├── .cursor/
│   └── rules                    # Cursor IDE rules for architecture updates
├── .npmrc                       # pnpm configuration
├── src/
│   ├── components/
│   │   ├── LandingPage.vue      # Landing page with app description and safety info
│   │   ├── CreateUser.vue       # User creation form with validation
│   │   ├── OneStepLogin.vue     # Single-screen login (username + password)
│   │   ├── TwoStepLogin.vue     # Two-step login (separate screens)
│   │   └── AdminPage.vue        # Admin panel for user management
│   ├── App.vue                  # Main application component with sidebar
│   └── main.js                  # Application entry point and routing
├── index.html                   # Development HTML template (with unsafe CSP)
├── index.development.html       # Backup of development HTML template
├── index.production.html         # Production HTML template (strict CSP)
├── package.json                 # Dependencies and scripts with pnpm configuration
├── pnpm-workspace.yaml          # pnpm workspace configuration
├── vite.config.js              # Vite configuration with CSP build plugin
└── Architecture.md              # This file
```

## Component Architecture

### LandingPage.vue

- **Purpose**: Welcome page explaining the application's purpose and safety information
- **Features**:
  - Hero section with application description
  - Feature overview cards explaining each practice scenario
  - Comprehensive safety section with security warnings
  - Getting started guide with step-by-step instructions
  - Call-to-action button to begin practicing
  - Responsive design with modern UI elements
- **Data Flow**: Static content display with navigation to other components

### App.vue (Root Component)

- **Purpose**: Main application layout with sidebar navigation
- **Features**:
  - Responsive sidebar with three navigation items
  - Router view for component rendering
  - Modern gradient design with mobile responsiveness
- **Dependencies**: Vue Router

### CreateUser.vue

- **Purpose**: User account creation interface
- **Features**:
  - Form validation (username uniqueness, password confirmation)
  - Real-time form validation feedback
  - User management (create/delete users)
  - localStorage integration for data persistence
- **Data Flow**: Form data → Validation → localStorage → UI update

### OneStepLogin.vue

- **Purpose**: Single-screen login practice
- **Features**:
  - Username and password on same form
  - Login attempt tracking and history
  - Success/failure feedback
  - Password manager autocomplete support
- **Data Flow**: Form data → User lookup → Authentication → Attempt logging

### TwoStepLogin.vue

- **Purpose**: Multi-step login practice
- **Features**:
  - Step-by-step progression (username → password)
  - Visual step indicator
  - Back navigation between steps
  - Separate attempt tracking from OneStepLogin
- **Data Flow**: Step 1 (username) → Step 2 (password) → Authentication → Attempt logging

### AdminPage.vue

- **Purpose**: Administrative interface for user management
- **Features**:
  - View all users with credentials (with password visibility toggle)
  - Edit user information (username, email, password)
  - Delete users with confirmation dialog
  - Real-time user count and refresh functionality
  - Empty state when no users exist
  - Modal-based editing and deletion workflows
- **Data Flow**: Load users → Display grid → Edit/Delete → Update localStorage → Refresh UI

## Data Management

### localStorage Schema

```javascript
// User accounts
loginPracticeUsers: [
  {
    id: number,
    username: string,
    email: string,
    password: string,
    createdAt: string(ISO),
  },
];

// Login attempts for 1-step login
oneStepLoginAttempts: [
  {
    id: number,
    username: string,
    timestamp: string(ISO),
    success: boolean,
  },
];

// Login attempts for 2-step login
twoStepLoginAttempts: [
  {
    id: number,
    username: string,
    timestamp: string(ISO),
    success: boolean,
  },
];
```

## Routing Configuration

- **Landing Page**: `/` (home page with app description and safety info)
- **Create User**: `/create-user`
- **1-Step Login**: `/one-step-login`
- **2-Step Login**: `/two-step-login`
- **Admin Panel**: `/admin`

## Design Patterns

### Component Communication

- **Props Down, Events Up**: Standard Vue.js pattern
- **localStorage**: Shared data persistence across components
- **Router**: Navigation between different login scenarios

### State Management

- **Local Component State**: Each component manages its own form state
- **Persistent State**: User data and login attempts stored in localStorage
- **No Global State**: No Vuex/Pinia needed for current scope

### Form Handling

- **Validation**: Client-side validation with real-time feedback
- **Accessibility**: Proper labels, autocomplete attributes, and focus management
- **UX**: Loading states, success/error messages, and smooth transitions

## Security Considerations

- **Client-Side Only**: All authentication is simulated (no real security)
- **Password Storage**: Passwords stored in plain text (for practice purposes only)
- **Content Security Policy**: Restrictive CSP implemented to prevent XSS attacks
- **No HTTPS Requirement**: Suitable for local development and GitHub Pages

### Content Security Policy (CSP)

The application implements a restrictive CSP with the following directives:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' ws: wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
"
/>
```

**CSP Directives Explained:**

- `default-src 'self'`: Only allow resources from same origin
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'`: Required for Vue.js and Vite development
- `style-src 'self' 'unsafe-inline'`: Allow inline styles for Vue components
- `img-src 'self' data: blob:`: Allow images from same origin and data URLs
- `font-src 'self' data:`: Allow fonts from same origin and data URLs
- `connect-src 'self' ws: wss:`: Allow WebSocket connections for Vite HMR
- `object-src 'none'`: Block all object, embed, and applet elements
- `base-uri 'self'`: Restrict base element to same origin
- `form-action 'self'`: Restrict form submissions to same origin
- `frame-ancestors 'none'`: Prevent embedding in frames/iframes
- `upgrade-insecure-requests`: Automatically upgrade HTTP to HTTPS

## Package Management

### pnpm Configuration

- **Package Manager**: pnpm 8.15.0 (specified in package.json)
- **Engine Requirements**: Node.js >=16.0.0, pnpm >=8.0.0
- **Prevention Script**: preinstall script prevents accidental npm usage
- **Configuration Files**:
  - `.npmrc`: pnpm-specific settings (auto-install-peers, strict-peer-dependencies)
  - `pnpm-workspace.yaml`: Workspace configuration for monorepo support

### npm Prevention

The project includes a preinstall script that detects and prevents npm usage:

```javascript
"preinstall": "node -e \"if(process.env.npm_execpath.indexOf('pnpm') === -1) throw new Error('Please use pnpm instead of npm')\""
```

## Deployment Configuration

### GitHub Pages Setup

- **Repository**: `git@github.com:bonafideduck/login-practice.git`
- **Base Path**: `/login-practice/` (configured in vite.config.js)
- **Build Command**: `pnpm run build`
- **Deploy Command**: `pnpm run deploy` (uses gh-pages package)

### Build Process

1. **Production CSP**: Vite plugin automatically switches to strict CSP during build
2. **Asset Bundling**: Vite builds the application to `dist/` directory with bundled assets
3. **CSP Restoration**: Development CSP is restored after build completion
4. **Deployment**: gh-pages package pushes `dist/` contents to `gh-pages` branch

### CSP Build Configuration

The build process automatically handles CSP differences between development and production:

**Development CSP** (`index.html`):

```html
script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self'
'unsafe-inline';
```

**Production CSP** (`index.production.html`):

```html
script-src 'self'; style-src 'self';
```

**Build Process**:

1. `pnpm build` sets `NODE_ENV=production`
2. Vite plugin swaps `index.html` with `index.production.html`
3. Build completes with strict CSP
4. Development HTML template is restored

## Development Guidelines

### Code Style

- **Vue SFC**: Single File Components with `<template>`, `<script>`, and `<style scoped>`
- **Modern CSS**: Flexbox, Grid, CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Component Naming

- **PascalCase**: Component files use PascalCase (e.g., `CreateUser.vue`)
- **Descriptive Names**: Component names clearly indicate their purpose
- **Consistent Structure**: All components follow similar structure patterns

## Future Enhancements

- **Additional Login Types**: OAuth, biometric, hardware key simulation
- **Password Manager Testing**: Specific scenarios for different password managers
- **Analytics**: Usage tracking and practice session metrics
- **Customization**: User-configurable login scenarios and themes

## Maintenance Notes

- **Architecture Updates**: Any structural changes must be documented in this file
- **Dependency Updates**: Regular updates to Vue.js, Vite, and other dependencies
- **Browser Compatibility**: Test across modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: Monitor bundle size and loading times as features are added
