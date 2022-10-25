import React, {
  Component,
  Dispatch,
  Fragment,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import { MDXProvider } from "@mdx-js/react";
import MDX from "@mdx-js/runtime";
import pako from "pako";
import qrcode from "qrcode";
import cx from "classnames";
import styles from "./styles.module.scss";

const NL = "\n";

const getUrl = ({ lat, lng }: L.LatLng) =>
  `https://google.com/maps/dir/?api=1&destination=${lat},${lng}`;

const parseLine = (line: string, i = 0) =>
  ((item) =>
    item
      ? (([_, lat, lng, name]) => ({
          i,
          position: { lat, lng },
          name,
        }))(item)
      : null)(line.match(/^([0-9.]*),([0-9.]*)\|(.*)$/));

const stringifyLine = ({
  name,
  lat,
  lng,
}: {
  name: string;
  lat: number;
  lng: number;
}) => `${lat.toFixed(4)},${lng.toFixed(4)}|${name}`;

const Editor = forwardRef(
  (
    {
      children,
      editable,
      onChange,
    }: { children: string; editable: boolean; onChange: (s: string) => void },
    ref
  ) => (
    <div className={cx(styles.Editor, editable && styles.Editable)}>
      {editable ? (
        <textarea
          ref={ref}
          value={children}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
        />
      ) : (
        <pre>{children}</pre>
      )}
    </div>
  )
);

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

// https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
// const encode = window.btoa;
const encode = (text: string) =>
  window.btoa(String.fromCharCode.apply(null, pako.deflate(text)));
// const decode = window.atob;
const decode = (compressed: string) =>
  pako.inflate(
    window
      .atob(compressed)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      }),
    { to: "string" }
  );

const loadText = () =>
  (([_path, hash]) => {
    try {
      return decodeURIComponent(escape(decode(hash)));
    } catch (e) {
      return "";
    }
  })(decodeURI(location.hash).match(/^#(.+)/) || []);

const saveText = (text: string) =>
  document.location.replace(`#${encode(unescape(encodeURIComponent(text)))}`);

function Link({ children }: { children: string }) {
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

function DraggableMarker({ position, children, onOpen, setPosition }) {
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
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
      <Popup minWidth={90} onOpen={onOpen}>
        <span>
          <Text>{children}</Text>
          <Link>{getUrl(position)}</Link>
        </span>
      </Popup>
    </Marker>
  );
}

function LocateControl() {
  const map = useMap();

  const onLocate = useCallback(
    (event) => {
      event.preventDefault();
      map.locate({
        setView: true,
      });
    },
    [map]
  );

  return (
    <div className="leaflet-top leaflet-left" style={{ top: 80, fontSize: 16 }}>
      <div className="leaflet-control-locate leaflet-bar leaflet-control">
        <a
          className="leaflet-bar-part leaflet-bar-part-single"
          title="Locate"
          href="#"
          onClick={onLocate}
        >
          <FontAwesomeIcon icon={faCrosshairs} />
        </a>
      </div>
    </div>
  );
}

function MarkerControl({ onAddMarker }: { onAddMarker: Function }) {
  const map = useMap();

  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      onAddMarker(map.getCenter());
    },
    [map]
  );

  return (
    <div className="leaflet-top leaflet-right" style={{ fontSize: 16 }}>
      <div className="leaflet-control-locate leaflet-bar leaflet-control">
        <a
          className="leaflet-bar-part leaflet-bar-part-single"
          title="Locate"
          href="#"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </a>
      </div>
    </div>
  );
}

const SearchResultsSchema = z
  .object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
  })
  .array();

const cache: Record<string, z.infer<typeof SearchResultsSchema>> = {};

const getSearchResults = (search: string) =>
  search in cache
    ? Promise.resolve(cache[search])
    : ((url) => {
        // https://nominatim.org/release-docs/develop/api/Search/
        // https://nominatim.openstreetmap.org/ui/search.html
        url.searchParams.set("q", search);
        url.searchParams.set("format", "jsonv2");
        console.log(["fetch"]);
        return fetch(url.toString())
          .then((data) => data.json())
          .then((json) => SearchResultsSchema.parseAsync(json))
          .then((json) => {
            cache[search] = json;
            return json;
          });
      })(new URL(`https://nominatim.openstreetmap.org/search`));

function DisplayPosition({
  map,
  editable,
  setEditable,
  setText,
}: {
  map: L.Map;
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setText: Dispatch<SetStateAction<string>>;
}) {
  const [initial] = useState(() => ({
    position: map.getCenter(),
    zoom: map.getZoom(),
  }));
  const [search, setSearch] = useState(() => "chmielna, warszawa");
  const [position, setPosition] = useState(map.getCenter());

  const onClick = useCallback(() => {
    map.setView(initial.position, initial.zoom);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  const onLocationFound = useCallback((event) => {
    const { latlng, radius } = event;
    console.log({ latlng, radius });
  }, []);

  useEffect(() => {
    map.on("locationfound", onLocationFound).on("move", onMove);
    return () => {
      map.off("locationfound", onLocationFound).off("move", onMove);
    };
  }, [map, onMove]);

  const onSearch = useCallback(
    (event) => {
      event.preventDefault();
      getSearchResults(search)
        .then((json) =>
          json.map(
            ({ lat, lon, display_name }) => `${lat},${lon}|${display_name}`
          )
        )
        .then((list) => {
          setText((text) => {
            const line = list[0];
            const lines = text.split(NL);
            if (lines.includes(line)) {
              return text;
            }
            console.log(lines.concat(line).join(NL));
            return lines.concat(line).join(NL);
          });
        });
    },
    [search]
  );

  return (
    <div className={cx(styles.DisplayPosition)}>
      <form onSubmit={onSearch}>
        <input
          type="search"
          value={search}
          onChange={useCallback(({ target }) => setSearch(target.value), [])}
        />
        <button type="submit">Search</button>
        latitude: {position.lat.toFixed(4)}, longitude:{" "}
        {position.lng.toFixed(4)}{" "}
        <button type="button" onClick={onClick}>
          Reset
        </button>
        <button
          type="button"
          onClick={() =>
            map.locate({
              setView: true,
            })
          }
        >
          Locate
        </button>
        <button
          type="button"
          onClick={() => setEditable((editable) => !editable)}
        >
          {editable ? "Ok" : "Edit"}
        </button>
      </form>
    </div>
  );
}

export default function Home() {
  const inputRef = useRef(null);
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
      ].join(NL)
  );
  const [editable, setEditable] = useState(() => false);

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
        .split(NL)
        .map(parseLine)
        .filter(Boolean)
        .map(({ i, name, position }) => ({
          i,
          name,
          position,
          setSelection: () => {
            if (editable) {
              const input = inputRef.current;
              input.focus();
              const lines = text.split(NL);
              const to = lines.slice(0, i + 1).join(NL).length;
              input.setSelectionRange(to - lines[i].length, to);
            }
          },
          setPosition: ({ lat, lng }: LatLng) =>
            setText((text) =>
              text
                .split(NL)
                .map((line, index) =>
                  i === index
                    ? (({ name }) => stringifyLine({ name, lat, lng }))(
                        parseLine(line)
                      )
                    : line
                )
                .join(NL)
            ),
        })),
    [text, editable]
  );

  const bounds = useMemo(
    () =>
      L.featureGroup(
        list.map(({ position: { lat, lng } }) => L.marker([lat, lng]))
      ).getBounds(),
    []
  );

  const [map, setMap] = useState(null);

  const onAddMarker = useCallback(
    ({ lat, lng }) => {
      setText((text) =>
        stringifyLine({
          name: `lat: ${lat}, lng: ${lng}`,
          lat,
          lng,
        })
          .concat(NL)
          .concat(text)
      );
    },
    [map]
  );

  const displayMap = useMemo(
    () => (
      <MapContainer
        bounds={bounds}
        whenCreated={setMap}
        zoom={13}
        className={cx(styles.Map)}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {list.map(({ i, position, name, setPosition, setSelection }) => (
          <DraggableMarker
            key={i}
            onOpen={setSelection}
            position={position}
            setPosition={setPosition}
          >
            {name}
          </DraggableMarker>
        ))}
        <LocateControl />
        <MarkerControl onAddMarker={onAddMarker} />
      </MapContainer>
    ),
    [list]
  );

  // https://react-leaflet.js.org/docs/start-setup/
  return (
    <div className={cx(styles.Layout)}>
      {map ? (
        <DisplayPosition
          map={map}
          editable={editable}
          setEditable={setEditable}
          setText={setText}
        />
      ) : null}
      {displayMap}
      <Editor ref={inputRef} onChange={setText} editable={editable}>
        {text}
      </Editor>
    </div>
  );
}
