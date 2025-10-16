'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { School, Users, Award } from 'lucide-react'
// useMap is safe to import in a client component
import { useMap } from 'react-leaflet'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Remove Leaflet map on unmount to prevent reusing the same container across HMR/StrictMode remounts
function MapCleanup() {
  const map = useMap()
  useEffect(() => {
    return () => {
      try { map.remove() } catch (_) { /* ignore */ }
    }
  }, [map])
  return null
}

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

export function SchoolsMap() {
  const [isClient, setIsClient] = useState(false)
  const [customIcon, setCustomIcon] = useState<any>(null)
  // Ensure a unique key per mount to avoid Leaflet re-init on the same DOM node during StrictMode/HMR
  const mapKeyRef = useRef<string>(`sl-map-${Date.now()}-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    setIsClient(true)
    
    // Import Leaflet icon only on client side
    import('leaflet').then((L) => {
      const icon = new L.Icon({
        iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMzMzIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
      setCustomIcon(icon)
    })
  }, [])

  if (!isClient || !customIcon) {
    return (
      <div className="h-96 w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
  const position: [number, number] = [8.4606, -11.7799] // Centered on Sierra Leone
  
  // Sierra Leone boundaries (approximate)
  const sierraLeoneBounds: [[number, number], [number, number]] = [
    [6.8, -13.4], // Southwest
    [10.0, -10.2]  // Northeast
  ]

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer 
        key={mapKeyRef.current}
        center={position} 
        zoom={8} 
        scrollWheelZoom={true}
        maxBounds={sierraLeoneBounds}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
      >
        <MapCleanup />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mockSchools.map(school => (
          <Marker 
            key={school.id} 
            position={[school.lat, school.lng]} 
            icon={customIcon}
            eventHandlers={{
              mouseover: (e) => {
                e.target.bindTooltip(school.name, {
                  permanent: false,
                  direction: 'top',
                  className: 'school-tooltip'
                }).openTooltip();
              },
              mouseout: (e) => {
                e.target.closeTooltip();
              }
            }}
          >
            <Popup>
              <div className="w-64">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <School className="h-5 w-5 mr-2"/>
                  {school.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{school.district} - {school.type}</p>
                <div className="flex justify-between text-center">
                  <div>
                    <Users className="h-6 w-6 mx-auto text-blue-600"/>
                    <p className="font-bold text-md">{school.students}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div>
                    <Award className="h-6 w-6 mx-auto text-orange-600"/>
                    <p className="font-bold text-md">{school.performance}%</p>
                    <p className="text-xs text-gray-500">Pass Rate</p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
