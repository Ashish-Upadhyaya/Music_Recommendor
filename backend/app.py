from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import os
import base64
import random
import json
from datetime import datetime
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
CORS(app, supports_credentials=True)

# Initialize database
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password_hash TEXT NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS mood_history
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  emotion TEXT,
                  confidence REAL,
                  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS playlists
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  name TEXT,
                  emotion TEXT,
                  tracks TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users (id))''')
    
    conn.commit()
    conn.close()

# Mock emotion detection (in production, use actual ML model)
def detect_emotion(image_data):
    emotions = [
        {"emotion": "happy", "confidence": 0.85, "emoji": "😊"},
        {"emotion": "sad", "confidence": 0.78, "emoji": "😢"},
        {"emotion": "angry", "confidence": 0.72, "emoji": "😠"},
        {"emotion": "surprised", "confidence": 0.83, "emoji": "😲"},
        {"emotion": "neutral", "confidence": 0.90, "emoji": "😐"},
        {"emotion": "excited", "confidence": 0.88, "emoji": "🤩"},
        {"emotion": "relaxed", "confidence": 0.92, "emoji": "😌"}
    ]
    return random.choice(emotions)

# Mock Spotify recommendations
def get_spotify_recommendations(emotion, user_preferences=None):
    music_db = {
        "happy": [
            {"id": "1", "name": "Walking on Sunshine", "artist": "Katrina & The Waves", "preview_url": "https://example.com/preview1", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "2", "name": "Happy", "artist": "Pharrell Williams", "preview_url": "https://example.com/preview2", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "3", "name": "Can't Stop the Feeling!", "artist": "Justin Timberlake", "preview_url": "https://example.com/preview3", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"}
        ],
        "sad": [
            {"id": "4", "name": "Someone Like You", "artist": "Adele", "preview_url": "https://example.com/preview4", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "5", "name": "Hurt", "artist": "Johnny Cash", "preview_url": "https://example.com/preview5", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "6", "name": "Mad World", "artist": "Gary Jules", "preview_url": "https://example.com/preview6", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"}
        ],
        "angry": [
            {"id": "7", "name": "Break Stuff", "artist": "Limp Bizkit", "preview_url": "https://example.com/preview7", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "8", "name": "Bodies", "artist": "Drowning Pool", "preview_url": "https://example.com/preview8", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "9", "name": "Chop Suey!", "artist": "System of a Down", "preview_url": "https://example.com/preview9", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"}
        ],
        "relaxed": [
            {"id": "10", "name": "Weightless", "artist": "Marconi Union", "preview_url": "https://example.com/preview10", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "11", "name": "Clair de Lune", "artist": "Claude Debussy", "preview_url": "https://example.com/preview11", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
            {"id": "12", "name": "Aqueous Transmission", "artist": "Incubus", "preview_url": "https://example.com/preview12", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"}
        ]
    }
    
    tracks = music_db.get(emotion, music_db["happy"])
    return {"tracks": tracks, "total": len(tracks)}

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({"error": "All fields are required"}), 400
            
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Check if user exists
        c.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if c.fetchone():
            return jsonify({"error": "Username or email already exists"}), 400
            
        # Create user
        password_hash = generate_password_hash(password)
        c.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                 (username, email, password_hash))
        user_id = c.lastrowid
        conn.commit()
        conn.close()
        
        session['user_id'] = user_id
        session['username'] = username
        
        return jsonify({
            "message": "User registered successfully",
            "user": {"id": user_id, "username": username, "email": email}
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not all([username, password]):
            return jsonify({"error": "Username and password are required"}), 400
            
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("SELECT id, username, email, password_hash FROM users WHERE username = ?", (username,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[3], password):
            session['user_id'] = user[0]
            session['username'] = user[1]
            
            return jsonify({
                "message": "Login successful",
                "user": {"id": user[0], "username": user[1], "email": user[2]}
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/user', methods=['GET'])
def get_user():
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
        
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT id, username, email FROM users WHERE id = ?", (session['user_id'],))
    user = c.fetchone()
    conn.close()
    
    if user:
        return jsonify({
            "user": {"id": user[0], "username": user[1], "email": user[2]}
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/analyze-emotion', methods=['POST'])
def analyze_emotion():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401
            
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({"error": "No image provided"}), 400
            
        # Detect emotion (mock implementation)
        emotion_result = detect_emotion(image_data)
        
        # Store mood history
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("INSERT INTO mood_history (user_id, emotion, confidence) VALUES (?, ?, ?)",
                 (session['user_id'], emotion_result['emotion'], emotion_result['confidence']))
        conn.commit()
        conn.close()
        
        return jsonify(emotion_result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401
            
        data = request.json
        emotion = data.get('emotion', 'happy')
        
        recommendations = get_spotify_recommendations(emotion)
        return jsonify(recommendations), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/mood-history', methods=['GET'])
def get_mood_history():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401
            
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("""SELECT emotion, confidence, timestamp 
                    FROM mood_history 
                    WHERE user_id = ? 
                    ORDER BY timestamp DESC 
                    LIMIT 10""", (session['user_id'],))
        history = c.fetchall()
        conn.close()
        
        history_list = [
            {"emotion": h[0], "confidence": h[1], "timestamp": h[2]}
            for h in history
        ]
        
        return jsonify({"history": history_list}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/save-playlist', methods=['POST'])
def save_playlist():
    try:
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401
            
        data = request.json
        name = data.get('name')
        emotion = data.get('emotion')
        tracks = data.get('tracks', [])
        
        if not name:
            return jsonify({"error": "Playlist name is required"}), 400
            
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("INSERT INTO playlists (user_id, name, emotion, tracks) VALUES (?, ?, ?, ?)",
                 (session['user_id'], name, emotion, json.dumps(tracks)))
        playlist_id = c.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Playlist saved successfully",
            "playlist_id": playlist_id
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)