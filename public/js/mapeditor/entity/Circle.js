ME.Circle = L.Circle.extend({
    initialize: function (latlng, radius, options) {
        L.Circle.prototype.initialize.call(this, latlng, radius, options);

    },
    getId: function () {
        return L.stamp(this);
    },
    type: 'circle'
});