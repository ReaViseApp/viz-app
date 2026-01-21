import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAvatar } from '@/components/ui/ShieldAvatar'

type MarketplaceTab = 'all' | 'trending' | 'new' | 'top-rated'

interface Product {
  id: number
  image: string
  title: string
  price: number
  shop: string
  shopAvatar: string
  isWishlisted?: boolean
}

interface Shop {
  id: number
  avatar: string
  name: string
  productCount: number
  followers: number
}

const mockProducts: Product[] = [
  { id: 1, image: 'https://picsum.photos/400/400?random=50', title: 'Sunset Dreams Print', price: 29.99, shop: '@artista_luna', shopAvatar: 'https://picsum.photos/200/200?random=10' },
  { id: 2, image: 'https://picsum.photos/400/400?random=51', title: 'Abstract Collection Poster', price: 24.99, shop: '@creativestudio', shopAvatar: 'https://picsum.photos/200/200?random=11' },
  { id: 3, image: 'https://picsum.photos/400/400?random=52', title: 'Vintage Vibes Tote Bag', price: 34.99, shop: '@designdaily', shopAvatar: 'https://picsum.photos/200/200?random=12' },
  { id: 4, image: 'https://picsum.photos/400/400?random=53', title: 'Pastel Paradise Mug', price: 18.99, shop: '@artista_luna', shopAvatar: 'https://picsum.photos/200/200?random=10' },
  { id: 5, image: 'https://picsum.photos/400/400?random=54', title: 'Creative Canvas Notebook', price: 22.99, shop: '@photo_journey', shopAvatar: 'https://picsum.photos/200/200?random=13' },
  { id: 6, image: 'https://picsum.photos/400/400?random=55', title: 'Minimalist Wall Art', price: 39.99, shop: '@creativestudio', shopAvatar: 'https://picsum.photos/200/200?random=11' },
]

const mockShops: Shop[] = [
  { id: 1, avatar: 'https://picsum.photos/200/200?random=10', name: '@artista_luna', productCount: 24, followers: 1234 },
  { id: 2, avatar: 'https://picsum.photos/200/200?random=11', name: '@creativestudio', productCount: 18, followers: 892 },
  { id: 3, avatar: 'https://picsum.photos/200/200?random=12', name: '@designdaily', productCount: 32, followers: 2156 },
  { id: 4, avatar: 'https://picsum.photos/200/200?random=13', name: '@photo_journey', productCount: 15, followers: 654 },
]

export const VizLetMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('all')
  const [wishlistedItems, setWishlistedItems] = useState<Set<number>>(new Set())

  const toggleWishlist = (productId: number) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-10 h-10 text-[oklch(0.70_0.15_340)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-4xl md:text-5xl font-bold">Viz.Let</h2>
          </div>
          <p className="text-xl text-gray-600">Shop Your Viz.Lists</p>
        </motion.div>

        {/* Search and filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[oklch(0.70_0.15_340)] focus:outline-none transition-colors"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'trending', 'new', 'top-rated'] as MarketplaceTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-[oklch(0.70_0.15_340)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">Featured Products</h3>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow w-64 flex-shrink-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative aspect-square rounded-t-xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <span className={`text-xl ${wishlistedItems.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}>
                        {wishlistedItems.has(product.id) ? '❤️' : '🤍'}
                      </span>
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h4>
                    <p className="text-2xl font-bold text-[oklch(0.70_0.15_340)] mb-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{product.shop}</p>
                    <button className="w-full px-4 py-2 bg-[oklch(0.70_0.15_340)] text-white rounded-lg hover:scale-105 transition-transform font-semibold">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Popular Shops */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">Popular Shops</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockShops.map((shop, index) => (
              <motion.div
                key={shop.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <ShieldAvatar
                    src={shop.avatar}
                    alt={shop.name}
                    size="xl"
                  />
                </div>
                <h4 className="font-bold text-lg mb-2">{shop.name}</h4>
                <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{shop.productCount} products</span>
                  <span>{shop.followers} followers</span>
                </div>
                <button className="w-full px-4 py-2 border-2 border-[oklch(0.70_0.15_340)] text-[oklch(0.70_0.15_340)] rounded-lg hover:bg-[oklch(0.70_0.15_340)] hover:text-white transition-colors font-semibold">
                  Visit Shop
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
