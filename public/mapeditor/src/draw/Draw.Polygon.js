(function(ME){
    ME.Draw.Polygon = ME.Draw.Polyline.extend({
        includes : L.Draw.Polygon,
        statics: {
            TYPE: 'polygon'
        },

        Poly: L.Polygon,

        options: {
            showArea: false,
            shapeOptions: {
                stroke: true,
                color: '#f06eaa',
                weight: 4,
                opacity: 0.5,
                fill: true,
                fillColor: null, //same as color by default
                fillOpacity: 0.2,
                clickable: true
            }
        },

        initialize: function (map, options) {
            ME.Draw.Polyline.prototype.initialize.call(this, map, options);
            this.type = L.Draw.Polygon.TYPE;
        }
    });
})(MapEditor);