(function (Win) {
    var Rquire = {};
    var head = document.getElementsByTagName('head')[0],
        path = window.location.pathname,
        directory = path.substr(0, path.lastIndexOf('/') + 1),
        Modules = {},
        rqsMatch = /\=\s*require\(['"][^'"]+['"]\)/g,
        port = window.location.port,
        loadStack = [],
        config = {
            alias : {},
            paths : {}
        },
        origin = window.location.origin || 'http://' + window.location.hostname + (port ? ':' + port : '');

    /**
     * 数组迭代
     */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, bind) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this) {
                    fn.call(bind, this[i], i, this);
                }
            }
        }
    }

    /**
     * 是否数中的每一项都符合条件
     */
    if (!Array.prototype.every) {
        Array.prototype.every = function (fn, bind) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (( i in this) && !fn.call(bind, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * 映射成目标格式
     */
    if (!Array.prototype.map) {
        Array.prototype.map = function (fn, bind) {
            var length = this.length >>> 0, results = Array(length);
            for (var i = 0; i < length; i++) {
                if (i in this) {
                    results[i] = fn.call(bind, this[i], i, this);
                }
            }
            return results;
        }
    }

    // 类型判断
    function type(t) {
        return function (o) {
            return  Object.prototype.toString.call(o) == '[object ' + t + ']';
        }
    }

    var isStr = type('String'), isFn = type('Function'), isArr = type('Array'), isObj = type('Object');

    // 文件加载
    function load(element, callback) {
        function fn() {
            if (typeof callback === 'function') {
                callback(element);
            }
            head.removeChild(element);
        }

        head.appendChild(element);

        // js的加载方式
        if (element.addEventListener) {
            element.addEventListener("load", function cb() {
                fn();
                element.removeEventListener("load", cb);
            }, false);
        } else if (element.attachEvent) {
            element.onreadystatechange = function () {
                if (/loaded|complete/.test(element.readyState)) {
                    fn();
                    element.onreadystatechange = null;
                }
            }
        }
    }

    // 加载文件的类型
    var types = {
        // 加载js
        script: function (url) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = url;
            return script;
        },
        // 加载css
        css: function (url) {
            // css的加载方式
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            return link;
        }
    };

    /**
     * 格式化模块路径
     * 相对路径：当前声明模块路径相对于根跟径，依赖模块是相对于当前模块
     * @param id
     * @param base
     * @returns ''
     */
    function formatId(id, base) {
        var topLevels,
            isFullPath = /^http:\/\//.test(id);
        base = base || '';

        if (isStr(id) && id !== '' && !((/\.js$/.test(id)))) {
            id += '.js';
        }

        // 修复相对路径,
        id = id.replace(/^\.\//, base);
        // 修复相对父级路径
        if (/^\.\.\//.test(id)) {
            topLevels = base.match(/\/[^/]*/g);
            id = id.replace(/\.\.\//g, function () {
                topLevels.pop();
                return '';
            });
            id = topLevels.join('') + '/' + id;
        }

        return id;
    }

    // 监听模块
    function Events() {
        this.stacks = {};
    }

    Events.prototype = {
        on: function (id, fn) {
            if (!this.stacks[id]) {
                this.stacks[id] = [];
            }
            this.stacks[id].push(fn);
        },
        fire: function (id, fn) {
            (this.stacks[id] || []).forEach(function (_fn) {
                if (!fn || fn == _fn) {
                    _fn();
                }
            });
            if (id == 'ready') {
                this.remove(id, fn);
            }
        },
        remove: function (id, fn) {
            var that = this;
            if (!fn) {
                this.stacks[id] = [];
                return;
            }
            this.stacks[id].forEach(function (_fn, k) {
                if (fn == _fn) {
                    that.stacks[id].splice(k, 1);
                }
            });
        }
    };

    // 检查依赖是否完成
    function check(deps) {
        return deps.every(function (dp) {
            return Modules[dp] && Modules[dp].get('state') == 'ready';
        });
    }

    function getCurScript() {
        var stack;
        if(document.currentScript) { //firefox 4+
            return document.currentScript.src;
        }
        try {
            a.b.c();
        } catch (e) {
            stack = e.stack;
            if (!stack && window.opera) {
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop();
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "");
            return stack.replace(/(:\d+)?:\d+$/i, "");
        }

        var nodes = head.getElementsByTagName("script"); //只在head标签中寻找
        for(i = 0; node = nodes[i++];) {
            if( node.readyState === "interactive") {
                return node.src;
            }
        }
        return '';
    }

    /**
     * 定义的模块
     * @param id
     * @param deps
     * @param factory
     * @constructor
     */
    function Module(id, deps, factory) {
        this.id = id;
        this.deps = deps;
        this.factory = factory;
        this.state = 'create';
        this.exports = {};
        this.events = new Events;
        Modules[id] = this;
    }

    Module.prototype = {
        constructor: Module,
        set: function (prop, val) {
            this[prop] = val;
            return this;
        },
        get: function (prop) {
            return this[prop];
        },
        check: function () {
            return check(this.deps);
        }
    };

    /**
     * 引用模块
     * @param mIds
     * @param callback
     */
    Rquire.use = function (mIds, callback) {
        var events = new Events;
        if (isStr(mIds)) {
            mIds = [formatId(mIds)];
        } else if (isArr(mIds)) {
            mIds = mIds.map(function (id) {
                return formatId(id);
            });
        }

        // 监听模块准备就绪
        events.on('notice', function () {
            var args = mIds.map(function (mid) {
                return Modules[mid].exports;
            });
            if (isFn(callback)) {
                callback.apply(null, args);
            }
        });

        loadDeps(mIds, events);
    };

    Rquire.config = function(config){

    };

    // ready监听and通知notice依赖它的模块
    function loadDeps(deps, events) {
        // 循环批量加载
        deps.forEach(function (dp) {
            var element = types['script'](dp),
                loadModule = Modules[dp] || new Module(dp);
            // 监听ready
            loadModule.events.on('ready', function () {
                if (check(deps)) {
                    events.fire('notice');
                }
            });
            // 准备就绪，不重复加载
            if (loadModule.get('state') == 'ready') {
                loadModule.events.fire('ready');
            } else if (loadModule.get('state') == 'create') {
                loadModule.set('state', 'loading');
                load(element, function (elem) {
                    var id = formatId(elem.src.replace(origin, ''), directory),
                        options = loadStack.shift();
                    if (!!options) {
                        options.id = id;
                        options.factory.moduleId = id;
                        // 逻辑延迟执行过程回调里，
                        delay(options);
                    }
                });
            }
        });
    }

    // 把模块定义及监听，延迟到回调里执行
    function delay() {
        var options = arguments[0], exports = {};

        var deps = options.deps,
            factory = options.factory,
            id = options.id,
            module = {},
            objModule = options.objModule,
            noDeps = options.noDeps;

        // 格式化依赖模块ID
        deps = deps.map(function (dp) {
            var rstid = dp.match(/\(['"]([^'"]+)['"]\)/);
            if (!!rstid) {
                dp = rstid[1] || '';
            }
            return formatId(dp, id.substr(0, id.lastIndexOf('/') + 1));
        });

        // 创建模块
        module = Modules[id] || new Module(id);
        module.set('deps', deps).set('factory', factory);
        // define({})
        if (objModule) {
            module.set('exports', exports).set('state', 'ready');
            module.events.fire('ready');
            return;
        }
        // 无依赖模块
        if (deps.length == 0) {
            module.set('state', 'ready');
            // 关键步骤，决定module内this指向
            exports = factory.apply(module.exports, [require, module.exports, module]);
            !!exports && module.set('exports', exports);
            module.events.fire('ready');
            return;
        }

        // 依赖准备就绪通知上一层
        module.events.on('notice', function () {
            var args = !noDeps ? deps.map(function (dp) {
                return  Modules[dp].exports;
            }) : [require, module.exports, module];
            module.set('state', 'ready');
            // 关键步骤，决定module内this指向
            exports = factory.apply(module.exports, args);
            !!exports && (module.exports = exports);
            module.events.fire('ready');
        });

        loadDeps(deps, module.events);
    }

    /**
     * 模块声明
     * @param id
     * @param deps
     * @param factory
     */
    function define(id, deps, factory) {
        var objModule = isObj(id), exports = objModule ? id : {},
            noDeps = !isArr(id) && !isArr(deps), fcStr = '', options;

        factory = isFn(id) ? id : isFn(deps) ? deps : factory;

        if (isArr(id)) {
            deps = id;
        }

        if (!isArr(deps)) {
            fcStr = factory.toString();
            deps = fcStr.replace(/\/\/\s*.+[\n\r]/g, '')
                .replace(/\/\*[\s\S]+\*\//g, '')
                .replace(/\n\r/g, '').match(rqsMatch) || [];
        }

        id = formatId(isStr(id) ? id : getCurScript().replace(origin, ''), directory);
        factory.moduleId = id;
        options = {
            id : id,
            deps : deps,
            factory : factory,
            noDeps: noDeps,
            objModule: objModule,
            exports: exports
        };

        if (id){
            delay(options);
            loadStack.push(null);
        } else{
            loadStack.push(options);
        }
    }

    function require(id) {
        var context = arguments.callee.caller,
            moduleId = context.moduleId,
            base = moduleId.substr(0, moduleId.lastIndexOf('/') + 1);

        id = formatId(id, base);
        if (isStr(id)) {
            return Modules[id].exports;
        }
        return '';
    }

    Win.define = define;
    Win.require = require;
    Win.Rquire = Rquire;
})(window);