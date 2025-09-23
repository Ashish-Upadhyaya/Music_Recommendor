import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Heart, Save, Volume2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { emotionService } from '../services/api';

interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  image: string;
  preview_url: string;
  duration?: number;
}

interface MusicPlayerProps {
  tracks: Track[];
  currentEmotion: any;
  onTrackChange: (track: Track) => void;
}

export default function MusicPlayer({ tracks, currentEmotion, onTrackChange }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState(new Set<string>());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const { isDark } = useTheme();

  const currentTrack = tracks[currentIndex];

  React.useEffect(() => {
    if (currentTrack) {
      onTrackChange(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleLike = (trackId: string) => {
    const newLikedTracks = new Set(likedTracks);
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
    } else {
      newLikedTracks.add(trackId);
    }
    setLikedTracks(newLikedTracks);
  };

  const savePlaylist = async () => {
    if (!playlistName.trim()) return;
    
    try {
      await emotionService.savePlaylist(
        playlistName,
        currentEmotion?.emotion || 'mixed',
        tracks
      );
      setShowSaveModal(false);
      setPlaylistName('');
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl ${
        isDark ? 'bg-white/10' : 'bg-white/80'
      } backdrop-blur-lg border ${
        isDark ? 'border-white/20' : 'border-white/40'
      } shadow-xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          Your Mood Playlist
        </h3>
        <button
          onClick={() => setShowSaveModal(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isDark 
              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
          } transition-colors`}
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      {/* Now Playing */}
      <motion.div
        key={currentTrack.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20"
      >
        <img
          src={currentTrack.image}
          alt={currentTrack.name}
          className="w-16 h-16 rounded-lg object-cover shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className={`text-lg font-semibold truncate ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            {currentTrack.name}
          </h4>
          <p className={`text-sm truncate ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentTrack.artist}
          </p>
          {currentTrack.album && (
            <p className={`text-xs truncate ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {currentTrack.album}
            </p>
          )}
        </div>
        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-2 rounded-full transition-colors ${
            likedTracks.has(currentTrack.id)
              ? 'text-red-500 hover:text-red-600'
              : (isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500')
          }`}
        >
          <Heart className={`w-5 h-5 ${
            likedTracks.has(currentTrack.id) ? 'fill-current' : ''
          }`} />
        </button>
      </motion.div>

      {/* Player Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevTrack}
          className={`p-3 rounded-full ${
            isDark 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          <SkipBack className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextTrack}
          className={`p-3 rounded-full ${
            isDark 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          <SkipForward className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3 mb-6">
        <Volume2 className={`w-5 h-5 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <div className={`flex-1 h-2 rounded-full ${
          isDark ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <div className="w-3/4 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>

      {/* Playlist */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tracks.map((track, index) => (
          <motion.button
            key={track.id}
            whileHover={{ x: 4 }}
            onClick={() => setCurrentIndex(index)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
              index === currentIndex
                ? (isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-100 border border-purple-200')
                : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100')
            }`}
          >
            <img
              src={track.image}
              alt={track.name}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {track.name}
              </p>
              <p className={`text-sm truncate ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {track.artist}
              </p>
            </div>
            {likedTracks.has(track.id) && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Save Playlist Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-xl`}
            >
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Save Playlist
              </h3>
              <input
                type="text"
                placeholder="Enter playlist name..."
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4`}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={savePlaylist}
                  disabled={!playlistName.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}