import React from 'react'
import { motion } from 'framer-motion'

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[oklch(0.85_0.08_350)] via-[oklch(0.88_0.06_355)] to-[oklch(0.90_0.05_360)] relative overflow-hidden">
      {/* Floating background shapes */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[oklch(0.88_0.08_60)] opacity-20"
        animate={{
          y: [0, 40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-[oklch(0.85_0.08_150)] opacity-20"
        animate={{
          y: [0, -30, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to start your visual journey?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Join thousands of creators curating and sharing their visual stories
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button className="px-12 py-5 bg-[oklch(0.70_0.15_340)] text-white rounded-full font-bold text-xl transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 shadow-lg">
            Sign Up for Viz.
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-700">
            Already have an account?{' '}
            <a href="#" className="text-[oklch(0.70_0.15_340)] font-semibold hover:underline">
              Log In
            </a>
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">Curate Freely</h3>
            <p className="text-gray-600 text-sm">
              Select and share exactly what inspires you
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-bold text-lg mb-2">Respect Creators</h3>
            <p className="text-gray-600 text-sm">
              Permission-based system that values attribution
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="font-bold text-lg mb-2">Monetize Art</h3>
            <p className="text-gray-600 text-sm">
              Turn your Viz.Lists into products and earn
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
