(function(ME){
    ME.Draw.Polyline = L.Draw.Polyline.extend({
        statics: {
            TYPE: 'polyline'
        },
        options:{
            closable: true
        },

        Poly: L.Polyline,

        addHooks: function () {
            L.Draw.Feature.prototype.addHooks.call(this);
            if (this._map) {
                this._markers = [];

                this._markerGroup = new L.LayerGroup();
                this._map.addLayer(this._markerGroup);

                this._poly = new ME.Polyline({
                    latlngs : [],
                    options:this.options.shapeOptions
                });

                this._tooltip.updateContent(this._getTooltipText());
                // while drawing.
                if (!this._mouseMarker) {
                    this._mouseMarker = L.marker(this._map.getCenter(), {
                        icon: L.divIcon({
                            className: 'leaflet-mouse-marker',
                            iconAnchor: [20, 20],
                            iconSize: [40, 40]
                        }),
                        opacity: 0,
                        zIndexOffset: this.options.zIndexOffset
                    });
                }

                this._mouseMarker
                    .on('click', this._onClick, this)
                    .addTo(this._map);

                this._map
                    .on('mousemove', this._onMouseMove, this)
                    .on('zoomend', this._onZoomEnd, this);
            }
        },

        removeHooks: function () {
            L.Draw.Feature.prototype.removeHooks.call(this);

            this._clearHideErrorTimeout();

            this._cleanUpShape();

            // remove markers from map
            this._map.removeLayer(this._markerGroup);
            delete this._markerGroup;
            delete this._markers;

            this._map.removeLayer(this._poly);
            delete this._poly;

            this._mouseMarker.off('click', this._onClick, this);
            this._map.removeLayer(this._mouseMarker);
            delete this._mouseMarker;

            // clean up DOM
            this._clearGuides();

            this._map
                .off('mousemove', this._onMouseMove, this)
                .off('zoomend', this._onZoomEnd, this);
        },

        _onClick: function (e) {
            var latlng = e.target.getLatLng();

            this.addVertex(latlng);
        },

        _createMarker: function (latlng) {
            var marker = new ME.Marker({
                latlng : latlng,
                options : {
                    icon: this.options.icon,
                    zIndexOffset: this.options.zIndexOffset * 2
                }
            });

            this._markerGroup.addLayer(marker);
            return marker;
        },

        _fireCreatedEvent: function () {
            var entity = this.type === 'polygon' ? 'Polygon' : 'Polyline', poly;


            poly = new ME[entity]({
                latlngs : this._poly.getLatLngs(),
                options : this.options.shapeOptions
            });

            L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);

            this._map.changes.fire('created', {layer:poly});
        },

        _vertexChanged: function (latlng, added) {
            L.Draw.Polyline.prototype._vertexChanged.call(this, latlng, added);
            if(this.options.closable)
                this._updateClosableHandler();
        },

        _updateClosableHandler: function(){
            var markerCount = this._markers.length;

            if (markerCount > 2) {
                this._markers[0].on('click', this._closePolyline, this);
            }
            else{
                this._markers[0].off('click', this._closePolyline, this);
                L.setOptions(this._poly,{closable: false});
                this.options.shapeOptions.closable = false;
            }
                
        },

        _closePolyline: function(){
            var latlng = this._markers[0].getLatLng();
            latlng = L.latLng(latlng.lat, latlng.lng);

            L.setOptions(this._poly,{closable: this.options.closable});
            this.options.shapeOptions.closable = true;

            this._poly.redraw();


            this._finishShape();
        },

        _cleanUpShape: function () {
            L.Draw.Polyline.prototype._cleanUpShape.call(this);
            if(this._markers.length)
                this._markers[0].off('click', this._closePolyline, this);
        }
    });
})(MapEditor);

