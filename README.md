# QuizGen-AI

A modern, AI-powered quiz generator application built with React, TypeScript, and Tailwind CSS. Generate intelligent quizzes from any topic with real-time insights and performance tracking.

## ✨ Features

### 🤖 AI-Powered Quiz Generation
- **Smart Question Generation**: Create 5 multiple-choice questions from any topic using Hugging Face AI models
- **Duplicate Prevention**: Automatically avoids generating similar questions when creating more quizzes
- **Topic Flexibility**: Works with any subject - from JavaScript to History, Biology to Literature

### 📊 Real-Time Learning Analytics
- **Live Progress Tracking**: Visual progress indicators showing completion status
- **Performance Insights**: Real-time accuracy calculations and performance levels
- **Smart Study Tips**: Personalized recommendations based on your performance
- **Detailed Statistics**: Track correct/incorrect answers with visual feedback

### 🎯 Interactive Quiz Experience
- **Step-by-Step Navigation**: Navigate through questions in manageable chunks (5 questions per step)
- **Instant Feedback**: Immediate response validation with correct answer explanations
- **Answer Locking**: Prevents accidental changes once an answer is selected
- **Review Mode**: Comprehensive review of all questions and answers with visual indicators

### 🎉 Engaging User Experience
- **Confetti Celebrations**: Animated celebrations when quizzes are generated
- **Loading Animations**: Smooth loading states during quiz generation
- **Responsive Design**: Optimized for desktop and mobile devices
- **Animated Background**: Dynamic visual effects for enhanced engagement

### 📄 Export & Sharing
- **PDF Export**: Export complete quizzes with correct answers for offline study
- **Clean Formatting**: Professional PDF layout for easy printing and sharing

### ⚡ Performance Optimized
- **Lazy Loading**: Components load on-demand for faster initial page load
- **Code Splitting**: Optimized bundle sizes with dynamic imports
- **Performance Monitoring**: Built-in performance tracking (development mode)
- **Service Worker**: Offline capabilities and caching

### 🎨 Modern UI/UX
- **Clean Interface**: Intuitive design with clear navigation
- **Visual Feedback**: Color-coded answers (correct/incorrect) and status indicators
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile-First**: Responsive design that works on all devices

## 🚀 Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🤖 AI Integration

This application integrates with a Hugging Face-powered quiz generation API to create intelligent quizzes from any topic.

### API Features
- **Endpoint**: `https://quiz-generator-from-text.onrender.com/`
- **Input**: Topic text + Hugging Face API key
- **Output**: 5 multiple-choice questions with 4 options each
- **Powered by**: Hugging Face AI models
- **Smart Generation**: Avoids duplicate questions when generating additional content

### Getting Your API Key
1. Visit [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new access token
3. Use it in the quiz generator form

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd QuizGen-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` to see the application.

## 📋 Prerequisites

- Node.js v18.0.0 or higher
- npm (comes with Node.js)

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run build:analyze` | Build with bundle analysis |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |
| `npm run clean` | Clean build artifacts |
| `npm run analyze` | Analyze bundle size and composition |

## 🎯 Usage Guide

### Creating Your First Quiz
1. **Navigate to Quiz Generator**: Click "Get Started" or visit `/quiz-generator`
2. **Enter Topic**: Provide any topic you want to create a quiz about
3. **Add API Key**: Enter your Hugging Face API key
4. **Generate**: Click "Generate Quiz" and watch the magic happen!

### Taking the Quiz
- **Step Navigation**: Navigate through questions in sets of 5
- **Answer Selection**: Click on options to select answers (locked once chosen)
- **Instant Feedback**: See immediate results with explanations
- **Progress Tracking**: Monitor your completion and accuracy in real-time

### Advanced Features
- **Generate More**: Add additional questions to your existing quiz
- **Review Mode**: Comprehensive review of all answers with visual feedback
- **Export PDF**: Download your quiz for offline study or sharing
- **Performance Insights**: Track your learning progress with detailed analytics

## 🏗️ Built With

### Core Technologies
- **React 19** - Latest UI library with concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS v3** - Utility-first CSS framework

### Key Libraries
- **React Router DOM v7** - Client-side routing and navigation
- **Lucide React** - Beautiful, customizable icons
- **jsPDF** - PDF generation for quiz exports
- **html2canvas** - Canvas-based screenshot functionality

### Performance & Optimization
- **Lazy Loading** - Dynamic component imports
- **Code Splitting** - Optimized bundle management
- **Service Worker** - Offline capabilities and caching
- **Bundle Analysis** - Performance monitoring tools

## 📁 Project Structure

```
QuizGen-AI/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── InsightsDashboard.tsx    # Real-time analytics
│   │   ├── ConfettiAnimation.tsx    # Celebration effects
│   │   ├── LoadingAnimation.tsx     # Loading states
│   │   ├── LazyComponents.tsx       # Lazy-loaded components
│   │   └── PerformanceMonitor.tsx   # Performance tracking
│   ├── sections/          # Page sections and layouts
│   │   ├── QuizGeneratorPage.tsx    # Main quiz interface
│   │   ├── HeroSection.tsx          # Landing page hero
│   │   ├── ArchitectureSection.tsx  # Technical overview
│   │   └── ExampleOutputSection.tsx # Sample quizzes
│   ├── utils/             # Utility functions
│   │   ├── pdfExporter.ts          # PDF generation
│   │   ├── lazyLoader.tsx          # Dynamic imports
│   │   └── performance.ts          # Performance utilities
│   ├── AnimatedBackground/ # Dynamic background effects
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets (icons, service worker)
└── Configuration files    # Vite, TypeScript, Tailwind configs
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Need Help?

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting tips.

---

**Made with ❤️ by the QuizGen-AI Team**
