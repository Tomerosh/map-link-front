import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export default function Home() {
    const [ location, setLocation ] = useState()
    const [ loading, setLoading ] = useState(true)
    const success = (e) => {
        setLocation([e.coords.latitude, e.coords.longitude])
        if (loading) {
            setLoading(false)
        }
    }
    const map = useRef()
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success)
    }, [])
    useEffect(() => {
        console.log(location)
        // if (map.current && location) console.log('MAP', map.current.flyTo(location))
        // if (map) map.flyTo(location)
    }, [location])
    useEffect(() => {
        const checkLocation = setInterval(()=> {
            navigator.geolocation.getCurrentPosition(success)
        }, 5000)
        return () => clearInterval(checkLocation)
    })
    if (loading) return 'Loading'
    return <>
    <div>
        
        <div className='center-map'>
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g id="Layer_2" data-name="Layer 2">
    <g id="invisible_box" data-name="invisible box">
      <rect width="48" height="48" fill="none"/>
    </g>
    <g id="icons_Q2" data-name="icons Q2">
      <g>
        <path d="M44,22H39.9A16.1,16.1,0,0,0,26,8.1h0V4a2,2,0,0,0-4,0V8h0A16.1,16.1,0,0,0,8.1,22H4a2,2,0,0,0,0,4H8.1A16.1,16.1,0,0,0,22,39.9h0v4a2,2,0,0,0,4,0V40h0A16.1,16.1,0,0,0,39.9,26H44a2,2,0,0,0,0-4ZM24,36A12,12,0,1,1,36,24,12,12,0,0,1,24,36Z"/>
        <circle cx="24" cy="24" r="7"/>
      </g>
    </g>
  </g>
</svg>
        </div>
        <MapContainer ref={map} className='map-container' center={location} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            <Marker position={location}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
                </div>
    </>
}