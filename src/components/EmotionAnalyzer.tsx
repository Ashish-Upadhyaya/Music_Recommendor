import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Loader, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { emotionService } from '../services/api';

interface EmotionAnalyzerProps {
  onEmotionDetected: (emotion: any, tracks: any[]) => void;
}

export default function EmotionAnalyzer({ onEmotionDetected }: EmotionAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { isDark } = useTheme();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setAnalyzing(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);

      try {
        // Analyze emotion
        const emotionResult = await emotionService.analyzeEmotion(base64);
        
        // Get recommendations
        const recommendations = await emotionService.getRecommendations(emotionResult.emotion);
        
        onEmotionDetected(emotionResult, recommendations.tracks);
      } catch (error) {
        console.error('Error analyzing emotion:', error);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [onEmotionDetected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-2xl ${
        isDark ? 'bg-white/10' : 'bg-white/80'
      } backdrop-blur-lg border ${
        isDark ? 'border-white/20' : 'border-white/40'
      } shadow-xl`}
    >
      <div className="text-center mb-6">
        <Sparkles className={`w-12 h-12 mx-auto mb-4 ${
          isDark ? 'text-purple-400' : 'text-purple-600'
        }`} />
        <h2 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          Emotion Analysis
        </h2>
        <p className={`${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Upload a photo to detect your mood and get personalized music recommendations
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? (isDark ? 'border-purple-400 bg-purple-400/10' : 'border-purple-500 bg-purple-100') 
            : (isDark ? 'border-gray-600 hover:border-purple-500' : 'border-gray-300 hover:border-purple-400')
        } ${analyzing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        
        {analyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <Loader className={`w-16 h-16 mb-4 animate-spin ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <p className={`text-lg font-medium ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Analyzing your emotion...
            </p>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              This may take a moment
            </p>
          </motion.div>
        ) : uploadedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="w-32 h-32 object-cover rounded-lg mb-4 shadow-lg"
            />
            <p className={`text-lg font-medium mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Photo uploaded successfully!
            </p>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Drop another photo to analyze a different emotion
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className={`w-16 h-16 mb-4 rounded-full ${
              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
            } flex items-center justify-center`}>
              {isDragActive ? (
                <Upload className={`w-8 h-8 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              ) : (
                <Camera className={`w-8 h-8 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              )}
            </div>
            <p className={`text-lg font-medium mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {isDragActive ? 'Drop your photo here' : 'Upload a photo'}
            </p>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Drag & drop or click to select (PNG, JPG, GIF)
            </p>
          </motion.div>
        )}
      </div>

      {uploadedImage && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => {
              setUploadedImage(null);
              onEmotionDetected(null, []);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isDark 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Upload New Photo
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}