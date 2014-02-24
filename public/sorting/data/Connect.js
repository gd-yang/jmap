define(function (require, exports, module) {
    var Connect= L.Class.extend({
        includes : L.Mixin.Events,
        initialize : function(map){
            this.http = new XHR(true);
            this.map = map;
        },
        loadData: function (callback) {
            var url = 'http://192.168.1.210:8090/sorting_web/gate',
                _this = this;
            this.http.get(url, {
                paras : {
                    sid : '2005',
                    polygonCode : this.polygonCode,
                    clientKey : 'aa1352ff-e2c3-490f-9dad-ec85a13eee99'
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
        saveData: function () {
            var _this = this;
            var url = 'http://192.168.1.210:8090/sorting_web/gate';
            this.http.post(url, {
                paras : {
                    sid : '2004',
                    polygonCode : this.polygonCode,
                    clientKey : 'aa1352ff-e2c3-490f-9dad-ec85a13eee99',
                    xml : this.map.changes.toXML()
                }
            }, function(result){
                result = JSON.parse(result);
                var data = result.data;

                if (!data){
                    _this.fire('datasave:error', {data : data}, _this);
                    return;
                }
                console.log(data);
                _this.fire('datasave:success', {data : data}, _this);
                console.log('result:', result);
            })
        }
    });
    console.log(Connect)
    module.exports = Connect;
});