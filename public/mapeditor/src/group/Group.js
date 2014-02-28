;(function (ME) {
    var Group = L.FeatureGroup.extend({
        initialize: function (options) {
            options = options || {};
            var layers = options.layers;

            L.LayerGroup.prototype.initialize.call(this, layers);
            this.editing = false;
            this.openning = false;
            this.selectedLayers = [];
            this.connect = options.connect;

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
            if (this.editing || !this.openning) {
                return this;
            }

            this.editing = true;
            map.editingGroup = this;
            // 处理选中层
            this.on('click', this._fireSelect, this);
            this.eachLayer(function (layer) {
                layer.editEnable();
            });
            // 触发后添加层的编辑状态
            this.on('layeradd', this._layerEdit);
            this.fire('editAble', {group: this});
            return this;
        },
        editDisable: function () {
            var _this = this, map = this._map;
            if (!this.editing) {
                return this;
            }
            this.editing = false;
            delete map.editingGroup;
            this.off('click', this._fireSelect, this);
            this.eachLayer(function (layer) {
                layer.editDisable();
            });

            this._offSelect.call(this);
            this.off('layeradd', this._layerEdit);
            this.fire('editDisable', {group: this});
            return this;
        },
        _layerEdit : function(e){
            var layer = e.layer;
            layer.editEnable();
        },
        open: function () {
            if (this.openning || !this._map) {
                return this;
            }
            this.openning = true;
            this.fire('open', {group: this});
            return this;
        },
        close: function () {
            var map = this._map;
            if (!this.openning || !map) {
                return this;
            }
            if (this.editing){
                this.editDisable();
            }
            this.openning = false;
            this.fire('close', {group: this});
            this.off('renderLayer', this._renderLayer, this);
            map.removeDataGroup(this);
            map.changes.clear();
            return this;
        },
        _fireSelect: function (e) {
            var _this = this,
                targetLayer = e.layer,
                _leaflet_id = targetLayer._leaflet_id;

            if (!e.originalEvent.shiftKey) {
                this.selectedLayers.forEach(function(_leaflet_id){
                    var layer = _this.getLayer(_leaflet_id);
                    if (layer !== targetLayer){
                        layer.fire('selectOut');
                    }
                });
            }

            if (this.selectedLayers.indexOf(_leaflet_id) == -1){
                if (!e.originalEvent.shiftKey){
                    this.selectedLayers.length = 0;
                }
                this.selectedLayers.push(_leaflet_id);
            }
            if (this.focusLayer && this.focusLayer !== targetLayer){
                this.focusLayer.fire('focusOut');
            }
            this.focusLayer = targetLayer;
            this.focusLayer.fire('focusIn');
        },
        _offSelect: function (e) {
            var _this = this;
            this.selectedLayers.forEach(function (_leaflet_id) {
                var layer = _this.getLayer(_leaflet_id);
                layer.setState('common');
            });
            this.selectedLayers = [];
        },
        
        clearSelectedLayers: function(){
            var _this = this;
            this.selectedLayers.forEach(function(_leaflet_id){
                var layer = _this.getLayer(_leaflet_id);
                layer.editDisable();
                _this.removeLayer(layer);
            });

            this.selectedLayers = [];
        },

        loadLayers: function () {
            var _this = this;
            // 清除掉不在范围的图
            this.filterLayer.call(this);
            this.connect.loadData(function(dataSet){
                _this._renderLayers.call(_this, dataSet);
            });
            return this;
        },
        saveLayers : function(){
            var _this = this;
            this.connect.saveData(function(data){
                console.log('保存执行回调！！')
                var nodes, ways;
                _this._map.clearChanges();
                _this.clearSelectedLayers();
                _this.clearLayers();
                _this.loadLayers();
//                console.log('data：',data);
//                if (!!data){
//                   nodes = data.node||[];
//                   ways = data.way||[];
//                }
//                ways.forEach(function(way){
//                    var oldId = way.oldId,
//                        newId = way.newId,
//                        newVersion = way.newVersion,
//                        layer = _this.getLayer(oldId);
//                    console.log(layer);
//                    layer._leaflet_id = newId;
//                    layer.version = newVersion;
//                    console.log(_this.getLayer(newId));
//                    console.log(_this.getLayer(oldId));
//                });
            });
            return this;
        },
        _renderLayers : function (dataSet) {
            var geoType = dataSet.geoType;
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
                                latlngs : latlngs,
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