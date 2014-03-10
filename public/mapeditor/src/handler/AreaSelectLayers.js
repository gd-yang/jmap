
L.Map.mergeOptions({
    dragSelect: true
});

L.Map.DragSelect = L.Handler.extend({
	includes: L.Mixin.Events,
	options: {
        className:"mapeditor-areaselectlayer-mask",
        repeatMode: false
	},

    initialize: function (map) {
        this._map = map;
        this._container = map._container;
        this._pane = map._panes.overlayPane;
        this._moved = false;
    },

    addHooks: function () {
        L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
        L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
        L.DomEvent.on(document, 'keyup', this._onKeyUp, this);
    },

    removeHooks: function () {
        L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
        L.DomEvent.off(document, 'keydown', this._onKeyDown);
        L.DomEvent.off(document, 'keyup', this._onKeyUp);
        this._moved = false;
    },

    moved: function () {
        return this._moved;
    },

    _onMouseDown: function (e) {
        this._moved = false;

        if (!e.ctrlKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

        L.DomUtil.disableTextSelection();
        L.DomUtil.disableImageDrag();

        this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

        L.DomEvent
            .on(document, 'mousemove', this._onMouseMove, this)
            .on(document, 'mouseup', this._onMouseUp, this);
    },

    _onMouseMove: function (e) {
        if (!this._moved) {
            this._box = L.DomUtil.create('div', 'mapeditor-areaselectlayer-mask', this._pane);
            L.DomUtil.setPosition(this._box, this._startLayerPoint);

            this._container.style.cursor = 'crosshair';
        }

        var startPoint = this._startLayerPoint,
            box = this._box,

            layerPoint = this._map.mouseEventToLayerPoint(e),
            offset = layerPoint.subtract(startPoint),

            newPos = new L.Point(
                Math.min(layerPoint.x, startPoint.x),
                Math.min(layerPoint.y, startPoint.y));

        L.DomUtil.setPosition(box, newPos);

        this._selecting(startPoint, layerPoint);

        this._moved = true;

        box.style.width  = (Math.max(0, Math.abs(offset.x))) + 'px';
        box.style.height = (Math.max(0, Math.abs(offset.y))) + 'px';
    },

    _selecting: function(startpoint,endpoint){
        var bounds = L.bounds(startpoint, endpoint),
            that = this,
            group = this._map.editingGroup;

        if(!group) {
            return;
        }

        group.eachLayer(function(layer){
            var id = layer._leaflet_id;
            var intersect = that._checkIntersection(bounds,layer);
            var index = group.selectedLayers.indexOf(id);
            // if intersect, select it
            if(intersect && index<0){
                group.selectedLayers.push(id);
                layer.setState('select');
                layer.selected = true;
            }else if (!intersect && index>=0){
                group.selectedLayers.splice(index,1);
                layer.setState('common');
                layer.selected = false;
            }
        });
    },

    _checkIntersection: function(bounds, polyline){
        var points = [], segmentBounds, that = this;
        // just detect polyline now.
        if(polyline.type != "polyline" && polyline.type != "assistline") {
            return false;
        }

        polyline.getLatLngs().forEach(function(latlng,i){
            points.push(that._map.latLngToLayerPoint(latlng));
        });

        for(var i=0,l=points.length-1;i<l;i++){
            segmentBounds = L.bounds(points[i],points[i+1]);
            if(bounds.intersects(segmentBounds)) {
                return true;
            }
        }
        return false;
    },

    _finish: function () {
        if (this._box) {
            this._pane.removeChild(this._box);
            this._container.style.cursor = '';
            this._box = null;
        }

        L.DomUtil.enableTextSelection();
        L.DomUtil.enableImageDrag();

        L.DomEvent
            .off(document, 'mousemove', this._onMouseMove)
            .off(document, 'mouseup', this._onMouseUp);
    },

    _onMouseUp: function (e) {
        this._finish();
    },

    _onKeyDown: function (e) {
        if (e.keyCode === 17) {
            this._map.dragging.disable();
        }
    },

    _onKeyUp: function(e){
        if (e.keyCode === 17) {
            this._map.dragging.enable();
            this._finish();
        }
    }

});

L.Map.addInitHook('addHandler', 'dragSelect', L.Map.DragSelect);