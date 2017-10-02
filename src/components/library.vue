<template>
  <div class="column is-3">
    <nav class="panel">
      <p class="panel-heading">
        Library
      </p>
      <span class="panel-block" v-for="template in templates">
                <button class="button" v-on:click="addTemplate(template.link)">
                   {{template.name}}
                </button>
              </span>
    </nav>
  </div>
</template>

<script>
  export default {
   computed:{
       templates(){
           return this.$store.getters.getTemplates;
       }
   },
   methods:{
     addTemplate(link){
       this.$store.dispatch('addTemplate',link)
     }
   }
  }

</script>
<style>
  .panel-block{
    background: #2c2c2c;
  }
</style>
