;(function(ME){
    var Connect = L.Class.extend({
        includes: L.Mixin.Events,
        initialize: function (map) {
            this._map = map;
            this.http = new XHR(true);
        },
        loadData: function (groupid, group) {
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
                paras.dataSetId = groupid;

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
                    _this.fire('dataload:error',{data:data});
                    return;
                }
                dataSet = data.dataSet;
                _this.fire('dataload:success',{data : data});
            });
        },
        saveData: function (changes, groupid, group) {
            var _this = this,
                config = ME.Config,
                url = config.data.saveUrl,
                xhr = new XHR(true),
                paras = config.data.saveParas;

            paras.dataSetId = groupid;
            paras.xml = changes.toXML();
            xhr.post(url, {
                    paras : paras
                }, function(rst){
                    rst = JSON.parse(rst);
                    var status = rst.status;
                    if (status.msg !== 'success'){
                        _this.fire('datasave:error', {rst : rst}, _this);
                        return;
                    }
                    _this.fire('datasave:success', {rst : rst}, _this);
                    console.log('rst:', rst);
                });
        },
        abort : function(){
            this.http.abort();
        }
    });
    ME.Connect = Connect;
})(MapEditor);