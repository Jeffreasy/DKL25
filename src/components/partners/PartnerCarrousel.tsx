import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PartnerModal } from '../modals/PartnerModal'
import type { Partner } from '@/types/partner'

const getTierWeight = (tier: 'bronze' | 'silver' | 'gold') => {
  switch (tier) {
    case 'gold': return 3
    case 'silver': return 2
    case 'bronze': return 1
    default: return 0
  }
}

const PartnerCarrousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('tier', { ascending: false })

      if (error) {
        console.error('Error fetching partners:', error)
      } else {
        const sortedPartners = (data || []).sort((a, b) => 
          getTierWeight(b.tier) - getTierWeight(a.tier)
        )
        setPartners(sortedPartners)
      }
    }
    fetchPartners()
  }, [])

  useEffect(() => {
    if (!isSmallScreen || !scrollRef.current) return

    const scrollContainer = scrollRef.current
    let scrollInterval: ReturnType<typeof setInterval>

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += 1
        }
      }, 30)
    }

    startAutoScroll()

    const stopScroll = () => clearInterval(scrollInterval)
    const resumeScroll = () => {
      stopScroll()
      startAutoScroll()
    }

    scrollContainer.addEventListener('mouseenter', stopScroll)
    scrollContainer.addEventListener('mouseleave', resumeScroll)
    scrollContainer.addEventListener('touchstart', stopScroll)
    scrollContainer.addEventListener('touchend', resumeScroll)

    return () => {
      clearInterval(scrollInterval)
      scrollContainer.removeEventListener('mouseenter', stopScroll)
      scrollContainer.removeEventListener('mouseleave', resumeScroll)
      scrollContainer.removeEventListener('touchstart', stopScroll)
      scrollContainer.removeEventListener('touchend', resumeScroll)
    }
  }, [isSmallScreen, partners])

  const displayPartners = isSmallScreen ? [...partners, ...partners] : partners

  return (
    <section className="w-full bg-white py-12" aria-labelledby="partners-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="partners-title" 
          className="text-3xl font-bold text-gray-900 text-center mb-8"
        >
          Onze Partners
        </h2>
        
        <div
          ref={scrollRef}
          className="flex items-center gap-4 xs:gap-6 sm:gap-8 mx-auto overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            justifyContent: isSmallScreen ? 'flex-start' : 'center',
          }}
        >
          {displayPartners.map((partner, index) => (
            <button
              key={`${partner.id}-${index}`}
              onClick={() => setSelectedPartner(partner)}
              className="flex-none w-24 xs:w-32 sm:w-36 md:w-40 bg-transparent border-none p-1 xs:p-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-label={`Bekijk informatie over ${partner.name}`}
            >
              <img
                src={partner.logo}
                alt={`${partner.name} Logo`}
                loading="lazy"
                className="w-full h-auto transition-transform duration-300"
                width="160"
                height="80"
              />
            </button>
          ))}
        </div>
      </div>

      <PartnerModal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner!}
      />
    </section>
  )
}

export default PartnerCarrousel 