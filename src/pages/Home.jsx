import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import useMapData from '../context/useMapData.js'
import { useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth.js'
import  AddReportComp from '../components/AddReportComp.jsx'
import DeleteReport from '../components/DeleteReport.jsx'
import L from 'leaflet';
import UserMarker from '../components/UserMarker.jsx'
import mapPin from '../assets/map-pin.svg'


export default function Home() {
    const { position, loading, updatePos, users, reports, removeReport, userIcon, ICONS } = useMapData()
    const navigate = useNavigate()
    const { user, displayName } = useAuth()
    const [showReportForm, setShowReportForm] = useState(false)
    const [locationError, setLocationError] = useState(null)
    const map = useRef()

    const MarkerIcon = new L.Icon({
        iconUrl: ICONS[userIcon],
        iconRetinaUrl: ICONS[userIcon],
        popupAnchor:  [-0, -0],
        iconSize: [32,45], 
    });
    const nearbyUserIcon = new L.Icon({
        iconUrl: mapPin,
        iconRetinaUrl: mapPin,
        popupAnchor: [-0, -0],
        iconSize: [30, 42],
    });
    const centerMap = () => {
        if (map.current && !loading) map.current.flyTo([position.latitude, position.longitude])

    }
    useEffect(() => {
        if (!user) navigate('/login')
        else {
            if (!navigator.geolocation) {
                setLocationError('Geolocation is not supported by this browser')
                return
            }

            const watchId = navigator.geolocation.watchPosition(
                updatePos,
                (error) => {
                    console.error(error)
                    setLocationError(error.message || 'Unable to get your location')
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 1000,
                    timeout: 10000,
                },
            )
            return () => navigator.geolocation.clearWatch(watchId)
        }
    }, [navigate, updatePos, user])


    if (locationError) return <main className="status-screen">{locationError}</main>
    if (loading) return <main className="status-screen">Loading</main>
    if (!position) return <main className="status-screen">Unable to get your location</main>
    return <>
        <div className="map-page">
            <MapContainer ref={map} className='map-container' center={[position.latitude, position.longitude]} zoom={18} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UserMarker MarkerIcon={MarkerIcon} displayName={displayName} position={position} first_name={user.first_name}/>
                {users.map(user => (
                    <Marker key={user.user_id} icon={nearbyUserIcon} position={[user.lat, user.lng]}>
                        <Popup>
                            <div className="user-popup">
                                <span>User nearby</span>
                                <span className={user.allow_incoming_messages ? 'message-status available' : 'message-status unavailable'}>
                                    {user.allow_incoming_messages ? 'Messages enabled' : 'Messages disabled'}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {reports.map(report => (
                    <Marker key={report.id} position={[report.latitude, report.longitude]}>
                    <Popup>
                        {report.report_type}
                          {report.user_id === user.id && <DeleteReport report_id={report.id} onDeleted={removeReport} />}
                    </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <button className="report-toggle" onClick={() => setShowReportForm(!showReportForm)}>
                {showReportForm ? "Hide Report Menu" : "Add Report"}
            </button>

            {showReportForm && (
                <AddReportComp 
                    latitude={position.latitude} 
                    longitude={position.longitude} 
                />
            )}
            <button className='center-map' onClick={centerMap} aria-label="Center map">
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
            </button>
        </div>
    </>
}
