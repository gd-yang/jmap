;(function(ME){
    var Connect = L.Class.extend({
        includes: L.Mixin.Events,
        initialize: function (map) {
            this._map = map;
            this.http = new XHR(true);
        },
        loadData: function (options) {
            options = options || {};
            var _this = this,
                map = this._map,
                config = ME.Config,
                bounds = this._map.getBounds(),
                ary = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
                dataSetId = options.dataSetId,
                url = config.data.loadUrl,
                // 初始化加载参数
                paras = options.paras || config.data.loadParas;
                paras.zoom = map.getZoom();
                paras.bbox = ary.join(',');
                paras.dataSetId = dataSetId;

            //this.abort();
            // 开始加载
            this.http.get(url, {
                paras : paras
            }, function (result) {
                var data, status, dataSet;
                result = JSON.parse(result);
                status = result.status;
                data = result.data;

                if (status.msg !== 'success') {
                    return;
                }
                dataSet = data.dataSet;
                _this.fire('dataset:loaded',{dataSet : dataSet});
            });
        },
        saveData: function (options) {
            options = options || {};
            var config = ME.Config,
                map = this._map,
                url = config.data.saveUrl,
                xhr = new XHR(true),
                paras = options.paras || config.data.saveParas;

            paras.dataSetId = map.editingGroup.dataSetId;
            paras.xml = map.changes.toXML();
            xhr.post(url, {
                    paras : paras
                }, function(rst){
                    map.changes.clear();
                    console.log('rst:', rst);
                }
            );
        },
        abort : function(){
            this.http.abort();
        }
    });
    ME.Connect = Connect;
})(MapEditor);