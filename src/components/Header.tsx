import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`${
      isDark ? 'bg-black/20' : 'bg-white/20'
    } backdrop-blur-lg border-b ${
      isDark ? 'border-white/20' : 'border-white/40'
    } sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              MoodTunes
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? 'bg-white/10 text-yellow-400' : 'bg-gray-200 text-gray-600'
              } hover:bg-opacity-80 transition-all`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              isDark ? 'bg-white/10' : 'bg-white/60'
            }`}>
              <User className={`w-5 h-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {user?.username}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`p-2 rounded-full ${
                isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
              } hover:bg-opacity-80 transition-all`}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}