/**
 * 辅助面,不产生数据交互
 * @type {*}
 */
ME.Entity.AssistPolygon = L.Polygon.extend({
    includes: ME.Entity.EditBind,
    initialize: function (lanlngs, options) {
        L.Polygon.prototype.initialize.call(this, lanlngs, options);
        this.type = 'assistpolygon';
        this.states = new ME.State();
        this.selected = false;
    },
    toPolygon: function () {

    }
});