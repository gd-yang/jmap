ME.Group = L.FeatureGroup.extend({
    statics: {
        _dfid: 0
    },
    initialize: function (options) {
        options = options || {};
        var layers = options.layers,
            dataSet = options.dataSet || {};
        L.LayerGroup.prototype.initialize.call(this, layers);
        this.editing = false;
        this.openning = false;
        this.states = new ME.State();
        this.dataSetId = options.dataSetId;
        this.geoType = dataSet.geoType;
        this.dataSet = dataSet;

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
        var _this = this;
        this.editing = true;

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
        if (!this.editing) {
            return;
        }
        var _this = this;
        this.editing = false;

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
        if (this.openning) {
            return;
        }
        this.openning = true;
        this.fire('open', {group: this});
        this.renderLayer();
    },
    close: function () {
        if (!this.openning) {
            return;
        }
        this.openning = false;
        if (this.editing) {
            this.editDisable();
        }
        this.fire('close', {group: this});
        delete this._map.openedGroup[this.dataSetId];
        this._map.removeLayer(this);
        delete this;
    },
    _fireEdit: function (e) {
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
        this.editLayer.editing.enable();
        this.editLayer.on('edit', function (e) {
            var layer = e.target;
            var method = /^-\d+$/g.test(layer._leaflet_id) ? 'created' : 'modified';
            this._map.changes.fire(method, {layer: layer});
        });
        if (this.geoType !== '1') {
            this.setState(this.editLayer, 'edit');
        }
    },
    _offEdit: function (e) {
        this.fire('editDisable', {group: this});
        if (this.geoType !== '1' && !!this.editLayer) {
            this.editLayer.editing.disable();
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
    renderLayer: function () {
        // 清除掉不在范围的图
        this.filterLayer.call(this);
        var bouns = this._map.getBounds(),
            ary = [bouns.getWest(), bouns.getSouth(), bouns.getEast(), bouns.getNorth()],
            xhr = new XHR(true), status, data, dataSet, _this = this;

        xhr.get(this._map.geturl, {
            paras: {
                dataSetId: this.dataSetId,
                zoom: this._map.getZoom(),
                bbox: ary.join(',')
            }
        }, function (result) {
            result = JSON.parse(result);
            status = result.status;
            data = result.data;

            if (status.msg !== 'success') {
                return;
            }
            console.log('加载成功！');
            dataSet = data.dataSet;
            _this.geoType = dataSet.geoType;
            // 只绘制新加载的数据
//            var nodes = _this.dataSet ? _this.dataSet.node.filter(function(node){
//                return _this.dataSet.node.indexOf(node) === -1;
//            }) : dataSet.node;
//            var ways = _this.dataSet ? _this.dataSet.way ? _this.dataSet.node.filter(function(way){
//                return _this.dataSet.way.indexOf(way) === -1;
//            }) : undefined : dataSet.way;
            ME.DataToLlayer[_this.geoType](_this, dataSet.node, dataSet.way, dataSet.relation);
            _this.updateDataSet(dataSet);
        });
    },
    updateDataSet: function (dataSet) {
        this.dataSet = dataSet;
    },
    filterDataSet: function (dataSet) {
        return dataSet
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
    _fireChanges: function (e) {
        var layer = e.target;
        this._map.changes.fire(/^-\d+$/.test(layer._leaflet_id)
            ? 'created'
            : 'modified', {layer: layer});
    }
});