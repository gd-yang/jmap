(function () {
    function type(t) {
        return function (o) {
            return  Object.prototype.toString.call(o) == '[object ' + t + ']';
        }
    }
    var isStr = type('String'),
        isFn = type('Function'),
        isArr = type('Array'),
        isObj = type('Object'),
        supports = {
            xhr2 : 'withCredentials' in new XMLHttpRequest
        };

    function parseXML( data ) {
        if ( typeof data !== "string" || !data ) {
            return null;
        }
        var xml, tmp;
        try {
            if ( window.DOMParser ) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { // IE
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            throw new Error( "Invalid XML: " + data );
        }
        return xml;
    }

    function parseJSON(datas){
        return !!window.JSON ? JSON.parse(datas) : eval('(' + datas + ')');
    }

    function parseJS(datas){
        return eval('(' + datas + ')');
    }

    function ObjSerialize(obj){
        var parastr = [];
        for (var o in obj){
            if(obj.hasOwnProperty(o)){
                parastr.push(o + '=' + obj[o]);
            }
        }
        return parastr.join('&')||'';
    }

    function noop(){}

    function FlashAjax() {
        this.property = {
            headers : {
                'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        this.onload = noop;
    }

    var _flash=null,
        _fla_isready = false,
        _fla_lock = false,
        _fla_pg = 0,
        _fla_gui = 0,
        _fla_loadstacks = [];
    FlashAjax.callbacks = {};

    FlashAjax.prototype.open = function(type, url){
        type = type.toLowerCase();
        this.property.type = type;
        this.property.url = url;
    }

    FlashAjax.prototype.send = function(paras){
        this.property.paras = paras;
        var that = this,
            key = _fla_gui++,
            property = this.property,
            type = property.type,
            url = property.url,
            contentType = property.headers['contentType'],
            headers = property.headers,
            _callback ='FlashAjax.callbacks['+key+']';

        FlashAjax.callbacks[key] = function(data){
            that.responseXml = that.responseText = data;
            that.onload(that);
        }
        paras = isObj(property.paras) ? ObjSerialize(property.paras || {}):paras;

        if (!_fla_isready) {
            _fla_loadstacks.push(this.format(url, _callback, type, paras, headers,"utf-8"));
            return;
        }
        _flash.sendRequest(url, _callback, type, paras, headers,"utf-8");
    }

    FlashAjax.prototype.setRequestHeader =function(name,val){
        this.property.headers[name] = val;
    }

    FlashAjax.prototype.setRequestHeaders =function(options){
        options = options || {};
        for (var header in options) {
            if (options.hasOwnProperty(header)){
                this.property.headers[header] = options[header];
            }
        }
    }

    FlashAjax.prototype.format = function (url, callback, type, paras, headers, charset) {
        return function () {
            _flash.sendRequest(url, callback, type, paras, headers, charset);
        }
    }

    FlashAjax.install = function (swfpath) {
        if (!!_fla_lock) {
            return;
        }
        var id = "cross_domain_for_ie_fla";
        swfpath = swfpath || "/swf/request.swf";

        var o = '';
        o += '<object data="'+swfpath+'" type="application/x-shockwave-flash"';
        o += 'id="'+id+'" width="0" height="0">';
        o += '<param name="allowScriptAccess" value="always">';
        o += '<param name="swliveconnect" value="true">';
        o += '<param name="movie" value="'+swfpath+'">';
        o += '<param name="wmode" value="opaque">';
        o += '</object>';
        var div = document.createElement('DIV');
        div.id = 'cross_domain_for_ie_con';
        div.innerHTML = o;
        div.style.cssText = "height:0;width:0;line-height:0;font-size:0;";
        document.body.appendChild(div);
        _flash = document.getElementById('cross_domain_for_ie_fla');
        _fla_lock = true;
        FlashAjax.PercentCheck();
    };

    FlashAjax.PercentCheck = function () {
        try {
            _fla_pg = _flash.PercentLoaded();
        } catch (e) {

        }
        if (_fla_pg < 100) {
            setTimeout(FlashAjax.PercentCheck, 100);
        } else {
            FlashAjax.ready();
        }
    }

    FlashAjax.ready = function () {
        var i = 0, stacks = _fla_loadstacks, len = stacks.length;
        _fla_isready = true;
        for (; i < len; i++) {
            stacks[i]();
        }
        _fla_loadstacks = [];
    }

    window.FlashAjax = FlashAjax;

    function _XMLHttpRequest(){
        return  new XMLHttpRequest();
    }

    function _XDomainRequest(){
        return new XDomainRequest();
    }

    function _FlaCrossRequest(){
         return new FlashAjax();
    }

    var MSXML2 = function(){
        return new ActiveXObject('MSXML2.XMLHTTP');
    };

    var MSXML = function(){
        return new ActiveXObject('Microsoft.XMLHTTP');
    };
    var isXDomain = false;
    function createCrossXHR(){
//        if (typeof XMLHttpRequest !== "undefined" && supports.xhr2) {
//            createCrossXHR = _XMLHttpRequest;
//            return _XMLHttpRequest();
//        }
//        else if('XDomainRequest' in window){
//            isXDomain = true;
//            console.log('XDomainRequest');
//            createCrossXHR = _XDomainRequest;
//            return _XDomainRequest();
//        }
//        else {
            createCrossXHR = _FlaCrossRequest;
            FlashAjax.install('/swf/request.swf');
            return _FlaCrossRequest();
//        }
//        return null;
    }
    function createXHR() {
        var xhr = null;
        if (typeof XMLHttpRequest !== "undefined") {
            createXHR = _XMLHttpRequest;
            xhr = _XMLHttpRequest();
        } else if (typeof ActiveXObject != "undefined") {
            try{
                xhr = MSXML2();
                createXHR = MSXML2;
                return xhr;
            }catch(e){
                xhr = MSXML();
                createXHR = MSXML;
                return xhr;
            }
        }
        return xhr;
    }

    function XHR(cross) {
        this.cross = !!cross;
        this.xhr = this.cross === true
            ? createCrossXHR()
            : createXHR();
    }

    XHR.prototype = {
        constructor: XHR,
        DONE: 4,
        LOADING: 3,
        HEADERS_RECEIVED: 2,
        OPENED: 1,
        UNSENT: 0,
        ajax: function (method, url, config, cb) {
            if (typeof(config) === 'function') {
                cb = config;
                config = {};
            }

            config = config || {};
            method = method.toLowerCase();
            var async = config.async !== false,
                paras = config.paras || {},
                override = config.override || 'text/xml; charset=utf-8',
                withCredentials = config.withCredentials !== true,
                timeout = config.timeout || 300000,
                username = config.username,
                pwd = config.pwd,
                headers = config.headers || {},
                contentType = config.contentType || 'application/x-www-form-urlencoded; charset=utf-8';
            this.success = config.success||null;
            this.xhr.onerror = config.error||null;
            this.resDataType = config.resDataType || 'responseText';
            this.onLoad(cb);
            url = method == 'get' ? url + ( url.indexOf('?') === -1 ? '?' : '&' + ObjSerialize(paras))
                : url;
            this.open(method, url, async, username, pwd);

            if (isXDomain){
                //this.xhr['Content-Type'] = 'application/x-www-form-urlencoded';
            } else{
                this.setRequestHeader('Content-type', contentType);
            }

            if(!this.cross){
                this.setRequestHeaders(headers);
            }
            if (timeout&&'timeout' in this.xhr) {
                this.xhr.timeout = timeout;
            }

            if (supports.xhr2){
                this.xhr.withCredentials = withCredentials;
            }

            this.overrideMimeType(override);
            this.send(method == 'post' ? paras : null);
        },
        get: function (url, config, cb) {
            this.ajax('GET', url, config, cb);
        },
        getJSON : function(url, config, cb){
            if(isFn(config)){
               cb = config;
               config = {};
            }

            this.ajax('GET', url, config, function(data){
                cb(parseJSON(data));
            });
        },
        getXML : function (url, config, cb) {
            if(isFn(config)){
                cb = config;
                config = {};
            }
            if (!config.override||!(/^(text|application)\/xml$/.test(config.override))){
                config.override = 'text/xml';
            }
            this.ajax('GET', url, config, function(data){
                 data = isStr(data) ? parseXML(data) : data;
                 return cb(data);
            });
        },
        post: function (url, config, cb) {
            this.ajax('POST', url, config, cb);
        },
        open: function (method, url, async, un, pw) {
            if (isFn(this._onopen)) {
                this._onopen();
            }
            this.xhr.open(method, url, async, un, pw);
        },
        send: function (paras) {
            if (isFn(this._onsend)) {
                this._onsend();
            }
            paras = isObj(paras) ? ObjSerialize(paras) : paras;
            this.xhr.send(paras);
        },
        getAllResponseHeaders: function () {
            return this.xhr.getAllResponseHeaders();
        },
        getResponseHeader: function (name) {
            return this.xhr.getResponseHeader(name);
        },
        setRequestHeader: function (name, val) {
            this.xhr.setRequestHeader(name, val);
        },
        setRequestHeaders: function (headers) {
            for (var h in headers){
                if (headers.hasOwnProperty(h)){
                    this.xhr.setRequestHeader(h, headers[h]);
                }
            }
        },
        overrideMimeType: function (type) {
            if ('overrideMimeType' in this.xhr){
                this.xhr.overrideMimeType(type);
            }
        },
        abort: function () {
            this.xhr.abort();
            if (isFn(this._onabort)) {
                this._onabort();
            }
        },
        onOpen: function (fn) {
            if ("onopen" in this.xhr) {
                this.xhr.onopen = fn;
            } else {
                this._onopen = fn;
            }
        },
        onAbort: function (fn) {
            if ("onabort" in this.xhr) {
                this.xhr.onabort = fn;
            } else {
                this._onabort = fn;
            }
        },
        onProgress : function(fn){
            this.xhr.onprogress = fn;
        },
        onTimeout: function (fn) {
            var xhr = this.xhr;
            if ("ontimeout" in xhr) {
                this.xhr.ontimeout = fn;
            } else {
                setTimeout(function () {
                    if (xhr.readyState !== 4) {
                        fn();
                        xhr.abort();
                    }
                }, this.timeout);
            }
        },
        onLoad : function(cb){
            var that = this;
            if ('onload' in this.xhr){
                this.xhr.onload = function(){
                    cb(that.xhr[that.resDataType], status, that.xhr,that);
                    that.onSuccess(that.xhr[that.resDataType], status, that.xhr,that);
                }
            } else{
                this.xhr.onreadystatechange = function(){
                    switch (that.xhr.readyState){
                        case that.LOADING:
                            if (isFn(that._loading)){
                                that._loading();
                            }
                            break;
                        case that.DONE :
                            var status = that.xhr.status;
                            if (status >=200 && status < 300 || status == 304){
                                cb(that.xhr[that.resDataType], status, that.xhr,that);
                                that.onSuccess(that.xhr[that.resDataType], status, that.xhr,that);
                            }
                            break;
                    }

                }
            }
        },
        onError : function(fn){
            if ('onerror' in this.xhr){
                this.xhr.onerror = fn;
            }else{
                this._onerror = fn;
            }
        },
        onSuccess : function(){
            var args = Array.prototyep.slice.call(arguments);
            if (this.success && typeof this.success == 'function'){
                this.success.apply(this, args);
            }
        },
        toString : function(){
            return '[object XHR]';
        }
    }

    window.XHR = XHR;
})();