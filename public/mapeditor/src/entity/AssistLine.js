/**
 * 辅助线,不产生数据交互
 * @type {*}
 */
ME.Entity.AssistLine = L.Polyline.extend({
    includes: ME.Entity.EditBind,
    initialize: function (lanlngs, options) {
        L.Polyline.prototype.initialize.call(this, lanlngs, options);
        this.type = 'AssistLine';
        this.states = new ME.State();
        this.selected = false;
    },
    toPolyling: function () {

    }
});