/**
 * 辅助点,不产生数据交互
 * @type {*}
 */
ME.Entity.AssistMarker = L.Marker.extend({
    includes: ME.Entity.EditBind,
    initialize: function (lanlng, options) {
        L.Marker.prototype.initialize.call(this, lanlng, options);
        this.type = 'assistmarker';
        this.states = new ME.State();
        this.selected = false;
    },
    setStyle : function(options){
        options = L.extend({}, this.options, options);
        this.setIcon(options.icon);
        this.setOpacity(options.opacity);
    },
    toMarker : function () {

    }
});