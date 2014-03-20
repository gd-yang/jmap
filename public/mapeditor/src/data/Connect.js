(function (ME) {
    /**
     * 内置Connect加载上传数据
     * @type {*}
     */
    ME.Connect= L.Class.extend({
        includes : L.Mixin.Events,
        initialize : function(map, options){
            options = options || {};
            var _ladUrl = options.loadUrl || '', _loadParas = options.loadParas || null,
                _saveUrl = options.saveUrl || '', _saveParas = options.saveParas || null;
            this.http = new XHR({
                cross : true
            });
            this.map = map;

            if (!!_ladUrl && !!_loadParas){
                this.createLoad(_ladUrl, _loadParas);
            }

            if (!!_saveUrl && !!_saveParas){
                this.createSave(_saveUrl, _saveParas);
            }
        },
        /**
         * @method 创建加载通道
         * @param url
         * @param paras
         */
        createLoad : function(url, paras){
            var _this =this, _url = url, _paras = paras;
            this.loadData = function(callback){
                _this.http.get(_url, {
                    paras : _paras
                }, function(result){
                    var data;
                    result = JSON.parse(result);
                    data = result.data;

                    if (!data) {
                        _this.fire('dataload:error',{data:data});
                        return;
                    }

                    _this.fire('dataload:success',{data : data});
                    if (!!callback && typeof callback == 'function'){
                        callback(data.data.dataSet);
                    }
                })
            }
        },
        /**
         * @method 创建保存通道
         * @param url
         * @param paras
         */
        createSave : function(url, paras){
            var _this=this, _url = url, _paras = paras;
            this.saveData = function(callback){
                this.http.post(_url, {
                    paras : _paras
                }, function(result){
                    result = JSON.parse(result);
                    var data = result.data;

                    if (!data){
                        _this.fire('datasave:error', {data : data}, _this);
                        return;
                    }
                    _this.fire('datasave:success', {data:data});
                    if (!!callback && typeof callback == 'function'){
                        callback(data.gds.data);
                    }
                })
            }
        }
    });
})(MapEditor);