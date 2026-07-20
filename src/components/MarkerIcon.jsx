import L from 'leaflet';
import marker from "../assets/car-pin.svg"

const MarkerIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor:  [-0, -0],
    iconSize: [32,45], 
});

export { MarkerIcon };