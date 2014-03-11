(function (ST){
    function getURLParas(){
        var url = window.location.href, obj={};
        url = url.split('?');
        url = !!url && url.length > 0 ? url[1] : null;
        url = !!url ? url.split('&') : url;
        if (!!url){
            url.forEach(function(para){
                para = para.split('=');
                if (!!para){
                    obj[para[0]] = para[1];
                }
            });
        }
        url = obj;
        return url;
    }
    ST.paras = getURLParas;
})(Sorting || (Sorting={}));