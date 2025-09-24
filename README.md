# Emotion-Driven Music Recommendation Application

A sophisticated web application that analyzes user emotions from photos and provides personalized music recommendations using AI-powered mood detection.

## Features

### 🎭 Emotion Recognition
- Upload photos for real-time emotion analysis
- Dynamic emoji feedback (😊 for happy, 😢 for sad, etc.)
- Confidence scoring for emotion predictions
- Mood history tracking and visualization

### 🎵 Music Recommendations
- Personalized playlists based on detected emotions
- Spotify API integration for diverse music catalog
- Interactive music player with full controls
- Playlist creation and management
- Like/favorite track functionality

### 🎨 Visual Experience
- Immersive 3D wave visualizations
- Floating musical notes animation
- Dark/light mode toggle with smooth transitions
- Glassmorphism design with gradient backgrounds
- Responsive design for all devices

### 👤 User Management
- Secure user authentication system
- Personal mood history dashboard
- Session management with Flask backend
- User preferences and settings

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication
- **React Dropzone** for file uploads

### Backend
- **Flask** web framework
- **SQLite** database
- **Flask-CORS** for cross-origin requests
- **Werkzeug** for security utilities
- **Python 3.8+**

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emotion-music-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python app.py
   ```
   The Flask server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The React app will run on `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or sign in to access the application
2. **Upload Photo**: Use the emotion analyzer to upload a photo of yourself
3. **View Results**: See your detected emotion with confidence score and emoji
4. **Enjoy Music**: Browse personalized music recommendations based on your mood
5. **Create Playlists**: Save your favorite tracks and create custom playlists
6. **Track History**: View your mood history and patterns over time

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Emotion Analysis
- `POST /api/analyze-emotion` - Analyze emotion from uploaded image
- `GET /api/mood-history` - Get user's mood history

### Music Recommendations
- `POST /api/recommendations` - Get music recommendations by emotion
- `POST /api/save-playlist` - Save a playlist

## Project Structure

```
emotion-music-app/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Login.tsx           # Authentication
│   │   ├── EmotionAnalyzer.tsx # Photo upload & analysis
│   │   ├── MusicPlayer.tsx     # Music playback controls
│   │   ├── MoodHistory.tsx     # Mood tracking
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── ThemeContext.tsx    # Theme management
│   ├── services/               # API services
│   │   └── api.ts             # HTTP client
│   └── ...
├── backend/                     # Flask backend
│   ├── models/                 # Data models
│   │   └── emotion_model.py    # Emotion detection
│   ├── services/               # Business logic
│   │   └── spotify_service.py  # Music recommendations
│   ├── app.py                  # Main Flask application
│   └── requirements.txt        # Python dependencies
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Emotion detection powered by machine learning models
- Music data provided by Spotify Web API
- UI animations by Framer Motion
- Icons by Lucide React