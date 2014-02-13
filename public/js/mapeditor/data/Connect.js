;(function(ME){
    var Connect = L.Class.extend({
        statics : {
            dataToLayer : {
                '1' : function(group, nodes){
                    nodes = nodes || [];
                    var layer;
                    nodes.forEach(function(node){
                        layer = new ME.Marker({
                            id : node.id,
                            latlng : [node.lat, node.lon],
                            tags : node.tag,
                            changeset : node.changeset,
                            version : node.version
                        });

                        group.addLayer(layer);
                    });
                },
                '2' : function(group, nodes, ways){
                    nodes = nodes || [];
                    ways = ways||[];
                    var layer, latlngs=[];

                    ways.forEach(function(way){
                        latlngs = way.nd.map(function(n){
                            var _node = nodes.filter(function(node){
                                return node.id == n.ref;
                            })[0];
                            return [_node.lat, _node.lon];
                        });

                        layer = new ME.Polyline({
                            id : way.id,
                            latlngs : latlngs,
                            tags : way.tag,
                            nd : way.nd,
                            changeset : way.changeset,
                            version : way.version
                        });
                        group.addLayer(layer);
                    });
                },
                '3' : function(group, nodes, ways){
                    nodes = nodes || [];
                    nodes = nodes || [];
                    ways = ways||[];
                    var layer, latlngs=[];

                    ways.forEach(function(way){
                        latlngs = way.nd.map(function(n){
                            var _node = nodes.filter(function(node){
                                return node.id == n.ref;
                            })[0];
                            return [_node.lat, _node.lon];
                        });

                        layer = new ME.Polygon({
                            id : way.id,
                            latlngs : latlngs,
                            tags : way.tag,
                            nd : way.nd,
                            changeset : way.changeset,
                            version : way.version
                        });
                        group.addLayer(layer);
                    });
                }
            }
        },
        includes: L.Mixin.Events,
        initialize: function (options) {
            this._map = options.map;
            this.loadDataUrl = options.loadDataUrl;
            this.saveDataUrl = options.saveDataUrl;
        },
        loadData: function (options) {
            options = options || {};
            var http = new XHR(true),
                bounds = this._map.getBounds(),
                ary = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
                group = this._map.editingGroup,
                dataSetId = group.dataSetId,
                _this = this,
                // 初始化加载参数
                paras = options.paras || ME.Config.data.loadParas;
                paras.zoom = _this._map.getZoom();
                paras.bbox = ary.join(',');
                paras.dataSetId = dataSetId;
            // 开始加载
            http.getJSON(this.loadDataUrl, {
                paras : paras
            }, function (result) {
                var data, status, dataSet;
                //result = JSON.parse(result);
                status = result.status;
                data = result.data;

                if (status.msg !== 'success') {
                    return;
                }
                dataSet = data.dataSet;
                group.geoType = dataSet.geoType;
                Connect.dataToLayer[group.geoType](group, dataSet.node, dataSet.way, dataSet.relation);
                group.updateDataSet(dataSet);
            });
        },
        saveData: function () {

        }
    });
    ME.Connect = Connect;
})(MapEditor);