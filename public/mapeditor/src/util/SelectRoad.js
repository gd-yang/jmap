/**
 * select roads by point
 * @param  {Object}   config  [description]
 * @param  {Function} cb      [description]
 * @param  {Object}   context [description]
 */
ME.pointSelectRoad = function(config,cb,context){
	var xhr = new XHR(true);
    xhr.getJSON(config.url,{
        paras:{
            xy: config.lng + ',' + config.lat
        }
    },function(data){
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
ME.areaSelectRoad = function(config,cb,context){
	var xhr = new XHR(true);
    xhr.post(config.url,{
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
ME.roadsToArea = function(config,cb,context){
	var xhr = new XHR(true);
    xhr.post(config.url,{
        paras:{
            line: config.line
        }
    }, function(data){
    	if(typeof cb == "function")
        	cb.apply(context,[data]);
    });
};