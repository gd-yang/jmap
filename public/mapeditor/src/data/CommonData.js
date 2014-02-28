;(function(ME){
    ME.Data.CommonData = L.Class.extend({
       initialize : function(data){
          if (!data){
              return;
          }
          this.version = data.version||'1';
          this.changeset = data.changeset||'1';
          this.tags = data.tag || [];
          this.id = data.id||'';
       },
       setTag : function(k, v){
           var tags = this.tags, len = tags.length, tag;
           for (var i=0; i<len; i++){
               tag = tags[i];
               if (tag.k == k){
                   tag.v = v;
                   return;
               }
           }
           tags[k] = {k : k, v : v};
       },
       getTag : function(k){
           var tags = this.tags, len = tags.length, tag;
           for (var i=0; i<len; i++){
               tag = tags[i];
               if (tag.k == k){
                   return tag;
               }
           }
           return null;
       },
       setId : function(id){
           this.id = id;
       },
       getId : function(){
           return this.id
       },
       setVersion : function(newVersion){
           this.version = newVersion;
       },
       getVersion : function(){
           return this.version;
       },
       setChangeset : function(newChangeset){
           this.changeset = newChangeset;
       },
       getChangeset : function(){
           return this.changeset;
       }
   });
})(MapEditor);