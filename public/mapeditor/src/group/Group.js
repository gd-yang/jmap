;
(function (ME) {
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
            this._group_id = groupid;

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
                return;
            }

            this.editing = true;
            map.editingGroup = this;
            if (!this.openning) {
                this.open();
            }
            if (this.geoType == '1') {
                this.eachLayer(function (layer) {
                    layer.dragging.enable();
                    layer.on('dragend', _this._fireChanges, _this);
                });
                return;
            }
            this.on('click', this._fireEdit);
            this.on('mouseover', this.overState);
            this.on('mouseout', this.commonState);
        },
        editDisable: function () {
            var _this = this, map = this._map;
            if (!this.editing) {
                return;
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
                return;
            }
            this._offEdit.call(_this);
            this.off('click', this._fireEdit);
            this.off('mouseover', this.overState);
            this.off('mouseout', this.commonState);
        },
        open: function () {
            var map = this._map;
            if (this.openning) {
                return;
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
        },
        close: function () {
            var map = this._map;
            if (!this.openning) {
                return;
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
        },
        _fireEdit: function (e) {
            var _this = this;
            this.fire('editAble', {group: this});
            if (this.editLayer) {
                this.editLayer.editing.disable();
                var oldLayer = this.editLayer;
                if (this.geoType !== '1') {
                    this.setState(this.editLayer, 'common');
                }
                this.editLayer.fire('focusOut', {layer: oldLayer});
            }
            this.editLayer = e.layer;
            this.editLayer.fire('focusIn', {layer: this.editLayer});
            this.editLayer.editEnable();
            this.editLayer.on('edit', this._fireChanges, this);
            this.editLayer.dragging.on('dragend', this._fireDragEnd, this);
            if (this.geoType !== '1') {
                this.setState(this.editLayer, 'edit');
            }
        },
        _offEdit: function (e) {
            var _this = this;
            this.fire('editDisable', {group: this});
            if (this.geoType !== '1' && !!this.editLayer) {
                this.editLayer.editDisable();
                this.editLayer.off('edit', this._fireChanges, this);
                this.editLayer.dragging.off('dragend', this._fireDragEnd, this);
                this.setState(this.editLayer, 'common');
            }
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
        },
        saveLayers : function(){
            this.connect.saveData(this._map.changes, this._group_id, this);
        },
        _renderLayers: function (e) {
            var dataSet = e.data && e.data.dataSet,
                geoType = dataSet.geoType,
                nodes = dataSet.node,
                ways = dataSet.way;
            this.on('renderLayer', this._renderLayer, this);
            this.dataToLayer(geoType, nodes, ways);
            this.geoType = geoType;
            this.updateDataSet(dataSet);
        },
        _renderLayer: function (e) {
            var layer = e.layer;
            this.addLayer(layer);
        },
        dataToLayer: function (geoType, nodes, ways) {
            var _this = this,
                done = {
                    '1': function (nodes) {
                        nodes = nodes || [];
                        var layer;
                        nodes.forEach(function (node) {
                            layer = new ME.Marker({
                                id: node.id,
                                latlng: [node.lat, node.lon],
                                tags: node.tag,
                                changeset: node.changeset,
                                version: node.version
                            });

                            _this.fire('renderLayer', {layer: layer}, _this);
                        });
                    },
                    '2': function (nodes, ways) {
                        nodes = nodes || [];
                        ways = ways || [];
                        var layer, latlngs = [];

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
                                tags: way.tag,
                                nd: way.nd,
                                changeset: way.changeset,
                                version: way.version
                            });
                            _this.fire('renderLayer', {layer: layer}, _this);
                        });
                    },
                    '3': function (nodes, ways) {
                        nodes = nodes || [];
                        nodes = nodes || [];
                        ways = ways || [];
                        var layer, latlngs = [];

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
                                tags: way.tag,
                                nd: way.nd,
                                changeset: way.changeset,
                                version: way.version
                            });
                            _this.fire('renderLayer', {layer: layer}, _this);
                        });
                    }
                }
            done[geoType](nodes, ways);
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
        },
        getConnect : function(){
            return this.connect;
        }
    });

    ME.Group = Group;
})(MapEditor);