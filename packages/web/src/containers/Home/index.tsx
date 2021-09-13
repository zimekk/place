import React, {
  Component,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MDXProvider } from "@mdx-js/react";
import MDX from "@mdx-js/runtime";
import qrcode from "qrcode";
import cx from "classnames";
import styles from "./styles.module.scss";

const getUrl = ({ lat, lng }) =>
  `https://google.com/maps/dir/?api=1&destination=${lat},${lng}`;

const parseLine = (line, i) =>
  ((item) =>
    item
      ? (([_, lat, lng, name]) => ({
          i,
          position: { lat, lng },
          name,
        }))(item)
      : null)(line.match(/^([0-9.]*),([0-9.]*)\|(.*)$/));

const stringifyLine = ({ name, lat, lng }) =>
  `${lat.toFixed(4)},${lng.toFixed(4)}|${name}`;

function Editor({ children, onChange }) {
  return (
    <div className={cx(styles.Editor)}>
      <textarea value={children} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// https://github.com/jxnblk/ok-mdx/blob/master/lib/App.js#L20
// https://pl.reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  // componentDidCatch(error, errorInfo) {
  //   logErrorToMyService(error, errorInfo);
  // }

  render() {
    const { error } = this.state;
    if (error) {
      return <pre className={cx(styles.Error)} children={error.toString()} />;
    }
    try {
      return <Fragment>{this.props.children}</Fragment>;
    } catch (e) {
      return false;
    }
  }
}

function Text({ children }: { children: string }) {
  return (
    <ErrorBoundary>
      <MDXProvider
        components={{
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        <MDX>{children}</MDX>
      </MDXProvider>
    </ErrorBoundary>
  );
}

const loadText = () =>
  (([_path, hash]) => {
    try {
      return decodeURIComponent(escape(atob(hash)));
    } catch (e) {
      return "";
    }
  })(decodeURI(location.hash).match(/^#(.+)/) || []);

const saveText = (text) =>
  document.location.replace(`#${btoa(unescape(encodeURIComponent(text)))}`);

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

function DraggableMarker({ position, children, setPosition }) {
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

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span>
          <Text>{children}</Text>
          <Link>{getUrl(position)}</Link>
        </span>
      </Popup>
    </Marker>
  );
}

export default function Home() {
  const [text, setText] = useState(
    () =>
      loadText() ||
      [
        stringifyLine({
          name: "Aleja Wilanowska",
          lat: 52.1724,
          lng: 21.0549,
        }),
        stringifyLine({
          name: "Chmielna",
          lat: 52.228,
          lng: 20.9954,
        }),
      ].join("\n")
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

  useEffect(() => saveText(text), [text]);

  const list = useMemo(
    () =>
      text
        .split("\n")
        .map(parseLine)
        .filter(Boolean)
        .map(({ i, name, position }) => ({
          i,
          name,
          position,
          setPosition: ({ lat, lng }) =>
            setText((text) =>
              text
                .split("\n")
                .map((line, index) =>
                  i === index
                    ? (({ name }) => stringifyLine({ name, lat, lng }))(
                        parseLine(line)
                      )
                    : line
                )
                .join("\n")
            ),
        })),
    [text]
  );

  const bounds = useMemo(
    () =>
      L.featureGroup(
        list.map(({ position: { lat, lng } }) => L.marker([lat, lng]))
      ).getBounds(),
    []
  );

  // https://react-leaflet.js.org/docs/start-setup/
  return (
    <div className={cx(styles.Layout)}>
      <h2>Home</h2>
      <MapContainer bounds={bounds} zoom={13} className={cx(styles.Map)}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {list.map(({ i, position, name, setPosition }) => (
          <DraggableMarker
            key={i}
            position={position}
            setPosition={setPosition}
          >
            {name}
          </DraggableMarker>
        ))}
      </MapContainer>
      <Editor onChange={setText}>{text}</Editor>
    </div>
  );
}
