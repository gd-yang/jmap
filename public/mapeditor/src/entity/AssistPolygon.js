/**
 * 辅助面,不产生数据交互
 * @type {*}
 */
ME.Entity.AssistPolygon = L.Polygon.extend({
    includes: ME.Entity.EditBind,
    initialize: function (lanlngs, options) {
        var isFireEdit;
        if (options){
            isFireEdit = options.isFireEdit;
        }
        L.Polygon.prototype.initialize.call(this, lanlngs, options);
        this.type = 'assistpolygon';
        this.states = new ME.State();
        this.selected = false;
        this.edited = false;
        this.isFireEdit = isFireEdit !== false;
    },
    toPolygon: function () {
        return this;
    }
});