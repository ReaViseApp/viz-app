import React from 'react'

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Viz.
            </h3>
            <p className="text-gray-600">Your Visual Story Platform</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">About</a>
              </li>
              <li>
                <a href="#help" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">Help/FAQ</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#terms" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">Terms</a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">Privacy</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social media icons */}
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a href="#" className="text-gray-600 hover:text-[oklch(0.70_0.15_340)] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Viz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
