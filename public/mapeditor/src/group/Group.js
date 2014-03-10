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

            this.on('click', function (e) {
                console.log('click:', e.layer);
            });
        },
        editAble: function () {
            var _this = this, map = this._map;
            if (this.editing || !this.openning) {
                return this;
            }

            this.editing = true;
            map.editingGroup = this;
            this.on('datalayer:add datalayer:remove', this._fireChanges, this);
            this.on('layeradd', this._fireLayerAdd, this);
            this.on('layerremove', this._fireLayerRemove, this);
            // 处理选中层
            this.on('click', this._fireSelect, this);
            this.eachLayer(function (layer) {
                layer.editEnable();
            });
            // 触发后添加层的编辑状态

            this.fire('editAble', {group: this});
            return this;
        },
        editDisable: function () {
            var _this = this, map = this._map;
            if (!this.editing) {
                return this;
            }
            this.editing = false;
            map.editingGroup = null;
            this.off('click', this._fireSelect, this);

            this.eachLayer(function (layer) {
                layer.editDisable();
            });
            this.off('datalayer:add datalayer:remove', this._fireChanges, this);
            this.off('layeradd', this._fireLayerAdd, this);
            this.off('layerremove', this._fireLayerRemove, this);
            this._offSelect.call(this);
            this.fire('editDisable', {group: this});
            return this;
        },
        _fireLayerAdd : function(e){
            var layer = e.layer;
            if (layer.isFireEdit){
                layer.editEnable();
            }
        },
        _fireLayerRemove : function(e){
            var layer = e.layer;
            if (layer.isFireEdit){
                layer.editDisable();
            }
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
            map.removeDataGroup(this);
            map.changes.clear();
            return this;
        },
        _fireSelect: function (e) {
            var _this = this,
                targetLayer = e.layer,
                _leaflet_id = targetLayer._leaflet_id,
                index;

            if (!e.originalEvent.shiftKey) {
                if (this.selectedLayers.indexOf(_leaflet_id) == -1){
                    this.selectedLayers.forEach(function(_leaflet_id){
                        _this.getLayer(_leaflet_id).fire('selectOut');
                    });
                    this.selectedLayers.length = 0;
                    this.selectedLayers.push(_leaflet_id);
                    targetLayer.fire('selectIn');
                }else{
                    this.selectedLayers.forEach(function(_leaflet_id){
                        var layer = _this.getLayer(_leaflet_id);
                        if (layer !== targetLayer){
                            layer.fire('selectOut');
                        }
                    });
                    this.selectedLayers = [_leaflet_id];
                }
            }else{
                if (this.selectedLayers.indexOf(_leaflet_id) == -1){
                    this.selectedLayers.push(_leaflet_id);
                    targetLayer.fire('selectIn');
                }else{
                    index = this.selectedLayers.indexOf(_leaflet_id);
                    this.selectedLayers.splice(index, 1);
                    targetLayer.fire('selectOut');
                }
            }
        },
        _offSelect: function (e) {
            var _this = this;
            this.selectedLayers.forEach(function (_leaflet_id) {
                var layer = _this.getLayer(_leaflet_id);
                layer.fire('selectOut');
            });
            //this.selectedLayers = [];
        },
        clearSelectedLayers : function(options){
            options = options || {};
            var remove = options.remove,
                _this = this;
            this.selectedLayers.forEach(function(_leaflet_id){
                var layer = _this.getLayer(_leaflet_id);
                layer.fire('selectOut');
                if (!!remove){
                    _this.removeDataLayer(layer);
                }
            });
            this.fire('clearSelectedLayers');
            this.selectedLayers = [];
        },
        addDataLayer: function (layer) {
            if (!this.editing) {
                return;
            }

            L.FeatureGroup.prototype.addLayer.call(this, layer);
            this.fire('datalayer:add', {layer: layer});
        },
        removeDataLayer: function (layer) {
            var _this = this, markers, type;
            if (!this.editing) {
                return;
            }

            if (typeof layer === 'string') {
                layer = this.getLayer(layer);
            }
            type = layer.type;
            // 删除polyline或者polygon需要删除线上的点
            if (type == 'polyline' || type == 'polygon') {
                markers = layer.editing._markers;
                markers.forEach(function (marker) {
                    _this.fire('datalayer:remove', {layer: marker}, _this);
                });
            }
            layer.editDisable();
            this.fire('datalayer:remove', {layer: layer});
            L.FeatureGroup.prototype.removeLayer.call(this, layer);
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
                _this._map.clearChanges();
                _this.clearSelectedLayers();
                _this.clearLayers();
                _this.loadLayers();
            });
            return this;
        },
        _renderLayers : function (dataSet) {
            var geoType = dataSet.geoType, _this=this, map = this._map;
            this.geoType = geoType;
            this.updateDataSet(dataSet);
            ME.Util.DataToLayers(geoType, dataSet, function(layer){
                var _leaflet_id = layer._leaflet_id;
                // 已经删除的不需要渲染
                if (map.changes.deleted.has(_leaflet_id)){
                    return;
                }
                _this.addLayer(layer);
            });
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
                    var flag = _this.geoType && (_this.geoType == '1' ?
                               bounds.contains(layer.getLatLng()) : bounds.intersects(layer.getBounds())),
                        _leaflet_id = layer._leaflet_id;
                    // 不是新创建的并且不在视野范围内并且也没在changes里的就可以清除掉
                    if (!(/^-\d+/.test(_leaflet_id)) && !flag && !_this._map.changes.has(_leaflet_id)) {
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
        },
        _fireChanges : function(e){
            var type = e.type,
                layer = e.layer,
                map = this._map;

            switch (type){
                case 'datalayer:add':
                    map.changes.fire('created', {layer:layer});
                    break;
                case 'datalayer:remove' :
                    map.changes.fire('deleted', {layer:layer});
                    break;
            }
        }
    });

    ME.Group = Group;
})(MapEditor);