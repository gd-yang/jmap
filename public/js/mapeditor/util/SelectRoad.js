ME.SelectRoad = L.Handler.extend({
    addHooks : function(){
        this._map.on('click', this.drawRoad, this);
        this.group = new ME.Group();
        this._map.editingGroup = this.group;
        this._map.addLayer(this.group);
        this._map._container.style.cursor = 'default';
    },
    removeHooks :function(){
        this._map.off('click', this.drawRoad, this);
    },
    drawRoad : function(e){
        var _this = this;
        var url = 'http://192.168.1.211:8018/gbox/gate?sid=9001';
        var xhr = new XHR(true);
        xhr.getJSON(url,{
            paras:{
                xy: e.latlng.lng + ',' + e.latlng.lat
            }
        }, function(data){
            var status = data.status;
            var roads = data.data;
            if (roads !== null){
                console.log(status.msg);
                roads.forEach(function(road){
                    road = road.split(';');
                    road = road.map(function(latlng){
                        return latlng.split(',').reverse();
                    });
                    console.log(road);
                    var layer = new L.Polyline(latlngs);
                    console.log(layer)
                    _this._map.addLayer(layer);
                });
            }

        })
    }
});