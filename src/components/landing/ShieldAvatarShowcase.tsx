import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAvatar } from '@/components/ui/ShieldAvatar'

const avatarExamples = [
  { src: 'https://picsum.photos/200/200?random=80', name: '@user1', size: 'xs' as const },
  { src: 'https://picsum.photos/200/200?random=81', name: '@user2', size: 'sm' as const },
  { src: 'https://picsum.photos/200/200?random=82', name: '@user3', size: 'md' as const },
  { src: 'https://picsum.photos/200/200?random=83', name: '@user4', size: 'lg' as const },
  { src: 'https://picsum.photos/200/200?random=84', name: '@user5', size: 'xl' as const },
  { src: 'https://picsum.photos/200/200?random=85', name: '@user6', size: '2xl' as const },
]

export const ShieldAvatarShowcase: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Creative Shield
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            A unique identity that stands out in every corner of Viz.
          </p>
        </motion.div>

        {/* Large featured shield */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <ShieldAvatar
              src="https://picsum.photos/200/200?random=90"
              alt="Featured user"
              size="2xl"
              className="ring-8 ring-[oklch(0.85_0.08_350)] ring-opacity-30"
            />
            <motion.div
              className="absolute -inset-4 border-4 border-[oklch(0.85_0.08_350)] rounded-full opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Size variations */}
        <motion.div
          className="flex justify-center items-end gap-8 flex-wrap mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {avatarExamples.map((avatar, index) => (
            <motion.div
              key={avatar.name}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ShieldAvatar
                src={avatar.src}
                alt={avatar.name}
                size={avatar.size}
              />
              <span className="text-sm text-gray-600">{avatar.name}</span>
              <span className="text-xs text-gray-400">{avatar.size}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-4">
              Every creator on Viz. has a distinctive shield-shaped avatar that represents their unique creative identity. 
              It's not just a profile picture—it's your creative shield, protecting and showcasing your visual story.
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span>Unique Shape</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>Instantly Recognizable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <span>Your Brand</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
