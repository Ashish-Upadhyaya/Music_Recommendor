import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
}

export default function FloatingNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  
  const noteSymbols = ['♪', '♫', '♬', '♭', '♯', '♮'];
  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  useEffect(() => {
    const interval = setInterval(() => {
      const newNote: Note = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        symbol: noteSymbols[Math.floor(Math.random() * noteSymbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      setNotes(prev => [...prev.slice(-15), newNote]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const removeNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {notes.map(note => (
          <motion.div
            key={note.id}
            initial={{ 
              x: note.x, 
              y: note.y, 
              opacity: 0, 
              scale: 0.5,
              rotate: 0 
            }}
            animate={{ 
              x: note.x + (Math.random() - 0.5) * 200,
              y: -100, 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1, 1.2, 0.8],
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              ease: "easeOut",
              rotate: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
            onAnimationComplete={() => removeNote(note.id)}
            className="absolute text-2xl font-bold"
            style={{ 
              color: note.color,
              textShadow: `0 0 20px ${note.color}40`,
              filter: 'blur(0.5px)'
            }}
          >
            {note.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}