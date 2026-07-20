import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import useAuth from "./AuthContext.jsx";
import { API_BASE_URL } from "../api/client.js";
import bicycle from "../assets/bicycle-pin.svg"
import scooter from "../assets/scooter-pin.svg"
import car from "../assets/car-pin.svg"
import jeep from "../assets/jeep-pin.svg"
import taxi from "../assets/taxi-pin.svg"
import bus from "../assets/bus-pin.svg"
import truck from "../assets/truck-pin.svg"

const MapDataContext = createContext()
const LOCATION_UPDATE_THRESHOLD_METERS = 5
const MAP_REFRESH_INTERVAL_MS = 5000
const LOCATION_WS_URL = `${API_BASE_URL.replace(/^http/, "ws")}/api/v1/location/ws`

export default function useMapData() {
    return useContext(MapDataContext)
}

export function MapDataProvider({ children }) {
    const ICONS = {
        bicycle: bicycle,
        scooter: scooter,
        car: car,
        jeep: jeep,
        taxi: taxi,
        bus: bus,
        truck: truck
    }
    const [userIcon, setUserIcon] = useState('car')
    const [position, setPosition] = useState(null)
    const [users, setUsers] = useState([])
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const wsRef = useRef(null)
    const lastKnownPositionRef = useRef(null)

    const updatePos = useCallback((e) => {
        const nextPosition = {
            latitude: e.coords.latitude,
            longitude: e.coords.longitude
        }
        lastKnownPositionRef.current = nextPosition

        setPosition((currentPosition) => {
            if (!currentPosition) return nextPosition

            const distance = getDistanceMeters(currentPosition, nextPosition)
            if (distance < LOCATION_UPDATE_THRESHOLD_METERS) {
                return currentPosition
            }

            return nextPosition
        })
        setLoading(false)
        
    }, [])

    useEffect(() => {
        if (!user) {
            wsRef.current?.close()
            wsRef.current = null
            setUsers([])
            setReports([])
            return
        }

        const ws = new WebSocket(LOCATION_WS_URL)
        wsRef.current = ws

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === "nearby_map_data") {
                setUsers(data.users || [])
                setReports(data.reports || [])
            }

            if (data.type === "auth_error") {
                console.error("Location websocket auth error:", data.message)
            }
        }

        ws.onerror = (event) => {
            console.error("Location websocket error:", event)
        }

        ws.onclose = (event) => {
            if (event.code !== 1000) {
                console.warn("Location websocket closed:", event.code, event.reason)
            }
        }

        const refreshInterval = setInterval(() => {
            sendMapLocation(ws, lastKnownPositionRef.current)
        }, MAP_REFRESH_INTERVAL_MS)

        return () => {
            clearInterval(refreshInterval)
            ws.close()
            if (wsRef.current === ws) {
                wsRef.current = null
            }
        }
    }, [user])

    useEffect(() => {
        const ws = wsRef.current
        if (!position || !user || !ws) return

        if (ws.readyState === WebSocket.OPEN) {
            sendMapLocation(ws, position)
        } else {
            const sendPositionOnOpen = () => sendMapLocation(ws, position)
            ws.addEventListener("open", sendPositionOnOpen, { once: true })
            return () => ws.removeEventListener("open", sendPositionOnOpen)
        }
    }, [position, user])

    return (
        <>
            <MapDataContext.Provider value={{ position, updatePos, loading, users, reports, userIcon, setUserIcon, ICONS }}>
                {children}
            </MapDataContext.Provider>
        </>
    )
}

function getDistanceMeters(from, to) {
    const earthRadiusMeters = 6371000
    const fromLat = degreesToRadians(from.latitude)
    const toLat = degreesToRadians(to.latitude)
    const deltaLat = degreesToRadians(to.latitude - from.latitude)
    const deltaLng = degreesToRadians(to.longitude - from.longitude)

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(fromLat) *
            Math.cos(toLat) *
            Math.sin(deltaLng / 2) *
            Math.sin(deltaLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadiusMeters * c
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function sendMapLocation(ws, position) {
    if (!position || ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify({
        lat: position.latitude,
        lng: position.longitude
    }))
}
