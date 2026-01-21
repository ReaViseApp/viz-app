import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAvatar } from '@/components/ui/ShieldAvatar'

type ApprovalStep = 'initial' | 'request-sent' | 'in-review' | 'approved'

export const PermissionSystemDemo: React.FC = () => {
  const [step, setStep] = useState<ApprovalStep>('initial')

  const handleRequestApproval = () => {
    setStep('request-sent')
    setTimeout(() => setStep('in-review'), 1500)
    setTimeout(() => setStep('approved'), 3500)
  }

  const resetDemo = () => {
    setStep('initial')
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Permission-Based Sharing
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Respect creators while curating content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User A's Post */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldAvatar 
                src="https://picsum.photos/200/200?random=10" 
                alt="User A"
                size="md"
              />
              <div>
                <p className="font-semibold">@photo_journey</p>
                <p className="text-sm text-gray-500">Travel photographer</p>
              </div>
            </div>

            <div className="relative mb-4">
              <img 
                src="https://picsum.photos/600/400?random=20" 
                alt="Photo"
                className="w-full rounded-lg"
              />
              
              {/* Selection areas */}
              <motion.div
                className="absolute top-4 left-4 right-1/2 bottom-1/2 border-4 border-[oklch(0.85_0.08_150)] rounded-lg"
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
              <div className="absolute top-6 left-6 bg-[oklch(0.85_0.08_150)] text-white text-xs px-2 py-1 rounded-full">
                Open to Repost
              </div>

              <motion.div
                className="absolute top-1/2 right-4 left-1/2 bottom-4 border-4 border-[oklch(0.88_0.08_60)] rounded-lg cursor-pointer"
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
                onClick={step === 'initial' ? handleRequestApproval : undefined}
              />
              <div className="absolute top-1/2 right-6 mt-2 bg-[oklch(0.88_0.08_60)] text-white text-xs px-2 py-1 rounded-full">
                Approval Required
              </div>
            </div>

            <p className="text-gray-700">Mountain sunrise from my latest expedition 🏔️</p>
          </motion.div>

          {/* User B's Perspective */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldAvatar 
                src="https://picsum.photos/200/200?random=11" 
                alt="User B"
                size="md"
              />
              <div>
                <p className="font-semibold">@designdaily</p>
                <p className="text-sm text-gray-500">You</p>
              </div>
            </div>

            <div className="space-y-4">
              {step === 'initial' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm text-gray-600 mb-3">
                    Click on the "Approval Required" area to request permission
                  </p>
                  <button 
                    className="w-full px-4 py-3 bg-[oklch(0.70_0.15_340)] text-white rounded-lg hover:scale-105 transition-transform font-semibold"
                    onClick={handleRequestApproval}
                  >
                    Request Approval
                  </button>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 'request-sent' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200"
                  >
                    <p className="font-semibold text-blue-900 mb-2">✉️ Request Sent!</p>
                    <p className="text-sm text-blue-700">
                      Waiting for @photo_journey to respond...
                    </p>
                  </motion.div>
                )}

                {step === 'in-review' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200"
                  >
                    <p className="font-semibold text-yellow-900 mb-2">⏳ Under Review</p>
                    <p className="text-sm text-yellow-700">
                      @photo_journey is reviewing your request...
                    </p>
                  </motion.div>
                )}

                {step === 'approved' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-[oklch(0.85_0.08_150)] rounded-lg"
                  >
                    <p className="font-semibold text-green-900 mb-2">✅ Approved!</p>
                    <p className="text-sm text-green-800 mb-3">
                      @photo_journey approved your request. You can now add this to your Viz.List!
                    </p>
                    <button 
                      className="w-full px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                      onClick={resetDemo}
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Approval Flow Visualization */}
        <motion.div
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[oklch(0.88_0.08_60)] flex items-center justify-center text-white font-bold">1</div>
            <span className="text-sm">Request</span>
          </div>
          <div className="w-px h-8 md:w-8 md:h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">2</div>
            <span className="text-sm">Review</span>
          </div>
          <div className="w-px h-8 md:w-8 md:h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[oklch(0.85_0.08_150)] flex items-center justify-center text-white font-bold">3</div>
            <span className="text-sm">Approve</span>
          </div>
          <div className="w-px h-8 md:w-8 md:h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[oklch(0.70_0.15_340)] flex items-center justify-center text-white font-bold">4</div>
            <span className="text-sm">Create</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
