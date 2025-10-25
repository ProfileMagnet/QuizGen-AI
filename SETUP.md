# QuizGen-AI Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QuizGen-AI
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React & React DOM
- React Router DOM
- Tailwind CSS v3
- TypeScript
- Vite
- And all other necessary packages

### 3. Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173/`

### 4. Open in Browser

Navigate to `http://localhost:5173/` in your web browser to see the application running.

## Available Scripts

- **`npm run dev`** - Starts the development server
- **`npm run build`** - Builds the app for production
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality

## Configuration Files

The project includes the following configuration files:

- **`postcss.config.js`** - PostCSS configuration for Tailwind CSS
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration
- **`vite.config.ts`** - Vite bundler configuration
- **`eslint.config.js`** - ESLint configuration

## Project Structure

```
QuizGen-AI/
├── public/              # Static assets
├── src/                 # Source code
│   ├── sections/        # Page sections/components
│   ├── AnimatedBackground/ # Background animation components
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
└── package.json         # Project dependencies
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

### Dependencies Installation Issues

If you encounter issues during `npm install`, try:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Build Errors

Make sure you're using Node.js v18 or higher:

```bash
node --version
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Styling framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

## Need Help?

If you encounter any issues during setup, please:
1. Check that all prerequisites are installed
2. Make sure you're using the correct Node.js version
3. Try the troubleshooting steps above
4. Contact the development team

---

**Happy coding! 🚀**
