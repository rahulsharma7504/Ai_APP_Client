# AI Client (Video Call App)

## Overview
This project is a full-featured AI-powered web application built with React. It provides a platform for users and admins to interact with AI chatbots, generate images from text, convert text to speech and vice versa, recognize text from images, and chat with single or multiple PDF documents. The app features robust authentication, role-based access, and a modern, responsive UI using Bootstrap.

## Features
- **User Authentication**: Register, login, and password recovery.
- **Admin Dashboard**: Manage chat bots (create, update, delete).
- **User Dashboard**: Access all AI features in one place.
- **Chat with AI Bots**: Start conversations with custom chat bots.
- **Text-to-Image Generation**: Generate images from text prompts.
- **Text-to-Speech**: Convert text to audio with multiple voice options.
- **Speech-to-Text**: Upload audio files and convert speech to text.
- **Image Recognition**: Upload images and extract text using AI.
- **Single PDF Chat**: Upload a PDF and chat with its content.
- **Multiple PDF Chat**: Upload multiple PDFs and chat across them.
- **Chat with PDFs**: Unified interface to chat with uploaded PDFs.

## Project Structure
```
AI_Client/
├── public/                # Static assets and HTML
├── src/
│   ├── App.js             # Main React app and routing
│   ├── components/        # All UI components
│   │   ├── admin/         # Admin-specific components
│   │   ├── user/          # User-specific features (chat, image, pdf, etc.)
│   │   ├── Layouts/       # Shared layouts, sidebar, menu
│   │   ├── Login/         # Login form
│   │   ├── Register/      # Registration form
│   │   ├── Dashboard/     # User dashboard
│   │   └── ...
│   ├── services/
│   │   └── AuthService.js # Handles authentication and API calls
│   └── ...
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
```

## Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd AI_Client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add your API URL:
     ```env
     REACT_APP_API_URL=http://your-api-url/
     ```

## Usage
- **Start the development server:**
  ```bash
  npm start
  ```
- **Build for production:**
  ```bash
  npm run build
  ```
- **Run tests:**
  ```bash
  npm test
  ```

## Scripts
- `npm start` – Start the development server
- `npm run build` – Build the app for production
- `npm test` – Run tests
- `npm run eject` – Eject from Create React App (not recommended)

## Key Dependencies
- **React**: UI library
- **React Router DOM**: Routing
- **Axios**: HTTP requests
- **Bootstrap**: Styling and layout
- **Socket.io-client**: Real-time communication (for chat features)
- **simple-peer**: WebRTC peer connections (for video calls, if implemented)

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
# Ai_APP_Client
