import React from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { VisualCurationDemo } from '@/components/landing/VisualCurationDemo'
import { PermissionSystemDemo } from '@/components/landing/PermissionSystemDemo'
import { VizListExample } from '@/components/landing/VizListExample'
import { VizLetMarketplace } from '@/components/landing/VizLetMarketplace'
import { UserBoutiqueExample } from '@/components/landing/UserBoutiqueExample'
import { ShieldAvatarShowcase } from '@/components/landing/ShieldAvatarShowcase'
import { CTASection } from '@/components/landing/CTASection'
import { SocialShareButtons } from '@/components/landing/SocialShareButtons'
import { LandingFooter } from '@/components/landing/Footer'

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <VisualCurationDemo />
      <PermissionSystemDemo />
      <VizListExample />
      <VizLetMarketplace />
      <UserBoutiqueExample />
      <ShieldAvatarShowcase />
      <CTASection />
      <SocialShareButtons />
      <LandingFooter />
    </div>
  )
}
