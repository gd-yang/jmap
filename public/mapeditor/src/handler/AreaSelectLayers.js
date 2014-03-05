
L.Map.mergeOptions({
    dragSelect: true
});

L.Map.DragSelect = L.Handler.extend(
{
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

        box.style.width  = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
        box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
    },

    _selecting: function(startpoint,endpoint){
        var bounds = L.bounds(startpoint, endpoint);
        var that = this;
        var group = this._map.editingGroup;

        if(!group) return;

        group.eachLayer(function(layer){
            var id = layer._leaflet_id;
            var intersect = that._checkIntersection(bounds,layer);
            var index = group.selectedLayers.indexOf(id);
            // if intersect, select it
            if(intersect && index<0){
                group.selectedLayers.push(id);
                layer.setState('select');
                layer.selected = true;
            }
            // if non intersect, unselect it
            else if (!intersect && index>=0){
                group.selectedLayers.splice(index,1);
                layer.setState('common');
                layer.selected = false;
            }
        });
    },

    _checkIntersection: function(bounds, polyline){
        var points = [], segmentBounds, that = this;
        // just detect polyline now.
        if(polyline.type != "polyline") return false;

        polyline.getLatLngs().forEach(function(latlng,i){
            points.push(that._map.latLngToLayerPoint(latlng));
        });

        for(var i=0,l=points.length-1;i<l;i++){
            segmentBounds = L.bounds(points[i],points[i+1]);
            if(bounds.intersects(segmentBounds)) return true;
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





// /**
//  *  
//  * drag a rectangle to select all layers intersect with area
//  * @memberOf  ME.Handler
//  * @constructor
//  * @name ME/Handler/AreaSelectLayers
//  */
// ME.Handler.AreaSelectLayers = L.Handler.extend(
// /**
//  * @lends ME.Handler.ME/Handler/AreaSelectLayers.prototype
//  */
// {
//     includes: L.Mixin.Events,
//     options: {
//         className:"mapeditor-areaselectlayer-mask",
//         repeatMode: false
//     },

//     addHooks : function(){
//         var mask = this.mask =  L.DomUtil.create('div', this.options.className,this._map.getContainer());

//         L.DomEvent
//             .on(mask, 'click', L.DomEvent.stopPropagation)
//             .on(mask, 'mousedown', L.DomEvent.stopPropagation)
//             .on(mask, 'dblclick', L.DomEvent.stopPropagation)
//             .on(mask, 'mousemove', L.DomEvent.stopPropagation)
//             .on(mask, 'mouseup', L.DomEvent.stopPropagation)
//             .on(mask, 'mousedown', this._mousedown, this)
//             .on(mask, 'mousemove',  this._mousemove, this)
//             .on(mask, 'mouseup',  this._mouseup, this);


//         this.fire('enabled');
//     },

//     removeHooks :function(){
//         var mask = this.mask;

//         L.DomEvent
//             .off(mask, 'click', L.DomEvent.stopPropagation)
//             .off(mask, 'mousedown', L.DomEvent.stopPropagation)
//             .off(mask, 'dblclick', L.DomEvent.stopPropagation)
//             .off(mask, 'mousemove', L.DomEvent.stopPropagation)
//             .off(mask, 'mouseup', L.DomEvent.stopPropagation)
//             .off(mask, 'mousedown', this._mousedown, this)
//             .off(mask, 'mousemove',  this._mousemove, this)
//             .off(mask, 'mouseup',  this._mouseup, this);

//         mask.parentNode.removeChild(this.mask);
//         this._rectangle = null;
//         this._startPoint = null;

//         this.fire('disabled');
//     },

//     _mousedown: function(e){
//         this._startPoint = L.DomEvent.getMousePosition(e, this._map.getContainer());
//         if(!this._rectangle)
//             this._rectangle = L.DomUtil.create('div', "",this.mask);
//         this._rectangle.style.width = "0";
//         this._rectangle.style.height = "0";
//         this._rectangle.style.marginTop = this._startPoint.y + "px";
//         this._rectangle.style.marginLeft = this._startPoint.x + "px";
//         this._rectangle.style.border = "2px dashed #f00";
//         this._rectangle.style.background = "#6cb6ff";
//         this._rectangle.style.opacity = "0.5";

//     },

//     _mousemove: function(e){
//         var width,height;
//         var point = L.DomEvent.getMousePosition(e, this._map.getContainer());

//         if(this._startPoint){
//             width = Math.abs(e.pageX - this._startPoint.x);
//             height = Math.abs(e.pageY - this._startPoint.y);
//             this._rectangle.style.width = width + "px";
//             this._rectangle.style.height = height + "px";
//             if(this._startPoint.x > point.x)
//                 this._rectangle.style.marginLeft = point.x + "px";
//             if(this._startPoint.y > point.y)
//                 this._rectangle.style.marginTop = point.y + "px";

//             this.fire("selecting", {bounds:L.bounds(this._startPoint,point)});
//         }
//     },

//     _mouseup: function(e){
//         this.disable();
//     }

// });