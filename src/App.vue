<template>

  <div id="app" class="columns">
    <editor></editor>

    <library></library>
    <project></project>
    <css></css>

  </div>
</template>

<script>
import library from './components/library.vue'
import project from './components/project.vue'
import css from './components/css.vue'
import editor from './components/editor.vue'
export default {
  name: 'app',
  components: {
   library,
   project,
   css,
   editor
  },
  computed:{
    content(){
      return this.$store.state.templatesData;
    }
  },
  created(){
      this.$store.dispatch('loadTemplates');

  }
}
</script>

<style>

</style>
