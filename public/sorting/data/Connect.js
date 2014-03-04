define(function (require, exports, module) {
    var Connect= L.Class.extend({
        includes : L.Mixin.Events,
        initialize : function(map){
            this.http = new XHR(true);
            this.map = map;
            this.on('dataload:error', function(){
                alert('数据加载失败！');
            });

            this.on('datasave:error', function(){
                alert('数据保存失败！');
            });

            this.on('datasave:success', function(){
                alert('数据保存成功！');
            });
        },
        loadData: function (callback) {
            var url = 'http://192.168.1.210:8090/sorting_web/gate',
                _this = this;
            this.http.get(url, {
                paras : {
                    sid : '2005',
                    polygonCode : this.polygonCode,
                    clientKey : $.trim($('.clientKey').text()),
                    now : (new Date()).getTime()
                }
            }, function(result){
                var data;
                result = JSON.parse(result);
                data = result.data;

                if (!data) {
                    _this.fire('dataload:error',{data:data});
                    return;
                }
                console.log(data)
                if (!!callback && typeof callback == 'function'){
                    callback(data.data.dataSet);
                }
            })
        },
        saveData: function(callback) {
            var _this = this;
            var url = 'http://192.168.1.210:8090/sorting_web/gate';
            this.http.post(url, {
                paras : {
                    sid : '2004',
                    polygonCode : this.polygonCode,
                    clientKey : $.trim($('.clientKey').text()),
                    xml : this.map.changes.toXML()
                }
            }, function(result){
                result = JSON.parse(result);
                var data = result.data;

                if (!data){
                    _this.fire('datasave:error', {data : data}, _this);
                    return;
                }
                _this.polygonCode = data.polygonCode;
                _this.fire('datasave:success', {data:data});
                if (!!callback && typeof callback == 'function'){
                    callback(data.gds.data);
                }
            })
        }
    });

    module.exports = Connect;
});