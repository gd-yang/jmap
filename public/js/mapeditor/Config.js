;(function(ME){
    var Config = {
        map : {
            tileUrlTemplate : 'http://emap{s}.mapabc.com/mapabc/maptile?x={x}&y={y}&z={z}'
        },
        data :  {
            loadDataUrl : 'http://119.90.32.30/gbox/gate',
            saveDataUrl : '',
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
            saveParas : {}
        }
    }

    ME.Config = Config;
})(MapEditor);
