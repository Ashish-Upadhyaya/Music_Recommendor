from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import json
from datetime import datetime
import base64
import io
from PIL import Image
import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app, supports_credentials=True)

# Create uploads directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
def init_db():
    conn = sqlite3.connect('emotion_music.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Mood history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            emotion TEXT NOT NULL,
            confidence REAL NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Playlists table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            tracks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Mock emotion detection (replace with actual ML model)
def detect_emotion(image_data):
    emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted']
    import random
    emotion = random.choice(emotions)
    confidence = round(random.uniform(0.7, 0.95), 2)
    return emotion, confidence

# Mock music recommendations (replace with Spotify API)
def get_music_recommendations(emotion):
    recommendations = {
        'happy': [
            {'title': 'Happy', 'artist': 'Pharrell Williams', 'duration': '3:53'},
            {'title': 'Good as Hell', 'artist': 'Lizzo', 'duration': '2:39'},
            {'title': 'Can\'t Stop the Feeling!', 'artist': 'Justin Timberlake', 'duration': '3:56'}
        ],
        'sad': [
            {'title': 'Someone Like You', 'artist': 'Adele', 'duration': '4:45'},
            {'title': 'Hurt', 'artist': 'Johnny Cash', 'duration': '3:38'},
            {'title': 'Mad World', 'artist': 'Gary Jules', 'duration': '3:07'}
        ],
        'angry': [
            {'title': 'Break Stuff', 'artist': 'Limp Bizkit', 'duration': '2:47'},
            {'title': 'Bodies', 'artist': 'Drowning Pool', 'duration': '3:23'},
            {'title': 'Killing in the Name', 'artist': 'Rage Against the Machine', 'duration': '5:14'}
        ],
        'neutral': [
            {'title': 'Weightless', 'artist': 'Marconi Union', 'duration': '8:08'},
            {'title': 'Clair de Lune', 'artist': 'Claude Debussy', 'duration': '5:20'},
            {'title': 'Gymnopédie No. 1', 'artist': 'Erik Satie', 'duration': '4:33'}
        ]
    }
    return recommendations.get(emotion, recommendations['neutral'])

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    conn = sqlite3.connect('emotion_music.db')
    cursor = conn.cursor()
    
    try:
        password_hash = generate_password_hash(password)
        cursor.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            (username, email, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid
        session['user_id'] = user_id
        session['username'] = username
        return jsonify({'message': 'User registered successfully', 'user': {'id': user_id, 'username': username}})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username or email already exists'}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    conn = sqlite3.connect('emotion_music.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, password_hash FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    
    if user and check_password_hash(user[2], password):
        session['user_id'] = user[0]
        session['username'] = user[1]
        return jsonify({'message': 'Login successful', 'user': {'id': user[0], 'username': user[1]}})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/user', methods=['GET'])
def get_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    return jsonify({
        'user': {
            'id': session['user_id'],
            'username': session['username']
        }
    })

@app.route('/api/analyze-emotion', methods=['POST'])
def analyze_emotion():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    image_data = data.get('image')
    
    if not image_data:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Decode base64 image
        image_data = image_data.split(',')[1]  # Remove data:image/jpeg;base64, prefix
        image_bytes = base64.b64decode(image_data)
        
        # Detect emotion (mock implementation)
        emotion, confidence = detect_emotion(image_bytes)
        
        # Save to mood history
        conn = sqlite3.connect('emotion_music.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO mood_history (user_id, emotion, confidence) VALUES (?, ?, ?)',
            (session['user_id'], emotion, confidence)
        )
        conn.commit()
        conn.close()
        
        return jsonify({
            'emotion': emotion,
            'confidence': confidence,
            'emoji': get_emotion_emoji(emotion)
        })
    
    except Exception as e:
        return jsonify({'error': 'Failed to analyze emotion'}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    emotion = data.get('emotion')
    
    if not emotion:
        return jsonify({'error': 'No emotion provided'}), 400
    
    recommendations = get_music_recommendations(emotion)
    return jsonify({'recommendations': recommendations})

@app.route('/api/mood-history', methods=['GET'])
def get_mood_history():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = sqlite3.connect('emotion_music.db')
    cursor = conn.cursor()
    cursor.execute(
        'SELECT emotion, confidence, timestamp FROM mood_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10',
        (session['user_id'],)
    )
    history = cursor.fetchall()
    conn.close()
    
    mood_history = []
    for record in history:
        mood_history.append({
            'emotion': record[0],
            'confidence': record[1],
            'timestamp': record[2],
            'emoji': get_emotion_emoji(record[0])
        })
    
    return jsonify({'history': mood_history})

@app.route('/api/save-playlist', methods=['POST'])
def save_playlist():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    name = data.get('name')
    tracks = data.get('tracks')
    
    if not all([name, tracks]):
        return jsonify({'error': 'Name and tracks are required'}), 400
    
    conn = sqlite3.connect('emotion_music.db')
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO playlists (user_id, name, tracks) VALUES (?, ?, ?)',
        (session['user_id'], name, json.dumps(tracks))
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Playlist saved successfully'})

def get_emotion_emoji(emotion):
    emoji_map = {
        'happy': '😊',
        'sad': '😢',
        'angry': '😠',
        'surprised': '😲',
        'neutral': '😐',
        'fearful': '😨',
        'disgusted': '🤢'
    }
    return emoji_map.get(emotion, '😐')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)