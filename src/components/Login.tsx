import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Lock, User, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData.username, formData.email, formData.password);
      } else {
        await login(formData.username, formData.password);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md ${
          isDark ? 'bg-white/10' : 'bg-white/80'
        } backdrop-blur-lg rounded-3xl shadow-2xl border ${
          isDark ? 'border-white/20' : 'border-white/40'
        } overflow-hidden`}
      >
        <div className="p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold text-center mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            MoodTunes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-center mb-8 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {isRegister ? 'Create your account' : 'Sign in to discover music that matches your mood'}
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                      : 'bg-white/60 border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                />
              </div>
            </motion.div>

            {isRegister && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                        : 'bg-white/60 border-gray-300 text-gray-800 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                      : 'bg-white/60 border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isRegister ? 'Create Account' : 'Sign In')}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => setIsRegister(!isRegister)}
              className={`${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              } transition-colors`}
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}