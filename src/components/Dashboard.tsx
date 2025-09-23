import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import EmotionAnalyzer from './EmotionAnalyzer';
import MusicPlayer from './MusicPlayer';
import MoodHistory from './MoodHistory';
import WaveVisualization from './WaveVisualization';

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [currentEmotion, setCurrentEmotion] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const handleEmotionDetected = (emotion: any, tracks: any[]) => {
    setCurrentEmotion(emotion);
    setRecommendations(tracks);
  };

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50'
    }`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Welcome back, {user?.username}! 👋
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Let's discover music that matches your current mood
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EmotionAnalyzer onEmotionDetected={handleEmotionDetected} />
            
            {currentEmotion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-2xl ${
                  isDark ? 'bg-white/10' : 'bg-white/80'
                } backdrop-blur-lg border ${
                  isDark ? 'border-white/20' : 'border-white/40'
                } shadow-xl`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{currentEmotion.emoji}</div>
                  <h3 className={`text-2xl font-bold capitalize mb-2 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {currentEmotion.emotion}
                  </h3>
                  <p className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Confidence: {(currentEmotion.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <WaveVisualization emotion={currentEmotion.emotion} />
              </motion.div>
            )}

            {recommendations.length > 0 && (
              <MusicPlayer 
                tracks={recommendations} 
                currentEmotion={currentEmotion}
                onTrackChange={setCurrentTrack}
              />
            )}
          </div>

          <div className="space-y-8">
            <MoodHistory />
          </div>
        </div>
      </div>
    </div>
  );
}