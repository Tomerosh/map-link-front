import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./AuthContext";

const MapDataContext = createContext()

export default function useMapData() {
    return useContext(MapDataContext)
}

export function MapDataProvider({ children }) {
    const [position, setPosition] = useState(null)
    const [users, setUsers] = useState([])
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const updatePos = (e) => {
        setPosition({
            latitude: e.coords.latitude,
            longitude: e.coords.longitude
        })
        if (loading) {
            setLoading(false)
        }
        
    }
+
   useEffect(() => {
        if (!position) return;
        if (!user) return
        const getUserDataSocket = () => {    
            const ws = new WebSocket('ws://localhost:8000/api/v1/location/ws');
            ws.onopen = () => {
                ws.send(JSON.stringify({ lat: position.latitude, lng: position.longitude }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "nearby_map_data") {
                    setUsers(data.users || []);
                    setReports(data.reports || []);
                    console.log(data)
                }
            };

            const cleanup = getUserDataSocket();

            return cleanup;

        }, [position]);

    return (
        <>
            <MapDataContext.Provider value={{ position, updatePos, loading, users }}>
                {children}
            </MapDataContext.Provider>
        </>
    )
}