import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import { setPosition } from '../store/MapDataSlice'
import useMapData from '../context/MapDataContext'
import { Link } from 'react-router-dom'

export default function Home() {
    const { position, loading, updatePos } = useMapData()

    const map = useRef()

    const centerMap = () => {
        if (map.current && !loading) map.current.flyTo([position.latitude, position.longitude])

    }
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(updatePos)
    }, [])
    useEffect(() => {
        console.log(position)
    }, [position])

    useEffect(() => {
        const checkLocation = setInterval(() => {
            navigator.geolocation.getCurrentPosition(updatePos)
        }, 5000)
        return () => clearInterval(checkLocation)
    })


    if (loading) return 'Loading'
    return <>
        <div>


            <MapContainer ref={map} className='map-container' center={[position.latitude, position.longitude]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[position.latitude, position.longitude]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
            <Link to={'/login'} >Login</Link>
            <div className='center-map' onClick={centerMap}>
                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g id="Layer_2" data-name="Layer 2">
                        <g id="invisible_box" data-name="invisible box">
                            <rect width="48" height="48" fill="none" />
                        </g>
                        <g id="icons_Q2" data-name="icons Q2">
                            <g>
                                <path d="M44,22H39.9A16.1,16.1,0,0,0,26,8.1h0V4a2,2,0,0,0-4,0V8h0A16.1,16.1,0,0,0,8.1,22H4a2,2,0,0,0,0,4H8.1A16.1,16.1,0,0,0,22,39.9h0v4a2,2,0,0,0,4,0V40h0A16.1,16.1,0,0,0,39.9,26H44a2,2,0,0,0,0-4ZM24,36A12,12,0,1,1,36,24,12,12,0,0,1,24,36Z" />
                                <circle cx="24" cy="24" r="7" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    </>
}