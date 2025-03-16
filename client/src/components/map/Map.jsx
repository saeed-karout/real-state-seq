import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // استيراد CSS الخاص بـ Leaflet
import Pin from "../pin/Pin";
import "./map.scss"
function Map({ items }) {
  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [52.4797, -1.90269]
      }
      zoom={7}
      scrollWheelZoom={true} // السماح بالتمرير بالعجلة
      className="w-full h-full" // عرض وارتفاع متجاوب
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;