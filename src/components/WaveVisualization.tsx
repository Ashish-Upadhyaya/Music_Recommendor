import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface WaveVisualizationProps {
  emotion: string;
}

export default function WaveVisualization({ emotion }: WaveVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const getEmotionConfig = (emotion: string) => {
      const configs = {
        happy: { frequency: 0.02, amplitude: 30, speed: 0.1, color: '#FFD700' },
        sad: { frequency: 0.01, amplitude: 15, speed: 0.05, color: '#4A90E2' },
        angry: { frequency: 0.05, amplitude: 40, speed: 0.15, color: '#FF6B6B' },
        surprised: { frequency: 0.03, amplitude: 35, speed: 0.12, color: '#FF9500' },
        neutral: { frequency: 0.015, amplitude: 20, speed: 0.08, color: '#8E8E93' },
        excited: { frequency: 0.04, amplitude: 45, speed: 0.18, color: '#FF1493' },
        relaxed: { frequency: 0.008, amplitude: 12, speed: 0.04, color: '#32D74B' }
      };
      return configs[emotion as keyof typeof configs] || configs.neutral;
    };

    const config = getEmotionConfig(emotion);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `${config.color}20`);
      gradient.addColorStop(0.5, `${config.color}60`);
      gradient.addColorStop(1, `${config.color}20`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // Draw multiple waves
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + 
            Math.sin(x * config.frequency + time + wave * Math.PI / 3) * config.amplitude * (1 - wave * 0.3) +
            Math.sin(x * config.frequency * 2 + time * 1.5 + wave * Math.PI / 2) * config.amplitude * 0.5 * (1 - wave * 0.3);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.globalAlpha = 0.8 - wave * 0.2;
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      time += config.speed;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [emotion, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-32 rounded-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`text-sm font-medium ${
            isDark ? 'text-white/70' : 'text-gray-700/70'
          }`}
        >
          {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Vibes
        </motion.div>
      </div>
    </motion.div>
  );
}