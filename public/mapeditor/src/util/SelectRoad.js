ME.Util = ME.Util || {};
/**
 * select roads by point
 * @param  {Object}   config  [description]
 * @param  {Function} cb      [description]
 * @param  {Object}   context [description]
 */
ME.Util.pointSelectRoad = function(config, cb, context){
	var xhr = new XHR({
        cross : true,
        fla : true
    });
    xhr.getJSON(config.url,{
        paras:{
            xy: config.lng + ',' + config.lat
        }
    },function(data){
        console.log(data);
    	if(typeof cb == "function")
    		cb.apply(context,[data]);
    });
};

/**
 * select roads by area
 * @param  {Object}   config  [description]
 * @param  {Function} cb      [description]
 * @param  {Object}   context [description]
 */
ME.Util.areaSelectRoad = function(config,cb,context){
	var xhr = new XHR({
        cross : true,
        fla : true
    });
    xhr.get(config.url,{
        paras:{
            region: config.latlngs
        }
    }, function(data){
    	if(typeof cb == "function")
        	cb.apply(context,[data]);
    });
};

/**
 * generate area surrounded by roads
 * @param  {Object}   config  [description]
 * @param  {Function} cb      [description]
 * @param  {Object}   context [description]
 */
ME.Util.roadsToArea = function(config,cb,context){
	var xhr = new XHR({
        cross : true,
        fla : true
    });
    xhr.post(config.url,{
        paras:{
            line: config.line
        }
    }, function(data){
    	if(typeof cb == "function")
        	cb.apply(context,[data]);
    });
};

ME.Util.getCityRing = function(config,cb,context){
    var xhr = new XHR({
        cross : true,
        fla : true
    });
    xhr.getJSON(config.url,{
        paras:{
            city: encodeURI(config.city),
            name: encodeURI(config.name)
        }
    },function(data){
        if(typeof cb == "function")
            cb.apply(context,[data]);
    });
};