import { useContext } from "react";
import MapDataContext from "./mapDataContextValue.js";

export default function useMapData() {
    return useContext(MapDataContext)
}
