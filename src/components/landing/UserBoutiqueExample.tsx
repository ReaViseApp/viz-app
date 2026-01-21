import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAvatar } from '@/components/ui/ShieldAvatar'

interface Product {
  id: number
  image: string
  title: string
  price: number
}

const boutiquProducts: Product[] = [
  { id: 1, image: 'https://picsum.photos/400/400?random=60', title: 'Limited Edition Print #1', price: 89.99 },
  { id: 2, image: 'https://picsum.photos/400/400?random=61', title: 'Signature Tote Collection', price: 45.99 },
  { id: 3, image: 'https://picsum.photos/400/400?random=62', title: 'Artist Series Poster', price: 34.99 },
  { id: 4, image: 'https://picsum.photos/400/400?random=63', title: 'Premium Canvas Print', price: 129.99 },
  { id: 5, image: 'https://picsum.photos/400/400?random=64', title: 'Designer Mug Set', price: 42.99 },
  { id: 6, image: 'https://picsum.photos/400/400?random=65', title: 'Exclusive Art Book', price: 59.99 },
]

export const UserBoutiqueExample: React.FC = () => {
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
            Your Creative Boutique
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Turn your Viz.Lists into products
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[oklch(0.95_0.02_350)] to-white rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Shop Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b-2 border-gray-200">
            <ShieldAvatar
              src="https://picsum.photos/200/200?random=70"
              alt="@creativestudio"
              size="2xl"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-2">@creativestudio</h3>
              <p className="text-gray-600 mb-4">
                Premium prints & merchandise inspired by visual storytelling
              </p>
              <div className="flex justify-center md:justify-start gap-6 text-sm mb-4">
                <div>
                  <span className="font-bold text-lg">24</span>
                  <p className="text-gray-600">Products</p>
                </div>
                <div>
                  <span className="font-bold text-lg">1.2K</span>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div>
                  <span className="font-bold text-lg">342</span>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-[oklch(0.70_0.15_340)] text-white rounded-full font-semibold hover:scale-105 transition-transform">
                Follow Shop
              </button>
            </div>
          </div>

          {/* Featured Collection Banner */}
          <motion.div
            className="mb-8 p-6 bg-gradient-to-r from-[oklch(0.85_0.08_350)] to-[oklch(0.88_0.08_60)] rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-2xl font-bold mb-2">✨ Featured Collection</h4>
            <p className="text-gray-700">Summer Vibes - Limited Edition</p>
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boutiquProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h5>
                  <p className="text-2xl font-bold text-[oklch(0.70_0.15_340)] mb-3">
                    ${product.price.toFixed(2)}
                  </p>
                  <button className="w-full px-4 py-2 bg-[oklch(0.70_0.15_340)] text-white rounded-lg hover:scale-105 transition-transform font-semibold">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
