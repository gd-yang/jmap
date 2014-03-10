/**
 * 画辅助线
 * @type {*}
 */
ME.Mode.DrawAssistPolygon = ME.Mode.extend({
    initialize: function (map) {
        var handler = new ME.Draw.AssistPolygon(map);
        ME.Mode.prototype.initialize.apply(this, [map, handler]);
    },
    _finish: function (data) {
        var layerType = data.layerType,
            layer = data.layer;
        if (layerType != "assistpolygon") {
            return;
        }
        this.group.addLayer(layer);
    }
});