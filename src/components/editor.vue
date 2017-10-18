<template>
  <div class="column is-1">
    <button v-on:click="save">save</button>
    <button v-on:click="bold">B</button>
    <button v-on:click="italic">I</button>
    <button v-on:click="underline">U</button>
    <button v-on:click="strikeThrough">STR</button>
    <button v-on:click="subscript">SUB</button>
    <button v-on:click="superscript">SUPER</button>
    <button v-on:click="undo">UNDO</button>
    <button v-on:click="redo">REDO</button>
    <button v-on:click="removeFormat">CLEAR</button>
  </div>
</template>
<script>
  export default {
    methods:{
      bold(){
        document.execCommand('bold', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      italic(){
        document.execCommand('italic', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      underline(){
        document.execCommand('underline', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      strikeThrough(){
        document.execCommand('strikeThrough', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      subscript(){
        document.execCommand('subscript', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      superscript(){
        document.execCommand('superscript', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      undo(){
        document.execCommand('undo', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      redo(){
        document.execCommand('redo', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      removeFormat(){
        document.execCommand('removeFormat', false, null);
        this.$store.commit('addChangedElementId',this.$store.getters.getActiveElementId )
      },
      save(){
          this.$store.commit('updateHTML')
      }
    },
  }
</script>
