<template>
  <div class="column is-3">
    <div>
        <div v-for="(val, key) in getCss">
          {{key}}
          <div v-for="(value, prop, index) in val">
          <span>{{prop}}</span>
          <input type="text" v-model="getCss[key][prop]" v-on:keyup="updateCss">
          <button v-on:click="deleteProperty(prop)">-</button>
          </div>
          <div>
            <input type="text" v-model="newProperty">
            <input type="text" v-model="newValue">
            <button v-on:click="addProperty">+</button>
          </div>
        </div>
      </div>

  </div>
</template>
<script>
  export default {
      data: function(){
          return {newProperty: '',newValue:''}
      },
      methods:{
        updateCss(){
          this.$store.commit('updateCss');
        },
        addProperty(){
          let data = {'prop' : this.newProperty , 'val': this.newValue};
          this.$store.commit('addProperty',data);
          this.newProperty = '';
          this.newValue = '';
        },
        deleteProperty(key){
          this.$store.commit('deleteProperty',key);
        }
      },
      computed:{
          getCss(){
              return this.$store.state.activeCss;
          }
      }
  }
</script>
