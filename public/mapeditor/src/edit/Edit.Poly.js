ME.Edit = ME.Edit || {};

/*
 * L.Edit.Poly is an editing handler for polylines and polygons.
 */

ME.Edit.Poly = L.Edit.Poly.extend({
    options: {
        icon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon'
        })
    },

    initialize: function (poly, options) {
        this._poly = poly;
        L.setOptions(this, options);
    },

    addHooks : function () {
        var poly = this._poly;
        if (poly._map) {
            poly.on('marker:remove marker:add marker:modify', this._fireChanges, this);
            if (!this._markerGroup) {
                this._initMarkers();
            }
            poly._map.addLayer(this._markerGroup);
        }
    },

    removeHooks: function () {
        var poly = this._poly;
        if (poly._map) {
            poly._map.removeLayer(this._markerGroup);
            poly.off('marker:remove marker:add marker:modify', this._fireChanges,this);
            delete this._markerGroup;
            delete this._markers;
        }
    },
    _fireChanges : function(e){
        var target = e.target,
            evtType = e.type,
            changes,
            layer = e.layer,
            markers = this._markers,
            poly = this._poly,
            map = poly._map;
        if (map){
            changes = map.changes;
            switch (evtType) {
                case 'marker:remove' :
                    changes.fire('deleted', {layer : layer})
                        .fire('modified', {layer : poly});
                    break;
                case 'marker:add' :
                    changes.fire('created', {layer : layer});
                    break;
                case 'marker:modify' :
                    changes.fire('modified', {layer : layer});
                    break;
            }
        }
    },
    updateMarkers: function () {
        this._markerGroup.clearLayers();
        this._initMarkers();
    },

    _initMarkers : function () {
        var poly = this._poly, map = poly._map;
        if (!this._markerGroup) {
            this._markerGroup = new L.LayerGroup();
        }
        this._markers = [];

        var data = this._poly.data,
            nd=[],
            latlngs = this._poly._latlngs,
            i, j, len, marker, initFlag = false;

        if (!!data && !!data.nd[0]){
            initFlag = true;
        }else{
            data.nd = [[[]]];
        }
        nd = data.nd[0][0];
        //  refactor holes implementation in Polygon to support it here
        for (i = 0, len = latlngs.length; i < len; i++) {
            marker = this._createMarker(latlngs[i], i, nd[i] && nd[i].ref || null);
            marker.on('click', this._onMarkerClick, this);

            this._markers.push(marker);
            if (!initFlag){
                nd.push({
                    ref : marker._leaflet_id
                });
                poly.fire('marker:add', {layer:marker});
            }
        }

        var markerLeft, markerRight;

        for (i = 0, j = len - 1; i < len; j = i++) {
            if (i === 0 && !(L.Polygon && (this._poly instanceof L.Polygon))) {
                continue;
            }

            markerLeft = this._markers[j];
            markerRight = this._markers[i];

            this._createMiddleMarker(markerLeft, markerRight);
            this._updatePrevNext(markerLeft, markerRight);
        }
    },

    _createMarker: function (latlng, index, id) {
        var map = this._poly._map;
        var marker = new ME.Marker({
            latlng : latlng,
            id: id,
            options: {
                draggable: true,
                icon: this.options.icon
            }
        });

        marker._origLatLng = latlng;
        marker._index = index;

        marker.on('drag', this._onMarkerDrag, this);
        marker.on('dragend', this._onMarkerDragEnd, this);

        this._markerGroup.addLayer(marker);

        return marker;
    },

    _removeMarker: function (marker) {
        var i = marker._index;
        this._markerGroup.removeLayer(marker);
        this._markers.splice(i, 1);
        this._poly.spliceLatLngs(i, 1);
        this._poly.data.nd[0][0].splice(i, 1);
        this._updateIndexes(i, -1);
        this._poly.fire('marker:remove', {layer : marker});
        marker
            .off('drag', this._onMarkerDrag, this)
            .off('dragend', this._onMarkerDragEnd, this)
            .off('click', this._onMarkerClick, this);
    },

    getMarkers: function () {
        return this._markers;
    },

    _fireEdit: function () {
        this._poly.edited = true;
        this._poly.fire('edit');
    },
    _onMarkerDrag: function (e) {
        var marker = e.target;
        L.extend(marker._origLatLng, marker._latlng);

        if (marker._middleLeft) {
            marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
        }
        if (marker._middleRight) {
            marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
        }

        this._poly.redraw();
        this._poly.fire("editing");
    },
    _onMarkerDragEnd: function (e) {
        var marker = e.target, method;
        method = /^-\d+$/.test(marker._leaflet_id) ? 'marker:add' : 'marker:modify';
        this._poly.fire(method, {layer: marker});
        this._fireEdit();
    },
    _onMarkerClick: function (e) {
        var minPoints = L.Polygon && (this._poly instanceof L.Polygon) ? 4 : 3,
            marker = e.target;

        // If removing this point would create an invalid polyline/polygon don't remove
        if (this._poly._latlngs.length < minPoints) {
            return;
        }

        // remove the marker
        this._removeMarker(marker);

        // update prev/next links of adjacent markers
        this._updatePrevNext(marker._prev, marker._next);

        // remove ghost markers near the removed marker
        if (marker._middleLeft) {
            this._markerGroup.removeLayer(marker._middleLeft);
        }
        if (marker._middleRight) {
            this._markerGroup.removeLayer(marker._middleRight);
        }

        // create a ghost marker in place of the removed one
        if (marker._prev && marker._next) {
            this._createMiddleMarker(marker._prev, marker._next);

        } else if (!marker._prev) {
            marker._next._middleLeft = null;

        } else if (!marker._next) {
            marker._prev._middleRight = null;
        }

        this._fireEdit();
    },
    // 重置索引index
    _updateIndexes: function (index, delta) {
        this._markerGroup.eachLayer(function (marker) {
            if (marker._index > index) {
                marker._index += delta;
            }
        });
    },

    _createMiddleMarker: function (marker1, marker2) {
        var latlng = this._getMiddleLatLng(marker1, marker2),
            marker = this._createMarker(latlng),
            onClick,
            onDragStart,
            onDragEnd;

        marker.setOpacity(0.6);

        marker1._middleRight = marker2._middleLeft = marker;

        onDragStart = function () {
            var i = marker2._index;

            marker._index = i;

            marker
                .off('click', onClick, this)
                .on('click', this._onMarkerClick, this)
                .on('dragend', this._fireEdit, this);

            latlng.lat = marker.getLatLng().lat;
            latlng.lng = marker.getLatLng().lng;
            this._poly.spliceLatLngs(i, 0, latlng);
            this._markers.splice(i, 0, marker);
            this._poly.data.nd[0][0].splice(i, 0, {ref: marker._leaflet_id});

            marker.setOpacity(1);

            this._updateIndexes(i, 1);
            marker2._index++;
            this._updatePrevNext(marker1, marker);
            this._updatePrevNext(marker, marker2);

            this._poly.fire('editstart');
        };

        onDragEnd = function (e) {
            marker.off('dragstart', onDragStart, this);
            marker.off('dragend', onDragEnd, this);

            this._createMiddleMarker(marker1, marker);
            this._createMiddleMarker(marker, marker2);
        };

        onClick = function () {
            this._poly.fire('marker:add', {layer: marker});
            onDragStart.call(this);
            onDragEnd.call(this);
            this._fireEdit();
        };

        marker
            .on('click', onClick, this)
            .on('dragstart', onDragStart, this)
            .on('dragend', onDragEnd, this);

        this._markerGroup.addLayer(marker);
    },

    _updatePrevNext: function (marker1, marker2) {
        if (marker1) {
            marker1._next = marker2;
        }
        if (marker2) {
            marker2._prev = marker1;
        }
    },

    _getMiddleLatLng: function (marker1, marker2) {
        var map = this._poly._map,
            p1 = map.project(marker1.getLatLng()),
            p2 = map.project(marker2.getLatLng());

        return map.unproject(p1._add(p2)._divideBy(2));
    }
});

ME.Polyline.addInitHook(function () {
    if (ME.Edit.Poly) {
        this.editing = new ME.Edit.Poly(this);
        if (this.options.editable) {
            this.editing.enable();
        }
    }
});

ME.Polygon.addInitHook(function () {
    if (ME.Edit.Poly) {
        this.editing = new ME.Edit.Poly(this);
        if (this.options.editable) {
            this.editing.enable();
        }
    }
});
