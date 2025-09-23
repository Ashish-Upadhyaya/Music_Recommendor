"""
Spotify API integration service
"""

import requests
import random
from typing import Dict, List, Any

class SpotifyService:
    def __init__(self):
        # In production, use actual Spotify API credentials
        self.client_id = "your_spotify_client_id"
        self.client_secret = "your_spotify_client_secret"
        self.base_url = "https://api.spotify.com/v1"
        
    def get_recommendations_by_emotion(self, emotion: str, limit: int = 10) -> Dict[str, Any]:
        """
        Get music recommendations based on detected emotion
        """
        # Mock data - in production, use actual Spotify API
        recommendations = self._get_mock_recommendations(emotion, limit)
        return recommendations
    
    def _get_mock_recommendations(self, emotion: str, limit: int) -> Dict[str, Any]:
        """Mock recommendations for development"""
        
        music_database = {
            "happy": [
                {"id": "1", "name": "Walking on Sunshine", "artist": "Katrina & The Waves", "album": "Walking on Sunshine", "duration": 218000, "preview_url": "https://example.com/preview1", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "2", "name": "Happy", "artist": "Pharrell Williams", "album": "G I R L", "duration": 232000, "preview_url": "https://example.com/preview2", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "3", "name": "Can't Stop the Feeling!", "artist": "Justin Timberlake", "album": "Trolls Soundtrack", "duration": 236000, "preview_url": "https://example.com/preview3", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "4", "name": "Good as Hell", "artist": "Lizzo", "album": "Coconut Oil", "duration": 219000, "preview_url": "https://example.com/preview4", "image": "https://images.pexels.com/photos/2479312/pexels-photo-2479312.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "5", "name": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars", "album": "Uptown Special", "duration": 270000, "preview_url": "https://example.com/preview5", "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"}
            ],
            "sad": [
                {"id": "6", "name": "Someone Like You", "artist": "Adele", "album": "21", "duration": 285000, "preview_url": "https://example.com/preview6", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "7", "name": "Hurt", "artist": "Johnny Cash", "album": "American IV", "duration": 218000, "preview_url": "https://example.com/preview7", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "8", "name": "Mad World", "artist": "Gary Jules", "album": "Trading Snakeoil for Wolftickets", "duration": 191000, "preview_url": "https://example.com/preview8", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "9", "name": "Black", "artist": "Pearl Jam", "album": "Ten", "duration": 343000, "preview_url": "https://example.com/preview9", "image": "https://images.pexels.com/photos/2479312/pexels-photo-2479312.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "10", "name": "The Sound of Silence", "artist": "Disturbed", "album": "Immortalized", "duration": 246000, "preview_url": "https://example.com/preview10", "image": "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"}
            ],
            "angry": [
                {"id": "11", "name": "Break Stuff", "artist": "Limp Bizkit", "album": "Significant Other", "duration": 167000, "preview_url": "https://example.com/preview11", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "12", "name": "Bodies", "artist": "Drowning Pool", "album": "Sinner", "duration": 203000, "preview_url": "https://example.com/preview12", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "13", "name": "Chop Suey!", "artist": "System of a Down", "album": "Toxicity", "duration": 210000, "preview_url": "https://example.com/preview13", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"}
            ],
            "relaxed": [
                {"id": "14", "name": "Weightless", "artist": "Marconi Union", "album": "Distance", "duration": 485000, "preview_url": "https://example.com/preview14", "image": "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "15", "name": "Clair de Lune", "artist": "Claude Debussy", "album": "Suite Bergamasque", "duration": 288000, "preview_url": "https://example.com/preview15", "image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"},
                {"id": "16", "name": "Aqueous Transmission", "artist": "Incubus", "album": "Morning View", "duration": 447000, "preview_url": "https://example.com/preview16", "image": "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"}
            ]
        }
        
        tracks = music_database.get(emotion, music_database["happy"])
        selected_tracks = random.sample(tracks, min(limit, len(tracks)))
        
        return {
            "tracks": selected_tracks,
            "total": len(selected_tracks),
            "emotion": emotion
        }