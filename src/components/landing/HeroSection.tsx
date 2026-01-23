import React from 'react'
import { motion } from 'framer-motion'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.85_0.08_350)] via-[oklch(0.88_0.06_355)] to-[oklch(0.90_0.05_360)] animate-gradient-slow" />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[oklch(0.88_0.08_60)] opacity-30"
        animate={{
          y: [0, 30, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-[oklch(0.85_0.08_150)] opacity-20"
        animate={{
          y: [0, -40, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-10 w-16 h-16 rounded-lg bg-[oklch(0.75_0.15_25)] opacity-25 rotate-45"
        animate={{
          y: [0, 20, 0],
          rotate: [45, 65, 45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Hero content */}
      <motion.div 
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Viz.
        </motion.h1>
        
        <motion.p 
          className="text-2xl md:text-4xl mb-12 text-gray-700"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Create. Curate. Share. Creativity In Other Words.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button className="px-8 py-4 bg-[oklch(0.70_0.15_340)] text-white rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
            Get Started
          </button>
          <button className="px-8 py-4 bg-white text-[oklch(0.70_0.15_340)] border-2 border-[oklch(0.70_0.15_340)] rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
            Learn More
          </button>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
