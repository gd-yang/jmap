/**
 * 画辅助线
 * @type {*}
 */
ME.Mode.DrawAssistLine = ME.Mode.extend({
    initialize: function (map) {
        var handler = new ME.Draw.AssistLine(map);
        ME.Mode.prototype.initialize.apply(this, [map, handler]);
    },
    _finish: function (data) {
        var layerType = data.layerType, layer = data.layer;
        if (layerType != "assistline") {
            return;
        }
        this.group.addLayer(layer);
    }
});