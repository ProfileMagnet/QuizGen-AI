# QuizGen-AI

A modern quiz generator application built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🤖 AI Quiz Generation

This application integrates with a Hugging Face-powered quiz generation API to create intelligent quizzes from any topic.

### API Features
- **Endpoint**: `https://quiz-generator-from-text.onrender.com/`
- **Input**: Topic text + Hugging Face API key
- **Output**: 5 multiple-choice questions with 4 options each
- **Powered by**: Hugging Face AI models

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
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🏗️ Built With

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v3** - Styling
- **React Router DOM** - Routing
- **Lucide React** - Icons

## 📁 Project Structure

```
QuizGen-AI/
├── src/
│   ├── sections/          # Page sections
│   ├── AnimatedBackground/ # Background animations
│   ├── App.tsx            # Main component
│   └── main.tsx           # Entry point
├── public/                # Static assets
└── Configuration files
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
