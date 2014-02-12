define(function (require, exports, module) {
    var jtmpl = {};
    jtmpl.cache = {};
    jtmpl.LEFT_LIMITER = jtmpl.LEFT_LIMITER || "{%";
    jtmpl.RIGHT_LIMITER = jtmpl.RIGHT_LIMITER || "%}";
    var Ler = jtmpl.LEFT_LIMITER, Rer = jtmpl.RIGHT_LIMITER;
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        }
    }
    var _type = function (obj) {
        return /\[object\s+(\w+)/.exec(Object.prototype.toString.call(obj).toLowerCase())[1];
    }
    var isObject = function (o) {
        var rst = Object.prototype.toString.call(o);
        return rst == '[object Function]' || rst == '[object Object]';
    }
    // 编译模板并传递数据
    jtmpl.template = function (tmpl, data) {
        if (!tmpl) {
            return;
        }
        var str = jtmpl._load(tmpl), rst = jtmpl.compile((str || '').trim(), data);
        return rst;
    }
    var htmlCode = {
        "'": "&apos;",
        "\"": "&quot;",
        "&": "&amp;",
        ">": "&gt;",
        "<": "&lt;",
        "\\": "&#92;",
        "/": "&#47;"
    }
    // html过滤
    jtmpl.encodeHTML = function (str) {
        return String(str == null ? "" : str).replace(/['"<>&\/\\]/g, function ($0) {
            return    htmlCode[$0] || "";
        });
    }
    // 正则编码
    jtmpl.encodeRegExp = function (str) {
        return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    }
    // 清除换行
    jtmpl.encodeBr = function (str) {
        return    String(str == null ? "" : str).replace(/[\t\n\r\v]/g, "");
    }
    // 清除注释
    jtmpl.clearAnnotation = function (str) {
        return String(str)
            .replace(new RegExp(Ler + "??\\s*?//.*?\\s*?" + Rer, "g"), "")
            .replace(new RegExp("<!--.*?-->", "g"), "")
            .replace(new RegExp(Ler + "\\*.*?\\*" + Rer, "g"), "");
    }
    // 模板编译
    jtmpl.compile = function (str, data) {
        var _rst_fn;
        // 缓存掉编译结果，省略掉了模板再次加载编译过程
        if (jtmpl.cache[str]) {
            _rst_fn = jtmpl.cache[str];
        } else {
            var fbody = "var _fbody_arr = [];"
                + "\nvar _fn = (function(_data_obj){"
                + "\nwith(_data_obj){\n_fbody_arr.push('"
                + _javascript(str)
                + "');\n}\n}(data));"
                + "\nfn=null;\nreturn _fbody_arr.join('');";
            _rst_fn = new Function('data', fbody);
            jtmpl.cache[str] = _rst_fn;
        }
        // 如果传入数据，返回编辑完的html,否则返回模板编译函数
        return /\[object\s+(?:Function|Object)\]/g.test(Object.prototype.toString.call(data))
            ? _rst_fn(data) : _rst_fn;
    }
    // 处理子模板
    jtmpl.include = function (str) {
        return String(str == null ? "" : str)
            .replace(new RegExp(Ler + '\\s*?p(?:art)?\\s*?\\:\\s*?([\\w-]+)\\s*?' + Rer, 'g'), function (str, id) {
                return    jtmpl._load('#' + id);
            });
    }
    // 组装
    jtmpl.group = function (str) {
        return String(str == null ? "" : str)
            .replace(new RegExp(Ler + '\\s*?g(?:roup)?\\s*?\\:\\s*?([\\w-,\\s]+)\\s*?' + Rer, 'g'), function (str, groups) {
                var groups = groups.split(','), shtml = '';
                for (var i = 0, len = groups.length; i < len; i++) {
                    shtml += jtmpl._load('#' + groups[i].trim())
                }
                return    shtml;
            });
    }
    // 加载模板格式
    jtmpl._load = function (str, callback) {
        var refer, elem, html, cache = jtmpl.cache;
        if (refer = (/f(?:ile)?\:([A-Za-z0-9\u4E00-\u9FA5/?&.:=""]+)/.exec(str) || [])[1]) {
            // 外部模板需要加载，异步执行回调
            callback(refer);
        } else if (refer = (/#([-$\w]+)/.exec(str) || [])[1]) {
            elem = document.getElementById(refer);
            html = jtmpl.include(elem && elem.tagName && /input|textarea/ig.test(elem.tagName)
                ? elem.value : elem.innerHTML);
            return html;
        } else {
            return jtmpl.group(str);
        }
    }
    /**
     * 直接渲染到容器
     * @ str 模板id
     * @ el目标容器
     * @ data数据
     * @ 其实处理方式，例如jq可以用回调处理
     **/
    jtmpl.render = function (tmpl, el, data, callback) {
        if (!tmpl || typeof(tmpl) != 'string' || !el || !data || !isObject(data)) {
            return;
        }
        var elem = typeof(el) == 'string' ? document.getElementById(el) : el;
        // 如果是dom元素直接innerHTML,否则交给回调适情况处理
        if (elem && elem.nodeName) {
            elem.innerHTML = jtmpl.compile(tmpl, data);
        } else if (!!callback) {
            callback(elem, jtmpl.compile(tmpl, data));
        }
    }
    var _javascript = function (str) {
        // 清除注释和换行
        str = jtmpl.encodeBr(jtmpl.clearAnnotation(str));
        str = str.replace(new RegExp("(" + Ler + "\\s*?[html]*?\:??\\s*?\=\\s*?[^;|" + Rer + "]+?\\s*?)" + Rer, 'g'), "$1\;" + Rer)
            .replace(new RegExp(Ler + '\\s*?h(?:tml)??\:\\s*?\=\\s*?([^;|' + Rer + ']+?);?\\s*?' + Rer, 'g'), "',typeof($1) === 'undefined' ? '' : jtmpl.encodeHTML($1),'")
            .replace(new RegExp(Ler + '\\s*?\=\\s*?([^;|' + Rer + ']+?);\\s*?' + Rer, 'g'), "',typeof($1) === 'undefined' ? '' : $1,'");
        str = str.split(Ler).join("');");
        str = str.split(Rer).join("_fbody_arr.push('");
        return str;
    };
    jtmpl._javascript = _javascript;
    module.exports = jtmpl;
});