import { createContext, useContext, useEffect, useState } from "react";

const MapDataContext = createContext()

export default function useMapData() {
    return useContext(MapDataContext)
}

export function MapDataProvider({ children }) {
    const [position, setPosition] = useState(null)
    const [users, setUsers] = useState([])
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    const updatePos = (e) => {
        setPosition({
            latitude: e.coords.latitude,
             longitude: e.coords.longitude})
        if (loading) {
            setLoading(false)
        }
        
    }
    return (
        <>
            <MapDataContext.Provider value={{ position, updatePos, loading }}>
                {children}
            </MapDataContext.Provider>
        </>
    )
}