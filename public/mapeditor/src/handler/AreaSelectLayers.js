/**
 * 	
 * drag a rectangle to select all layers intersect with area
 * @memberOf  ME.Handler
 * @constructor
 * @name ME/Handler/AreaSelectLayers
 */
ME.Handler.AreaSelectLayers = L.Handler.extend(
/**
 * @lends ME.Handler.ME/Handler/AreaSelectLayers.prototype
 */
{
	includes: L.Mixin.Events,
	options: {
        className:"mapeditor-areaselectlayer-mask",
        repeatMode: false
	},

    addHooks : function(){
        var mask = this.mask =  L.DomUtil.create('div', this.options.className,this._map.getContainer());

        L.DomEvent
            .on(mask, 'click', L.DomEvent.stopPropagation)
            .on(mask, 'mousedown', L.DomEvent.stopPropagation)
            .on(mask, 'dblclick', L.DomEvent.stopPropagation)
            .on(mask, 'mousemove', L.DomEvent.stopPropagation)
            .on(mask, 'mouseup', L.DomEvent.stopPropagation)
            .on(mask, 'mousedown', this._mousedown, this)
            .on(mask, 'mousemove',  this._mousemove, this)
            .on(mask, 'mouseup',  this._mouseup, this);


        this.fire('enabled');
    },

    removeHooks :function(){
        var mask = this.mask;

        L.DomEvent
            .off(mask, 'click', L.DomEvent.stopPropagation)
            .off(mask, 'mousedown', L.DomEvent.stopPropagation)
            .off(mask, 'dblclick', L.DomEvent.stopPropagation)
            .off(mask, 'mousemove', L.DomEvent.stopPropagation)
            .off(mask, 'mouseup', L.DomEvent.stopPropagation)
            .off(mask, 'mousedown', this._mousedown, this)
            .off(mask, 'mousemove',  this._mousemove, this)
            .off(mask, 'mouseup',  this._mouseup, this);

        mask.parentNode.removeChild(this.mask);
        this._rectangle = null;
        this._startPoint = null;

        this.fire('disabled');
    },

    _mousedown: function(e){
        this._startPoint = L.DomEvent.getMousePosition(e, this._map.getContainer());
        if(!this._rectangle)
            this._rectangle = L.DomUtil.create('div', "",this.mask);
        this._rectangle.style.width = "0";
        this._rectangle.style.height = "0";
        this._rectangle.style.marginTop = this._startPoint.y + "px";
        this._rectangle.style.marginLeft = this._startPoint.x + "px";
        this._rectangle.style.border = "2px dashed #f00";
        this._rectangle.style.background = "#6cb6ff";
        this._rectangle.style.opacity = "0.5";

    },

    _mousemove: function(e){
        var width,height;
        var point = L.DomEvent.getMousePosition(e, this._map.getContainer());

        if(this._startPoint){
            width = Math.abs(e.pageX - this._startPoint.x);
            height = Math.abs(e.pageY - this._startPoint.y);
            this._rectangle.style.width = width + "px";
            this._rectangle.style.height = height + "px";
            if(this._startPoint.x > point.x)
                this._rectangle.style.marginLeft = point.x + "px";
            if(this._startPoint.y > point.y)
                this._rectangle.style.marginTop = point.y + "px";

            this.fire("selecting", {bounds:L.bounds(this._startPoint,point)});
        }
    },

    _mouseup: function(e){
        this.disable();
    }

});