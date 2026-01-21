import React, { useState } from 'react'
import { motion } from 'framer-motion'

type FilterTab = 'all' | 'approved' | 'pending' | 'declined'

interface VizItem {
  id: number
  thumbnail: string
  creator: string
  status: 'approved' | 'pending' | 'declined'
}

const mockItems: VizItem[] = [
  { id: 1, thumbnail: 'https://picsum.photos/300/300?random=30', creator: '@artista_luna', status: 'approved' },
  { id: 2, thumbnail: 'https://picsum.photos/300/300?random=31', creator: '@photo_journey', status: 'pending' },
  { id: 3, thumbnail: 'https://picsum.photos/300/300?random=32', creator: '@designdaily', status: 'approved' },
  { id: 4, thumbnail: 'https://picsum.photos/300/300?random=33', creator: '@creativestudio', status: 'declined' },
  { id: 5, thumbnail: 'https://picsum.photos/300/300?random=34', creator: '@artista_luna', status: 'approved' },
  { id: 6, thumbnail: 'https://picsum.photos/300/300?random=35', creator: '@photo_journey', status: 'approved' },
  { id: 7, thumbnail: 'https://picsum.photos/300/300?random=36', creator: '@designdaily', status: 'pending' },
  { id: 8, thumbnail: 'https://picsum.photos/300/300?random=37', creator: '@creativestudio', status: 'approved' },
  { id: 9, thumbnail: 'https://picsum.photos/300/300?random=38', creator: '@artista_luna', status: 'pending' },
  { id: 10, thumbnail: 'https://picsum.photos/300/300?random=39', creator: '@photo_journey', status: 'approved' },
  { id: 11, thumbnail: 'https://picsum.photos/300/300?random=40', creator: '@designdaily', status: 'declined' },
  { id: 12, thumbnail: 'https://picsum.photos/300/300?random=41', creator: '@creativestudio', status: 'approved' },
]

export const VizListExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = mockItems.filter(item => {
    const matchesTab = activeTab === 'all' || item.status === activeTab
    const matchesSearch = searchTerm === '' || item.creator.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const getStatusBadge = (status: VizItem['status']) => {
    switch (status) {
      case 'approved':
        return (
          <div className="absolute top-2 right-2 bg-[oklch(0.85_0.08_150)] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span>✓</span> Approved
          </div>
        )
      case 'pending':
        return (
          <div className="absolute top-2 right-2 bg-[oklch(0.88_0.08_60)] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span>⏱</span> Pending
          </div>
        )
      case 'declined':
        return (
          <div className="absolute top-2 right-2 bg-gray-400 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span>✕</span> Declined
          </div>
        )
    }
  }

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
            Your Viz.List
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Organize and manage your curated content
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Search bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[oklch(0.70_0.15_340)] focus:outline-none transition-colors"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[oklch(0.70_0.15_340)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({mockItems.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'approved'
                  ? 'bg-[oklch(0.85_0.08_150)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Approved ({mockItems.filter(i => i.status === 'approved').length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-[oklch(0.88_0.08_60)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Pending ({mockItems.filter(i => i.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('declined')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'declined'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Declined ({mockItems.filter(i => i.status === 'declined').length})
            </button>
          </div>

          {/* Grid of items */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            layout
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                  item.status === 'declined' ? 'opacity-50 grayscale' : ''
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={`Content from ${item.creator}`}
                  className="w-full h-full object-cover"
                />
                {getStatusBadge(item.status)}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-sm font-semibold">{item.creator}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
