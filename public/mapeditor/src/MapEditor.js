if (!window.console){
    window.console={};
    window.console.log = window.console.info =window.console.dir = function(){};
}
var MapEditor = {};
var ME = MapEditor;

ME.Class = L.Class;
ME.LatLng = L.LatLng;
ME.LatLngBounds = L.LatLngBounds;
ME.Point = L.Point;
ME.Bounds = L.Bounds;
ME.Icon = L.Icon;
ME.DivIcon = L.DivIcon;
ME.LayerGroup = L.LayerGroup;
ME.FeatureGroup = L.FeatureGroup;
ME.GeoJSON = L.GeoJSON;
ME.Popup = L.Popup;
ME.Control = L.Control;
ME.control = L.control;
ME.Util = L.Util;
ME.extend = L.Util.extend;
ME.bind = L.Util.bind;
ME.stamp = L.Util.stamp;
ME.setOptions = L.Util.setOptions;
ME.Browser = L.Util.Browser;
ME.LineUtil = L.Util.LineUtil;
ME.PolyUtil = L.Util.PolyUtil;
ME.Transformation = L.Util.Transformation;
ME.DomEvent = L.DomEvent;
ME.DomUtil = L.DomUtil;
ME.PosAnimation = L.PosAnimation;
ME.Draggable = L.Draggable;
ME.TileLayer = L.TileLayer;
ME.Handler = L.Handler;
L.Icon.Default.imagePath = "../images"
