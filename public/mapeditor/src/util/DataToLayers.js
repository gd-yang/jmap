ME.Util.DataToLayers = function (geoType, dataset, callback) {
    var done = {
            '1': function (dataset) {
                var nodes = dataset.node || [];
                var layer;
                nodes.forEach(function (node) {
                    layer = new ME.Marker({
                        id: node.id,
                        latlng: [node.lat, node.lon],
                        data: node
                    });
                    if (callback && typeof callback === 'function') {
                        callback(layer);
                    }
                });
            },
            '2': function (dataset) {
                var nodes = dataset.node || [],
                    ways = dataset.way || [],
                    layer, latlngs = [];

                ways.forEach(function (way) {
                    var nds = way.nd[0][0];
                    latlngs = nds.map(function (n) {
                        var _node = nodes.filter(function (node) {
                            return node.id == n.ref;
                        })[0];
                        return [_node.lat, _node.lon];
                    });

                    layer = new ME.Polyline({
                        id: way.id,
                        latlngs: latlngs,
                        data: way
                    });
                    if (callback && typeof callback === 'function') {
                        callback(layer);
                    }
                });
            },
            '3': function (dataset) {
                var nodes = dataset.node || [],
                    ways = dataset.way || [],
                    layer,
                    latlngs = [];

                ways.forEach(function (way) {
                    var nds = way.nd[0][0];
                    latlngs = nds.map(function (n) {
                        var _node = nodes.filter(function (node) {
                            return node.id == n.ref;
                        })[0];
                        return [_node.lat, _node.lon];
                    });

                    layer = new ME.Polygon({
                        id: way.id,
                        latlngs: latlngs,
                        data: way
                    });
                    if (callback && typeof callback === 'function') {
                        callback(layer);
                    }
                });
            }
        }
    done[geoType](dataset);
}