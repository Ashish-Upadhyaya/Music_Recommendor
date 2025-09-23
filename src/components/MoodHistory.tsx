import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { emotionService } from '../services/api';

interface MoodEntry {
  emotion: string;
  confidence: number;
  timestamp: string;
}

export default function MoodHistory() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const response = await emotionService.getMoodHistory();
      setMoodHistory(response.history);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐',
      excited: '🤩',
      relaxed: '😌'
    };
    return emojiMap[emotion] || '😐';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
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
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

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
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className={`w-6 h-6 ${
          isDark ? 'text-purple-400' : 'text-purple-600'
        }`} />
        <h3 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          Mood History
        </h3>
      </div>

      {moodHistory.length === 0 ? (
        <div className="text-center py-8">
          <Clock className={`w-12 h-12 mx-auto mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <p className={`${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No mood history yet. Upload a photo to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {moodHistory.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors`}
            >
              <div className="text-3xl">
                {getEmotionEmoji(entry.emotion)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold capitalize ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {entry.emotion}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {(entry.confidence * 100).toFixed(0)}% confidence
                </p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {formatTime(entry.timestamp)}
                </p>
              </div>
              <div className={`w-2 h-12 rounded-full ${
                entry.confidence > 0.8 
                  ? 'bg-green-500' 
                  : entry.confidence > 0.6 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}></div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}