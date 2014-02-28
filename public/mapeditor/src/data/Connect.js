;(function(ME){
    var Connect = L.Class.extend({
        includes: L.Mixin.Events,
        initialize: function (map, datasetId) {
            this._map = map;
            this.datasetId = datasetId;
            this.http = new XHR(true);
        },
        loadData: function (callback) {
            var _this = this,
                map = this._map,
                config = ME.Config,
                bounds = this._map.getBounds(),
                ary = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
                url = config.data.loadUrl,
                // 初始化加载参数
                paras = config.data.loadParas;
                paras.zoom = map.getZoom();
                paras.bbox = ary.join(',');
                paras.dataSetId = this.datasetId;

            //this.abort();
            // 开始加载
            this.http.get(url, {
                paras : paras
            }, function (result) {
                var data, status, dataSet;
                result = JSON.parse(result);
                status = result.status;
                data = result.data;

                if (!data) {
                    _this.fire('dataload:error',{data:data});
                    return;
                }
                dataSet = data.dataSet;
                if (!!callback && typeof callback === 'function') {
                    callback(dataSet);
                }
            });
        },
        saveData: function (callback) {
            var _this = this,
                config = ME.Config,
                url = config.data.saveUrl,
                xhr = new XHR(true),
                paras = config.data.saveParas;

            paras.dataSetId = this.datasetId;
            paras.xml = this._map.changes.toXML();
            xhr.post(url, {
                    paras : paras
                }, function(rst){
                    rst = JSON.parse(rst);
                    var status = rst.status,
                        data = rst.data;
                    if (!data){
                        _this.fire('datasave:error', {rst : rst}, _this);
                        return;
                    }
                    if (!!callback && typeof callback === 'function') {
                        callback(data);
                    }
                });
        },
        abort : function(){
            this.http.abort();
        }
    });
    ME.Connect = Connect;
})(MapEditor);