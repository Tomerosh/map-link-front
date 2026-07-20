import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import useMapData from '../context/MapDataContext.jsx'
import { useNavigate } from 'react-router-dom'
import useAuth from '../context/AuthContext.jsx'
import  AddReportComp from '../components/AddReportComp.jsx'
import { MarkerIcon } from '../components/MarkerIcon.jsx'
import DeleteReport from '../components/DeleteReport.jsx'
export default function Home() {
    const { position, loading, updatePos, users, reports } = useMapData()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [showReportForm, setShowReportForm] = useState(false)
    const [locationError, setLocationError] = useState(null)
    const map = useRef()

    const centerMap = () => {
        if (map.current && !loading) map.current.flyTo([position.latitude, position.longitude])

    }
    useEffect(() => {
        console.log(position)
    }, [position])

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
            <MapContainer ref={map} className='map-container' center={[position.latitude, position.longitude]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker icon={MarkerIcon} position={[position.latitude, position.longitude]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
                {users.map(user => (
                    <Marker key={user.user_id} icon={MarkerIcon} position={[user.lat, user.lng]}>

                    </Marker>
                ))}
                {reports.map(report => (
                    <Marker key={report.id} position={[report.latitude, report.longitude]}>
                    <Popup>
                        {report.report_type}
                          <DeleteReport report_id={report.id} />
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
