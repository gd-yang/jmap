/**
 * 	
 * click on map to select road
 * @memberOf  ME.Handler
 * @constructor
 * @name ME/Handler/SelectRoad
 */
ME.Handler.SelectRoad = L.Handler.extend(
/**
 * @lends ME.Handler.ME/Handler/SelectRoad.prototype
 */
{
	includes: L.Mixin.Events,
	options: {
		url: 'http://119.90.32.30/gbox/gate?sid=9001',
        repeatMode: false
	},

    addHooks : function(){
        this._map.on('click', this._getRoads, this);
        this._map._container.style.cursor = 'default';

        this.fire('enabled');
    },
    removeHooks :function(){
        this._map.off('click', this._getRoads, this);
        this._map._container.style.cursor = '-webkit-grab';

        this.fire('disabled');
    },
    /**
     * click call back
     * @private
     * @param e  {Object} e
     */
    _getRoads : function(e){
        var _this = this;
        var url = this.options.url;
        
        var cb = function(data){
            var status = data.status;
            var roads = data.data;
            if (roads !== null){
                roads = roads.map(function(road){
	                    road = road.split(';');
	                    road = road.map(function(latlng){
	                        latlng = latlng.split(',');
	                        return new L.LatLng(latlng[1], latlng[0]);
	                    });
	                    return road;
                });

                _this._map.fire('draw:created', {roads : roads, pathtype : "pointSelectRoad"});
            }

            _this.disable();
            if(_this.options.repeatMode)
                _this.enable();
        };

        ME.Util.pointSelectRoad({
            url : this.options.url,
            lng : e.latlng.lng,
            lat : e.latlng.lat
        },cb,this);
    }
});