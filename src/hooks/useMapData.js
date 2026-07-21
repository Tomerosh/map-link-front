import { useContext } from "react";
import MapDataContext from "../context/mapDataContext.js";

export default function useMapData() {
    return useContext(MapDataContext)
}
