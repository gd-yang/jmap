;(function(ME){
    ME.Config = {
        map : {
            //tileUrlTemplate : 'http://emap{s}.mapabc.com/mapabc/maptile?x={x}&y={y}&z={z}'
            tileUrlTemplate :'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        },
        data :  {
            loadUrl : 'http://119.90.32.30/gbox/gate',
            saveUrl : 'http://119.90.32.30/gbox/gate',
            selectRoadUrl : 'http://119.90.32.30/gbox/gate?sid=9001',
            getPolygonFromRoadsUrl: "http://119.90.32.30/gbox/gate?sid=8002",
            areaSelectRoadNameUrl:"http://192.168.1.210:8090/sorting_web/gate?sid=3001&encode=utf-8",
            getDistrictBoundsUrl: "http://192.168.1.210:8090/sorting_web/gate?sid=2012",
            getCityRingUrl:"http://192.168.1.210:8090/sorting_web/gate?sid=2010",
            loadParas : {
                sid : '2006',
                encode : 'utf-8',
                key : 'b0a7db0b3a30f944a21c3682064dc70ef5b738b062f6479a5eca39725798b1ee300bd8d5de3a4ae3',
                gbox_validate : "{eid:'134',uid:'1080',userid:'1080',uidString:'fa2985264a1645bdb7f3693e25df1e67'," +
                    "eidString:'b9ead9582b764605a3f30c1cea072133',userType:'1',userName:'ali'," +
                    "password:'KFQFDFACABKHAHDHHH',endTag: 'endTag'}",
                resType : 'json',
                uid : '1080',
                eid : '134'
            },
            saveParas : {
                sid : '8001',
                uid : '1080',
                eid : '134',
                gbox_validate :"{eid:'134',uid:'1080',userid:'1080',uidString:'fa2985264a1645bdb7f3693e25df1e67',eidString:'b9ead9582b764605a3f30c1cea072133',userType:'1',userName:'ali',password:'KFQFDFACABKHAHDHHH',endTag:'endTag'}",
                encode : 'utf-8'
            }
        },
        options : {
            draw : {
                position: 'topright',
                draw: {
                    polyline: {
                        metric: true
                    },
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    },
                    marker: true
                }
            }
        }
    }
})(MapEditor);
