import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import qrcode from "qrcode";
import cx from "classnames";
import styles from "./styles.module.scss";

const center = {
  lat: 52.1724,
  lng: 21.0549,
};

const getUrl = ({ lat, lng }) => `https://maps.google.com/?ll=${lat},${lng}`;

function Editor({ children, onChange }) {
  return (
    <div className={cx(styles.Editor)}>
      <textarea value={children} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Link({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    qrcode.toCanvas(canvasRef.current, children, function (error) {
      if (error) {
        console.error(error);
      }
    });
  });

  return (
    <div>
      <a href={children} target="_blank" style={{ textDecoration: "none" }}>
        <canvas ref={canvasRef} width="100" height="100"></canvas>
      </a>
    </div>
  );
}

function DraggableMarker({ position: p, children }) {
  const [position, setPosition] = useState(p);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  console.log({ position });

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={p}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span>
          {children}
          <Link>{getUrl(position)}</Link>
        </span>
      </Popup>
    </Marker>
  );
}

export default function Home() {
  const [text, setText] = useState(() =>
    ["Aleja Wilanowska@52.1724,21.0549", "Chmielna@52.2280,20.9954"].join("\n")
  );
  // https://stackoverflow.com/questions/40719689/how-to-include-leaflet-css-in-a-react-app-with-webpack
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
      iconUrl: require("leaflet/dist/images/marker-icon.png").default,
      shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
    });
  }, []);
  const list = useMemo(
    () =>
      text
        .split("\n")
        .map((line) => line.match(/^(.*)@([0-9.]*),([0-9.]*)$/))
        .filter(Boolean)
        .map(([_, name, lat, lng]) => ({ position: { lat, lng }, name })),
    [text]
  );

  // https://react-leaflet.js.org/docs/start-setup/
  return (
    <div className={cx(styles.Layout)}>
      <h2>Home</h2>
      <MapContainer center={center} zoom={13} className={cx(styles.Map)}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {list.map(({ position, name }, key) => (
          <DraggableMarker key={key} position={position}>
            {name}
          </DraggableMarker>
        ))}
      </MapContainer>
      <Editor onChange={setText}>{text}</Editor>
    </div>
  );
}
