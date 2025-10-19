# Login Practice

A Vue.js application designed for practicing password manager usage. This application provides three different login scenarios to help users become familiar with how password managers interact with various login forms.

## Features

- **Create User**: Create new user accounts with form validation
- **1-Step Login**: Practice logging in with username and password on a single screen
- **2-Step Login**: Practice logging in with separate username and password screens
- **Login History**: Track login attempts and success rates
- **Responsive Design**: Works on desktop and mobile devices
- **Password Manager Support**: Proper autocomplete attributes for password managers

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (version 8 or higher)

### Installation

1. Clone the repository:

```bash
git clone git@github.com:bonafideduck/login-practice.git
cd login-practice
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

### Deploying to GitHub Pages

```bash
pnpm deploy
```

### Package Manager

This project uses **pnpm** as the package manager. The project is configured to prevent accidental usage of npm or yarn. If you try to run `npm install`, you'll get an error message directing you to use pnpm instead.

## Usage

1. **Create User**: Start by creating user accounts using the "Create User" screen
2. **Practice Login**: Use the "1-Step Login" or "2-Step Login" screens to practice with your password manager
3. **Track Progress**: View your login attempts and success rates in each screen

## Technology Stack

- Vue.js 3.4.0
- Vue Router 4.2.5
- Vite 5.0.0
- pnpm (package manager)
- CSS3 with modern features
- localStorage for data persistence

## Contributing

This is a personal project for password manager practice. Feel free to fork and modify for your own use.

## License

This project is open source and available under the [MIT License](LICENSE).
