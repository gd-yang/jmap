/**
 * 画辅助线
 * @type {*}
 */
ME.Mode.DrawAssistMarker = ME.Mode.extend({
    initialize: function (map) {
        var handler = new ME.Draw.AssistMarker(map);
        ME.Mode.prototype.initialize.apply(this, [map, handler]);
    },
    _finish: function (data) {
        var layerType = data.layerType,
            layer = data.layer;
        if (layerType != "assistmarker") {
            return;
        }
        this.group.addLayer(layer);
    }
});