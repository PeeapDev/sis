'use client'

import { useEffect, useRef, useState } from 'react'
import { School, Users, Award } from 'lucide-react'

// Mock data for Sierra Leone schools
const mockSchools = [
  {
    id: 1,
    name: "Freetown Secondary School",
    district: "Western Area",
    students: 1200,
    teachers: 45,
    performance: 85,
    lat: 8.4657,
    lng: -13.2317,
    type: "Secondary"
  },
  {
    id: 2,
    name: "Bo Government School",
    district: "Southern Province",
    students: 800,
    teachers: 32,
    performance: 78,
    lat: 7.9644,
    lng: -11.7383,
    type: "Primary"
  },
  {
    id: 3,
    name: "Makeni Technical Institute",
    district: "Northern Province",
    students: 650,
    teachers: 28,
    performance: 72,
    lat: 8.8864,
    lng: -12.0438,
    type: "Technical"
  },
  {
    id: 4,
    name: "Kenema Community School",
    district: "Eastern Province",
    students: 950,
    teachers: 38,
    performance: 68,
    lat: 7.8767,
    lng: -11.1900,
    type: "Community"
  }
]

interface SierraLeoneMapProps {
  mapId?: string
  height?: string
}

export function SierraLeoneMap({ mapId = 'default', height = 'h-96' }: SierraLeoneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let leafletMap: any = null
    let timeoutId: NodeJS.Timeout

    const initializeMap = async () => {
      try {
        console.log('Starting map initialization...')
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.log('Map loading timeout')
          setIsLoading(false)
        }, 10000)

        // Wait a bit for the component to mount properly
        await new Promise(resolve => setTimeout(resolve, 100))

        // Dynamic imports to avoid SSR issues
        const L = await import('leaflet')
        console.log('Leaflet loaded successfully')
        
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        if (mapRef.current && !leafletMap) {
          console.log('Creating map instance...')
          
          // Create map
          leafletMap = L.map(mapRef.current, {
            center: [8.4606, -11.7799],
            zoom: 8,
            scrollWheelZoom: true,
            maxBounds: [[6.8, -13.4], [10.0, -10.2]],
            maxBoundsViscosity: 1.0
          })

          console.log('Map created, adding tile layer...')

          // Add tile layer
          const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
          
          tileLayer.addTo(leafletMap)
          
          // Wait for tiles to load
          tileLayer.on('load', () => {
            console.log('Tiles loaded successfully')
          })

          // Custom school icon
          const schoolIcon = L.divIcon({
            html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-school-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })

          console.log('Adding school markers...')

          // Add school markers
          mockSchools.forEach(school => {
            const marker = L.marker([school.lat, school.lng], { icon: schoolIcon })
              .addTo(leafletMap)
              .bindPopup(`
                <div style="min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${school.name}</h3>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${school.district} - ${school.type}</p>
                  <div style="display: flex; justify-content: space-between; text-align: center;">
                    <div>
                      <div style="font-weight: bold; color: #3b82f6;">${school.students}</div>
                      <div style="font-size: 12px; color: #666;">Students</div>
                    </div>
                    <div>
                      <div style="font-weight: bold; color: #f59e0b;">${school.performance}%</div>
                      <div style="font-size: 12px; color: #666;">Pass Rate</div>
                    </div>
                  </div>
                </div>
              `)

            // Add hover tooltip
            marker.bindTooltip(school.name, {
              permanent: false,
              direction: 'top',
              className: 'school-tooltip'
            })
          })

          console.log('Map initialization complete')
          clearTimeout(timeoutId)
          setMap(leafletMap)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error initializing map:', error)
        clearTimeout(timeoutId)
        setIsLoading(false)
      }
    }

    // Add a small delay before initialization
    const initTimeout = setTimeout(initializeMap, 500)

    // Cleanup function
    return () => {
      clearTimeout(initTimeout)
      clearTimeout(timeoutId)
      if (leafletMap) {
        leafletMap.remove()
        leafletMap = null
      }
    }
  }, [mapId])

  if (isLoading) {
    return (
      <div className={`${height} w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sierra Leone map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${height} w-full rounded-lg overflow-hidden`}>
      <div ref={mapRef} className="h-full w-full" id={`map-${mapId}`} />
    </div>
  )
}
