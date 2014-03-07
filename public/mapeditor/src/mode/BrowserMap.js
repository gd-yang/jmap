/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/BrowserMap
 * @alias ME/Mode/BrowserMap
 */
ME.Mode.BrowserMap = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/BrowserMap.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        this._map = map;
        this._enabled = false;
    },

    enable: function(){
        if(this._enabled) {
            return;
        }
        this._enabled = true;
        if(ME.Mode._activeMode){
            ME.Mode._activeMode.disable();
        }
        ME.Mode._activeMode = this;
        this.fire("enabled");
    },

    disable: function(){
        if(!this._enabled) {
            return;
        }
        this._enabled = false;
        this.fire("disabled");
    }
});