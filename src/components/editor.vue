<template>
  <div class="column is-1">
    <button v-on:click="save">save</button>
    <button v-on:click="bold">B</button>
    <button>I</button>
  </div>
</template>
<script>
  export default {
    methods:{
      bold(){
        document.execCommand('bold', false, null);
        //this.$store.commit('updateHTML', document.getElementById(this.$store.getters.getActiveElementId).outerHTML );
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      save(){
          this.$store.commit('updateHTML');
      }
    },
  }
</script>
