(self.webpackChunk_dev_web=self.webpackChunk_dev_web||[]).push([[609],{79032:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>N});var l=n(2784),a=n(85062),o=n.n(a),r=n(29386),c=n(67122),s=n(41128),i=n(13964),u=n(82048),m=n(29530),f=n(95096),d=n(30876),p=n(6918),g=n(74061),h=n(72779),E=n.n(h),b=n(98212);function v(){return(v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(e[l]=n[l])}return e}).apply(this,arguments)}const C=(e,t)=>{return(n=e.match(/^([0-9.]*),([0-9.]*)\|(.*)$/))?(([e,n,l,a])=>({i:t,position:{lat:n,lng:l},name:a}))(n):null;var n},k=({name:e,lat:t,lng:n})=>`${t.toFixed(4)},${n.toFixed(4)}|${e}`,y=(0,l.forwardRef)((({children:e,onChange:t},n)=>l.createElement("div",{className:E()(b.Z.Editor)},l.createElement("textarea",{ref:n,value:e,onChange:e=>t(e.target.value)}))));class Z extends l.Component{state={error:null};static getDerivedStateFromError(e){return{error:e}}render(){const{error:e}=this.state;if(e)return l.createElement("pre",{className:E()(b.Z.Error),children:e.toString()});try{return l.createElement(l.Fragment,null,this.props.children)}catch(e){return!1}}}function x({children:e}){return l.createElement(Z,null,l.createElement(d.Zo,{components:{a:({...e})=>l.createElement("a",v({},e,{target:"_blank",rel:"noopener noreferrer"}))}},l.createElement(p.Z,null,e)))}function S({children:e}){const t=(0,l.useRef)(null);return(0,l.useEffect)((()=>{g.toCanvas(t.current,e,(function(e){e&&console.error(e)}))})),l.createElement("div",null,l.createElement("a",{href:e,target:"_blank",style:{textDecoration:"none"}},l.createElement("canvas",{ref:t,width:"100",height:"100"})))}function R({position:e,children:t,onOpen:n,setPosition:a}){const o=(0,l.useRef)(null),s=(0,l.useMemo)((()=>({dragend(){const e=o.current;null!=e&&a(e.getLatLng())}})),[]);return l.createElement(r.J,{draggable:!0,eventHandlers:s,position:e,ref:o},l.createElement(c.G,{minWidth:90,onOpen:n},l.createElement("span",null,l.createElement(x,null,t),l.createElement(S,null,(({lat:e,lng:t})=>`https://google.com/maps/dir/?api=1&destination=${e},${t}`)(e)))))}function w(){const e=(0,s.Sx)(),t=(0,l.useCallback)((t=>{t.preventDefault(),e.locate({setView:!0})}),[e]);return l.createElement("div",{className:"leaflet-top leaflet-left",style:{top:80,fontSize:16}},l.createElement("div",{className:"leaflet-control-locate leaflet-bar leaflet-control"},l.createElement("a",{className:"leaflet-bar-part leaflet-bar-part-single",title:"Locate",href:"#",onClick:t},l.createElement(m.G,{icon:f.KS0}))))}function z({onAddMarker:e}){const t=(0,s.Sx)(),n=(0,l.useCallback)((n=>{n.preventDefault(),e(t.getCenter())}),[t]);return l.createElement("div",{className:"leaflet-top leaflet-right",style:{fontSize:16}},l.createElement("div",{className:"leaflet-control-locate leaflet-bar leaflet-control"},l.createElement("a",{className:"leaflet-bar-part leaflet-bar-part-single",title:"Locate",href:"#",onClick:n},l.createElement(m.G,{icon:f.FGq}))))}function M({map:e}){const[t]=(0,l.useState)((()=>({position:e.getCenter(),zoom:e.getZoom()}))),[n,a]=(0,l.useState)(e.getCenter()),o=(0,l.useCallback)((()=>{e.setView(t.position,t.zoom)}),[e]),r=(0,l.useCallback)((()=>{a(e.getCenter())}),[e]),c=(0,l.useCallback)((e=>{const{latlng:t,radius:n}=e;console.log({latlng:t,radius:n})}),[]);return(0,l.useEffect)((()=>(e.on("locationfound",c).on("move",r),()=>{e.off("locationfound",c).off("move",r)})),[e,r]),l.createElement("div",{className:E()(b.Z.DisplayPosition)},"latitude: ",n.lat.toFixed(4),", longitude: ",n.lng.toFixed(4)," ",l.createElement("button",{onClick:o},"Reset"),l.createElement("button",{onClick:()=>e.locate({setView:!0})},"Locate"))}function N(){const e=(0,l.useRef)(null),[t,a]=(0,l.useState)((()=>(([e,t])=>{try{return decodeURIComponent(escape(atob(t)))}catch(e){return""}})(decodeURI(location.hash).match(/^#(.+)/)||[])||[k({name:"Aleja Wilanowska",lat:52.1724,lng:21.0549}),k({name:"Chmielna",lat:52.228,lng:20.9954})].join("\n")));(0,l.useEffect)((()=>{delete o().Icon.Default.prototype._getIconUrl,o().Icon.Default.mergeOptions({iconRetinaUrl:n(1963).Z,iconUrl:n(20379).Z,shadowUrl:n(26179).Z})}),[]),(0,l.useEffect)((()=>(e=>document.location.replace(`#${btoa(unescape(encodeURIComponent(e)))}`))(t)),[t]);const r=(0,l.useMemo)((()=>t.split("\n").map(C).filter(Boolean).map((({i:n,name:l,position:o})=>({i:n,name:l,position:o,setSelection:()=>{const l=e.current;l.focus();const a=t.split("\n"),o=a.slice(0,n+1).join("\n").length;l.setSelectionRange(o-a[n].length,o)},setPosition:({lat:e,lng:t})=>a((l=>l.split("\n").map(((l,a)=>n===a?(({name:n})=>k({name:n,lat:e,lng:t}))(C(l)):l)).join("\n")))})))),[t]),c=(0,l.useMemo)((()=>o().featureGroup(r.map((({position:{lat:e,lng:t}})=>o().marker([e,t])))).getBounds()),[]),[s,m]=(0,l.useState)(null),f=(0,l.useCallback)((({lat:e,lng:t})=>{a((n=>k({name:`lat: ${e}, lng: ${t}`,lat:e,lng:t}).concat("\n").concat(n)))}),[s]),d=(0,l.useMemo)((()=>l.createElement(i.h,{bounds:c,whenCreated:m,zoom:13,className:E()(b.Z.Map)},l.createElement(u.I,{attribution:'&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),r.map((({i:e,position:t,name:n,setPosition:a,setSelection:o})=>l.createElement(R,{key:e,onOpen:o,position:t,setPosition:a},n))),l.createElement(w,null),l.createElement(z,{onAddMarker:f}))),[r]);return l.createElement("div",{className:E()(b.Z.Layout)},l.createElement("h2",null,"Home"),s?l.createElement(M,{map:s}):null,d,l.createElement(y,{ref:e,onChange:a},t))}},30129:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>i});var l=n(39601),a=n.n(l),o=n(82609),r=n.n(o),c=n(99138),s=r()(a());s.i(c.Z),s.push([e.id,".RrA1ILpfQXHCQQPXbxpc{height:50vh;border:2px solid red}.cRX2D4hJlZYEsuK1Xlzb{display:flex;height:10vh;border:2px solid blue}.cRX2D4hJlZYEsuK1Xlzb textarea{border:0;flex:1}.jgCVZc9Kjz8lFJMKaf5m{color:red}",""]),s.locals={Map:"RrA1ILpfQXHCQQPXbxpc",Editor:"cRX2D4hJlZYEsuK1Xlzb",Error:"jgCVZc9Kjz8lFJMKaf5m"};const i=s},98212:(e,t,n)=>{"use strict";n.d(t,{Z:()=>C});var l=n(46062),a=n.n(l),o=n(44036),r=n.n(o),c=n(96793),s=n.n(c),i=n(17892),u=n.n(i),m=n(11173),f=n.n(m),d=n(42464),p=n.n(d),g=n(30129),h={};h.styleTagTransform=p(),h.setAttributes=u(),h.insert=s().bind(null,"head"),h.domAPI=r(),h.insertStyleElement=f();var E=a()(g.default,h);if(!g.default.locals||e.hot.invalidate){var b=!g.default.locals,v=b?g:g.default.locals;e.hot.accept(30129,(t=>{g=n(30129),function(e,t,n){if(!e&&t||e&&!t)return!1;var l;for(l in e)if((!n||"default"!==l)&&e[l]!==t[l])return!1;for(l in t)if(!(n&&"default"===l||e[l]))return!1;return!0}(v,b?g:g.default.locals,b)?(v=b?g:g.default.locals,E(g.default)):e.hot.invalidate()}))}e.hot.dispose((function(){E()}));const C=g.default&&g.default.locals?g.default.locals:void 0},18245:()=>{},60609:()=>{},71220:()=>{},99586:()=>{},4448:()=>{}}]);