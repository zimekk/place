"use strict";(self.webpackChunk_dev_web=self.webpackChunk_dev_web||[]).push([[32],{9032:(e,t,n)=>{n.r(t),n.d(t,{default:()=>x});var a=n(2784),l=n(5062),o=n.n(l),r=n(9386),i=n(7122),s=n(3964),c=n(2048),u=n(4061),d=n(2779),f=n.n(d),m=n(8212);const p={lat:52.1724,lng:21.0549},h=(e,t)=>{return(n=e.match(/^([0-9.]*),([0-9.]*)\|(.*)$/))?(([e,n,a,l])=>({i:t,position:{lat:n,lng:a},name:l}))(n):null;var n},g=({name:e,lat:t,lng:n})=>`${t.toFixed(4)},${n.toFixed(4)}|${e}`;function E({children:e,onChange:t}){return a.createElement("div",{className:f()(m.Z.Editor)},a.createElement("textarea",{value:e,onChange:e=>t(e.target.value)}))}function v({children:e}){const t=(0,a.useRef)(null);return(0,a.useEffect)((()=>{u.toCanvas(t.current,e,(function(e){e&&console.error(e)}))})),a.createElement("div",null,a.createElement("a",{href:e,target:"_blank",style:{textDecoration:"none"}},a.createElement("canvas",{ref:t,width:"100",height:"100"})))}function b({position:e,children:t,setPosition:n}){const l=(0,a.useRef)(null),o=(0,a.useMemo)((()=>({dragend(){const e=l.current;null!=e&&n(e.getLatLng())}})),[]);return a.createElement(r.J,{draggable:!0,eventHandlers:o,position:e,ref:l},a.createElement(i.G,{minWidth:90},a.createElement("span",null,t,a.createElement(v,null,(({lat:e,lng:t})=>`https://google.com/maps/dir/?api=1&destination=${e},${t}`)(e)))))}function x(){const[e,t]=(0,a.useState)((()=>(([e,t])=>{try{return atob(t)}catch(e){return""}})(decodeURI(location.hash).match(/^#(.+)/)||[])||[g({name:"Aleja Wilanowska",lat:52.1724,lng:21.0549}),g({name:"Chmielna",lat:52.228,lng:20.9954})].join("\n")));(0,a.useEffect)((()=>{delete o().Icon.Default.prototype._getIconUrl,o().Icon.Default.mergeOptions({iconRetinaUrl:n(1963).Z,iconUrl:n(379).Z,shadowUrl:n(6179).Z})}),[]),(0,a.useEffect)((()=>(e=>document.location.replace(`#${btoa(e)}`))(e)),[e]);const l=(0,a.useMemo)((()=>e.split("\n").map(h).filter(Boolean).map((({i:e,name:n,position:a})=>({i:e,name:n,position:a,setPosition:({lat:n,lng:a})=>t((t=>t.split("\n").map(((t,l)=>e===l?(({name:e})=>g({name:e,lat:n,lng:a}))(h(t)):t)).join("\n")))})))),[e]);return a.createElement("div",{className:f()(m.Z.Layout)},a.createElement("h2",null,"Home"),a.createElement(s.h,{center:p,zoom:13,className:f()(m.Z.Map)},a.createElement(c.I,{attribution:'&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),l.map((({i:e,position:t,name:n,setPosition:l})=>a.createElement(b,{key:e,position:t,setPosition:l},n)))),a.createElement(E,{onChange:t},e))}},129:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i});var a=n(2609),l=n.n(a),o=n(9138),r=l()((function(e){return e[1]}));r.i(o.Z),r.push([e.id,".RrA1ILpfQXHCQQPXbxpc{height:50vh;border:2px solid red}.cRX2D4hJlZYEsuK1Xlzb{display:flex;height:10vh;border:2px solid blue}.cRX2D4hJlZYEsuK1Xlzb textarea{border:0;flex:1}",""]),r.locals={Map:"RrA1ILpfQXHCQQPXbxpc",Editor:"cRX2D4hJlZYEsuK1Xlzb"};const i=r},8212:(e,t,n)=>{n.d(t,{Z:()=>x});var a=n(6062),l=n.n(a),o=n(4036),r=n.n(o),i=n(6793),s=n.n(i),c=n(7892),u=n.n(c),d=n(1173),f=n.n(d),m=n(2464),p=n.n(m),h=n(129),g={};g.styleTagTransform=p(),g.setAttributes=u(),g.insert=s().bind(null,"head"),g.domAPI=r(),g.insertStyleElement=f();var E=l()(h.default,g);if(!h.default.locals||e.hot.invalidate){var v=!h.default.locals,b=v?h:h.default.locals;e.hot.accept(129,(t=>{h=n(129),function(e,t,n){if(!e&&t||e&&!t)return!1;var a;for(a in e)if((!n||"default"!==a)&&e[a]!==t[a])return!1;for(a in t)if(!(n&&"default"===a||e[a]))return!1;return!0}(b,v?h:h.default.locals,v)?(b=v?h:h.default.locals,E(h.default)):e.hot.invalidate()}))}e.hot.dispose((function(){E()}));const x=h.default&&h.default.locals?h.default.locals:void 0}}]);