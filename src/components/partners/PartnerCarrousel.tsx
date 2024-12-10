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
    let isScrolling = true

    const startAutoScroll = () => {
      if (!isScrolling) return
      
      scrollInterval = setInterval(() => {
        if (!scrollContainer || !isScrolling) return

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

    const stopScroll = () => {
      isScrolling = false
      clearInterval(scrollInterval)
    }

    const resumeScroll = () => {
      isScrolling = true
      startAutoScroll()
    }

    // Touch events voor mobiel
    const handleTouchStart = () => {
      stopScroll()
    }

    const handleTouchEnd = () => {
      // Wacht even voordat we weer gaan scrollen
      setTimeout(resumeScroll, 1000)
    }

    // Mouse events voor desktop
    const handleMouseEnter = () => {
      stopScroll()
    }

    const handleMouseLeave = () => {
      resumeScroll()
    }

    // Event listeners toevoegen
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true })
    scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true })
    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    // Start het scrollen
    startAutoScroll()

    // Cleanup
    return () => {
      stopScroll()
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isSmallScreen, partners])

  const displayPartners = isSmallScreen ? [...partners, ...partners] : partners

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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