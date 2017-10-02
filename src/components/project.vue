<template>
  <div class="column">
    <div id="root" class="proj">
      <div @keyup="updateHtml" v-for="item in content" v-html="item.html" :id="item.id"></div>
    </div>
  </div>
</template>
<script>
  function getParentsUntil( elem, parent, selector ) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }
    var parents = [];
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

      if ( parent ) {
        if ( elem.matches( parent ) ) break;
      }

      if ( selector ) {
        if ( elem.matches( selector ) ) {
          parents.push( elem );
        }
        break;
      }

      parents.push( elem );
    }
    return parents;
  }

  export default {
    computed:{
      content(){
          return this.$store.state.templatesData;
      }
    },
    methods:{
      updateHtml(){
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId)
      }
    },
    mounted(){
      document.getElementById(this.$store.state.rootElementId).onclick = (event)=>{
        let arr = getParentsUntil(event.target,"#"+this.$store.state.rootElementId);
        let last = arr[arr.length - 1];
        let data = {'el': event.target, "blockId": last.id };
        this.$store.commit('setActiveElement', data);

        if(this.$store.getters.getEditorMode === 'htmlEditor'){
          document.getElementById(data.blockId).contentEditable = 'true'
        }

      }
    }
  }
</script>
