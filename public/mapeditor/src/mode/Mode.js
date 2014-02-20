
/**
 * 
 * @memberOf  ME
 * @constructor
 * @namespace Mode
 */
ME.Mode = L.Class.extend(
/**
 * @lends ME.Mode.prototype
 */
{
    includes: L.Mixin.Events,

    initialize: function(map,handler){
        this._map = map;
        this._handler = handler;
        this._enabled = false;
        this.group = new L.LayerGroup();
        this.group.addTo(map);

        if(this._handler.on)
            this._handler.on("disabled",this._disable,this);
    },

    /**
     * enable Mode, will disable other modes
     */
    enable: function(){
        if(this._enabled) {
            return;
        }else if(ME.Mode._activeMode){
            ME.Mode._activeMode.disable();
        }

        ME.Mode._activeMode = this;

        this._handler.enable();
        this._enabled = true;

        this._map.on('draw:created',this._finish,this);
    },

    /**
     * disable mode
     */
    disable: function(){
        if(!this._enabled) return;

        this._handler.disable();
        this._enabled = false;

        this._map.off('draw:created',this._finish,this);
    },


    _disable: function(){
        if(!this._enabled) return;

        this._enabled = false;
        this._map.off('draw:created',this._finish,this);
    },

    /**
     * is mode enabled or disabled
     * @return {Boolen}
     */
    enabled: function(){
        return this._enabled;
    }
});