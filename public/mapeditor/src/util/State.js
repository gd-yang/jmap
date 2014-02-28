ME.State = L.Class.extend({
      initialize : function(options){
          this.common = options && options.common || {color:'blue', weight:4}
          this.hover = options && options.hover || {color:'green', weight:6}
          this.select = options && options.selected || {color:'red', weight:4}
      },
      set : function(prop, val){
          this[prop] = val;
      }
});