import React, { useState } from 'react'
import { motion } from 'framer-motion'

export const VisualCurationDemo: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [showEditorial, setShowEditorial] = useState(false)

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Visual Curation Made Easy
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Select exactly what you want to share from any post
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Original Post with Selection Areas */}
          <motion.div
            className="bg-gray-50 rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
              <div>
                <p className="font-semibold">@artista_luna</p>
                <p className="text-sm text-gray-500">2h ago</p>
              </div>
            </div>
            
            <div className="relative grid grid-cols-2 gap-2 mb-4">
              {/* Photo 1 with selection overlay */}
              <div 
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedArea(1)}
              >
                <img 
                  src="https://picsum.photos/400/400?random=1" 
                  alt="Sample content"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-4 border-4 border-[oklch(0.85_0.08_150)] rounded-lg pointer-events-none"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute top-2 right-2 bg-[oklch(0.85_0.08_150)] text-white text-xs px-2 py-1 rounded-full">
                  Open to Repost
                </div>
              </div>

              {/* Photo 2 with selection overlay */}
              <div 
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedArea(2)}
              >
                <img 
                  src="https://picsum.photos/400/400?random=2" 
                  alt="Sample content"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-4 border-4 border-[oklch(0.88_0.08_60)] rounded-lg pointer-events-none"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <div className="absolute top-2 right-2 bg-[oklch(0.88_0.08_60)] text-white text-xs px-2 py-1 rounded-full">
                  Approval Required
                </div>
              </div>

              {/* Photos 3 & 4 */}
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://picsum.photos/400/400?random=3" 
                  alt="Sample content"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://picsum.photos/400/400?random=4" 
                  alt="Sample content"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-gray-700 mb-2">Amazing sunset collection from my travels ✨</p>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span>❤️ 234</span>
              <span>💬 12</span>
            </div>

            {selectedArea && (
              <motion.div
                className="mt-4 p-4 bg-white rounded-lg shadow-md border-2 border-[oklch(0.85_0.08_350)]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-semibold mb-2">Add to Viz.List?</p>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-4 py-2 bg-[oklch(0.70_0.15_340)] text-white rounded-lg hover:scale-105 transition-transform"
                    onClick={() => {
                      setShowEditorial(true)
                      setSelectedArea(null)
                    }}
                  >
                    Viz.List This
                  </button>
                  <button 
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedArea(null)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Resulting Editorial */}
          <motion.div
            className={`bg-gray-50 rounded-2xl p-6 shadow-lg transition-all duration-500 ${!showEditorial ? 'opacity-50' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: showEditorial ? 1 : 0.5, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400" />
              <div>
                <p className="font-semibold">@your_username</p>
                <p className="text-sm text-gray-500">Just now</p>
              </div>
              <span className="ml-auto bg-[oklch(0.70_0.15_340)] text-white text-xs px-2 py-1 rounded-full">
                VizEdit
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://picsum.photos/400/400?random=1" 
                  alt="Quoted content"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://picsum.photos/400/400?random=5" 
                  alt="Your content"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-gray-700 mb-2">
              Love this perspective! Inspired by @artista_luna 🎨
            </p>
            <p className="text-xs text-gray-500 mb-2">
              📌 Quotes content from @artista_luna
            </p>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span>❤️ 45</span>
              <span>💬 3</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-lg text-gray-600">
            ✨ Click on highlighted areas → Add to Viz.List → Create your editorial
          </p>
        </motion.div>
      </div>
    </section>
  )
}
