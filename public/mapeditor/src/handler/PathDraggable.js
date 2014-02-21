
	
/**
 * base class for path operator
 * @memberOf  ME.Handler
 * @constructor
 * @name ME/Handler/PathDraggable
 * @class
 */
ME.Handler.PathDraggable = L.Draggable.extend(
/**
 * @lends ME.Handler.ME/Handler/PathDraggable.prototype
 */
{
	/**
	 * initialize functionn
	 * @param path  {Object} path object
	 * 
	 */
	initialize: function(path,dragElement){
		this.path = path;
		if(!dragElement) dragElement = path._path;
		L.Draggable.prototype.initialize.apply(this,[path._path,dragElement]);
	},

	_onDown: function (e) {
		if(this.path instanceof L.Path == false) return;
		var path = this.path,
			latlngBounds = path.getBounds();
		this._originalPoints = this._getOriginalPoints();
		this.pathCenter = path._map.latLngToLayerPoint(latlngBounds.getCenter());

		this._moved = false;

		if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent.stopPropagation(e);

		if (L.Draggable._disabled) { return; }

		L.DomUtil.disableImageDrag();
		L.DomUtil.disableTextSelection();

		if (this._moving) { return; }

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = this._startPoint;

		L.DomEvent
		    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, L.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new L.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		this._newPos = newPoint;
		if (!offset.x && !offset.y) { return; };

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this._disableEdit();
			this.fire('dragstart');
			this._moved = true;
			L.DomUtil.addClass(document.body, 'leaflet-dragging');
			L.DomUtil.addClass((e.target || e.srcElement), 'leaflet-drag-target');
		}

		this._latlngs = this._transform(this._startPoint, newPoint);

		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		this.fire('predrag');
		this.path.setLatLngs(this._latlngs);
		this.fire('drag');
	},

	_onUp: function (e) {
        this._enableEdit();
		L.Draggable.prototype._onUp.apply(this,[e]);
		this.path.fire("dragend");
	},

	_transform: function(){
		//implemented by subclass
	},

	_disableEdit: function(){
		if(this.path.editing.enabled()==false) return;
		this.path.editing.disable();
	},

	_enableEdit:function(){
		if(this.path.editing.enabled()) return;
		this.path.editing.enable();
	},

	/**
	 * get handler's enable state
	 * @return {Boolen}
	 */
	enabled: function(){
		return this._enabled;
	}
});

