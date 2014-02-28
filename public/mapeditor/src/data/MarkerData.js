;(function(ME){
    ME.Data.MarkerData = ME.Data.CommonData.extend({
        initialize : function(data){
            ME.Data.CommonData.prototype.call(this, data);
            this.lat = data.lat;
            this.lon = data.lon;
        },
        setLatlon : function(latlon){
            this.lat = latlon[0];
            this.lon = latlon[1];
        },
        getLatlon : function(){
            return [this.lat, this.lon];
        },
        setLat : function(lat){
            this.lat = lat;
        },
        getLat : function(){
            return this.lat;
        },
        getLon : function(){
            return this.lon;
        },
        setLon : function(lon){
            this.lon = lon;
        }
    });
})(MapEditor);