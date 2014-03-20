ME.Map.include({
	fitDistrict: function(p, c, d){
		var url = ME.Config.data.getDistrictBoundsUrl;
		var xhr = new XHR({
	        cross : true,
	        fla : true
	    });
	    var _this = this;
	    xhr.getJSON(url,{
	        paras:{
	            province: encodeURI(p),
	            city: encodeURI(c),
	            county: encodeURI(d)
	        }
	    },function(data){
	    	var box, latlngs = data.data.data;
	    	if(!latlngs || !latlngs.length) return;
	    	latlngs = latlngs[0].bbox.split(";");
	    	var box = L.latLngBounds([latlngs[1],latlngs[0]], [latlngs[3],latlngs[2]]);
	    	_this.fitBounds(box);
	    	_this.fire("fitDistrictEnd", box);
	    });
		}
});