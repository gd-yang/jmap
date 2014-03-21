/**
 * 辅助线,不产生数据交互
 * @type {*}
 */
ME.Entity.AssistLine = L.Polyline.extend({
    includes: ME.Entity.EditBind,
    initialize: function (lanlngs, options) {
        var isFireEdit;
        L.Polyline.prototype.initialize.call(this, lanlngs, options);
        if (options){
            isFireEdit = options.isFireEdit;
        }
        this.type = 'assistline';
        this.states = new ME.State();
        this.selected = false;
        this.edited = false;
        this.isFireEdit = isFireEdit !== false;
    },
    toPolyline: function () {
        return this;
    }
});