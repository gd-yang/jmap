define(function (require, exports, module) {
    console.log(L)
    var Connect= L.Class.extend({
        includes : L.Mixin.Events,
        initialize : function(){
            this.http = new XHR(true);
        },
        loadData: function (groupid) {
            var url = 'http://192.168.1.210:8090/sorting_web/gate',
                polygonCode = groupid || null,
                _this = this;
            this.http.get(url, {
                paras : {
                    sid : '2005',
                    polygonCode : polygonCode,
                    clientKey : 'aa1352ff-e2c3-490f-9dad-ec85a13eee99'
                }
            }, function(result){
                console.log(result);
                var data;
                result = JSON.parse(result);
                data = result.data;

                if (!data) {
                    _this.fire('dataload:error',{data:data});
                    return;
                }
                _this.fire('dataload:success',{data : data.data});
            })
        },
        saveData: function (changes, groupid) {
            var url = 'http://192.168.1.210:8090/sorting_web/gate',
                polygonCode = groupid || null;
            this.http.post(url, {
                paras : {
                    sid : '2004',
                    polygonCode : polygonCode,
                    clientKey : 'aa1352ff-e2c3-490f-9dad-ec85a13eee99',
                    xml : changes.toXML()
                }
            }, function(result){
                var _this = this;
                result = JSON.parse(result);
                var data = result.data;
                if (!data){
                    _this.fire('datasave:error', {data : data}, _this);
                    return;
                }
                _this.fire('datasave:success', {data : data}, _this);
                console.log('result:', result);
            })
        }
    });
    console.log(Connect)
    module.exports = Connect;
});