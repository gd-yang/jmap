;(function (ME) {
    var Group = L.FeatureGroup.extend({
        initialize: function (options) {
            options = options || {};
            var layers = options.layers,
                groupid = options._group_id;

            L.LayerGroup.prototype.initialize.call(this, layers);
            this.editing = false;
            this.openning = false;
            this.states = new ME.State();
            this.selectedLayers = [];
            this.connect = options.connect;
            this._group_id = groupid || L.stamp(this);

            this.on('layeradd', function (e) {
                e.layer.on('focusIn', function (e) {
                    console.log(e.layer);
                });

                e.layer.on('focusOut', function (e) {
                    console.log(e.layer);
                });
            });

            this.on('click', function (e) {
                console.log(e.layer.toGeoJSON());
            });
        },
        editAble: function () {
            var _this = this, map = this._map;
            if (this.editing) {
                return this;
            }

            this.editing = true;
            map.editingGroup = this;

            if (this.geoType == '1') {
                this.eachLayer(function (layer) {
                    layer.dragging.enable();
                    layer.on('dragend', _this._fireChanges, _this);
                });
                return this;
            }
            this.on('click', this._fireEdit);
            this.on('mouseover', this.overState);
            this.on('mouseout', this.commonState);
            return this;
        },
        editDisable: function () {
            var _this = this, map = this._map;
            if (!this.editing) {
                return this;
            }
            this.editing = false;
            if (map.openedGroup.empty()){
                map.editingGroup = map.defaultGroup;
            }

            if (this.geoType == '1') {
                this.eachLayer(function (layer) {
                    layer.dragging.disable();
                    layer.off('dragend', _this._fireChanges, _this);
                });
                return this;
            }
            this._offEdit.call(_this);
            this.off('click', this._fireEdit);
            this.off('mouseover', this.overState);
            this.off('mouseout', this.commonState);
            return this;
        },
        open: function () {
            var map = this._map;
            if (this.openning) {
                return this;
            }

            this.openning = true;
            this.fire('open', {group: this});
            this.loadLayers();
            this.connect.on('dataload:success', this._renderLayers, this)
                .on('dataload:error', function(e){}, this)
                .on('datasave:error', function(e){}, this)
                .on('datasave:success', function(e){
                    map.changes.clear();
                }, this);
            return this;
        },
        close: function () {
            var map = this._map;
            if (!this.openning) {
                return this;
            }
            this.openning = false;
            if (this.editing) {
                this.editDisable();
            }
            this.fire('close', {group: this});
            this.off('renderLayer', this._renderLayer, this);
            this.connect.off('dataload:success', this._renderLayers, this);
            map.openedGroup.remove(this._group_id, this);
            map.removeLayer(this);
            return this;
        },
        _fireEdit: function (e) {
            var _this = this;
            this.fire('editAble', {group: this});
            if (!e.originalEvent.shiftKey) {
                this.selectedLayers.forEach(function(_leaflet_id){
                    var layer = _this.getLayer(_leaflet_id);
                    layer.editing.disable();
                    layer.off('edit', _this._fireChanges, _this);
                    layer.dragging.off('dragend', _this._fireDragEnd, _this);
                    if (_this.geoType !== '1') {
                        _this.setState(layer, 'common');
                    }
                    layer.fire('focusOut', {layer: layer});
                });
            }
            var targetLayer = e.layer;
            var _leaflet_id = targetLayer._leaflet_id;
            if (this.selectedLayers.indexOf(_leaflet_id) == -1){
                if (!e.originalEvent.shiftKey){
                    this.selectedLayers.length = 0;
                }
                this.selectedLayers.push(_leaflet_id);
            }

            targetLayer.fire('focusIn', {layer: targetLayer});
            targetLayer.editEnable();
            targetLayer.on('edit', this._fireChanges, this);
            targetLayer.dragging.on('dragend', this._fireDragEnd, this);
            if (this.geoType !== '1') {
                this.setState(targetLayer, 'edit');
            }
        },
        _offEdit: function (e) {
            var _this = this;
            this.fire('editDisable', {group: this});
            if (this.geoType !== '1') {
                this.selectedLayers.forEach(function(_leaflet_id){
                    var layer = _this.getLayer(_leaflet_id);
                    layer.editDisable();
                    layer.off('edit', _this._fireChanges, _this);
                    layer.dragging.off('dragend', _this._fireDragEnd, _this);
                    _this.setState(layer, 'common');
                });
            }
        },
        
        clearSelectedLayers: function(focusout){
            var _this = this;

            this.selectedLayers.forEach(function(_leaflet_id){
                var layer = _this.getLayer(_leaflet_id);
                layer.editDisable();
                layer.off('edit', _this._fireChanges, _this);
                layer.dragging.off('dragend', _this._fireDragEnd, _this);
                if (_this.geoType !== '1') {
                    _this.setState(layer, 'common');
                }
                if(focusout)
                    layer.fire('focusOut', {layer: layer});
            });

            this.selectedLayers = [];
        },
        setState: function (layer, state) {
            layer.setStyle(this.states[state]);
        },
        commonState: function (e) {
            var layer = e.layer;
            if (layer !== this.editLayer && this.geoType !== '1') {
                this.setState(layer, 'common');
            }
        },
        overState: function (e) {
            var layer = e.layer;
            if (layer !== this.editLayer && this.geoType !== '1') {
                this.setState(layer, 'over');
            }
        },
        loadLayers: function () {
            // 清除掉不在范围的图
            this.filterLayer.call(this);
            this.connect.loadData(this._group_id, this);
            return this;
        },
        saveLayers : function(){
            this.connect.saveData(this._map.changes, this._group_id, this);
            return this;
        },
        _renderLayers: function (e) {
            var dataSet = e.data && e.data.dataSet,
                geoType = dataSet.geoType;
            this.on('renderLayer', this._renderLayer, this);
            this.dataToLayer(geoType, dataSet);
            this.geoType = geoType;
            this.updateDataSet(dataSet);
        },
        _renderLayer: function (e) {
            var layer = e.layer;
            this.addLayer(layer);
        },
        dataToLayer: function (geoType, dataset) {
            var _this = this,
                done = {
                    '1': function (dataset) {
                        var nodes = dataset.node || [];
                        var layer;
                        nodes.forEach(function (node) {
                            layer = new ME.Marker({
                                id: node.id,
                                latlng: [node.lat, node.lon],
                                data : node
                            });

                            _this.fire('renderLayer', {layer: layer}, _this);
                        });
                    },
                    '2': function (dataset) {
                        var nodes = dataset.node || [],
                            ways = dataset.way || [],
                            layer, latlngs = [];

                        ways.forEach(function (way) {
                            latlngs = way.nd.map(function (n) {
                                var _node = nodes.filter(function (node) {
                                    return node.id == n.ref;
                                })[0];
                                return [_node.lat, _node.lon];
                            });

                            layer = new ME.Polyline({
                                id: way.id,
                                latlngs: latlngs,
                                data : way
                            });
                            _this.fire('renderLayer', {layer: layer}, _this);
                        });
                    },
                    '3': function (dataset) {
                        var nodes = dataset.node || [],
                            ways = dataset.way || [],
                            layer,
                            latlngs = [];

                        ways.forEach(function (way) {
                            latlngs = way.nd.map(function (n) {
                                var _node = nodes.filter(function (node) {
                                    return node.id == n.ref;
                                })[0];
                                return [_node.lat, _node.lon];
                            });

                            layer = new ME.Polygon({
                                id: way.id,
                                latlngs: latlngs,
                                data : way
                            });
                            _this.fire('renderLayer', {layer: layer}, _this);
                        });
                    }
                }
            done[geoType](dataset);
        },
        updateDataSet: function (dataSet) {
            this.dataSet = dataSet;
        },
        filterLayer: function () {
            var bounds, layers, _this = this;
            if (this._map) {
                bounds = this._map.getBounds();
                layers = this.getLayers() || [];
                layers.forEach(function (layer) {
                    var flag = _this.geoType == '1'
                        ? bounds.contains(layer.getLatLng())
                        : bounds.intersects(layer.getBounds());
                    if (!flag && !_this._map.changes.has(layer._leaflet_id)) {
                        _this.removeLayer(layer);
                    }
                });
            }
        },
        _fireDragEnd : function(e){
            var _this = this, layer = e.target.path, editing = layer.editing, markers;
            layer.fire('edit');
            markers = editing._markers;
            markers.forEach(function(marker){
                _this._map.changes.fire(/^-\d+$/.test(marker._leaflet_id)
                    ? 'created'
                    : 'modified', {layer: marker});
            });
        },
        _fireChanges: function (e) {
            var layer = e.target, type = e.type;
            this._map.changes.fire(/^-\d+$/.test(layer._leaflet_id)
                ? 'created'
                : 'modified', {layer: layer});
        },
        setConnect : function(connect){
            this.connect = connect;
            return this;
        },
        getConnect : function(){
            return this.connect;
        }
    });

    ME.Group = Group;
})(MapEditor);