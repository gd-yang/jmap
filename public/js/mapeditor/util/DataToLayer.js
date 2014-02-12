ME.DataToLlayer = {
    '1' : function(group, nodes){
        nodes = nodes || [];
        var layer;
        nodes.forEach(function(node){
            layer = new ME.Marker({
                id : node.id,
                latlng : [node.lat, node.lon],
                tags : node.tag,
                changeset : node.changeset,
                version : node.version
            });

            group.addLayer(layer);
        });
    },
    '2' : function(group, nodes, ways){
        nodes = nodes || [];
        ways = ways||[];
        var layer, latlngs=[];

        ways.forEach(function(way){
            latlngs = way.nd.map(function(n){
                var _node = nodes.filter(function(node){
                    return node.id == n.ref;
                })[0];
                return [_node.lat, _node.lon];
            });

            layer = new ME.Polyline({
                id : way.id,
                latlngs : latlngs,
                tags : way.tag,
                nd : way.nd,
                changeset : way.changeset,
                version : way.version
            });
            group.addLayer(layer);
        });
    },
    '3' : function(group, nodes, ways){
        nodes = nodes || [];
        nodes = nodes || [];
        ways = ways||[];
        var layer, latlngs=[];

        ways.forEach(function(way){
            latlngs = way.nd.map(function(n){
                var _node = nodes.filter(function(node){
                    return node.id == n.ref;
                })[0];
                return [_node.lat, _node.lon];
            });

            layer = new ME.Polygon({
                id : way.id,
                latlngs : latlngs,
                tags : way.tag,
                nd : way.nd,
                changeset : way.changeset,
                version : way.version
            });
            group.addLayer(layer);
        });
    }
}