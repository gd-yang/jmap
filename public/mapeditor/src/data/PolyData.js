;(function(ME){
    ME.Data.PolyData = ME.Data.CommonData.extend({
        initialize : function(data){
            ME.Data.CommonData.prototype.call(this, data);
            this.nd = data.nd||[];
            this.way = data.way||[];
        },
        spliceNd : function(){
            var args = Array.prototype.slice.call(arguments)
            Array.prototype.splice.apply(this.nd, args);
        },
        spliceWay : function(){
            var args = Array.prototype.slice.call(arguments)
            Array.prototype.splice.apply(this.way, args);
        },
        getNd : function(){
            return this.nd;
        },
        setNd : function(nd){
            this.nd = nd;
        },
        getWay : function(){
            return this.way;
        },
        setWay : function(way){
           this.way = way;
        }
    });
})(MapEditor);