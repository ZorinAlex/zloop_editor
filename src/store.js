import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
let css = {
  getParentsUntil( elem, parent, selector ) {
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
  },
  cssToHEAD(id, cssArr){
    let head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    let cssText = this.arrToCss(cssArr);
    if(!document.getElementById(id+"_css")){
      style.id = id+"_css";
      style.type = 'text/css';
      style.innerHTML=cssText;
      head.appendChild(style);
    }
  },
  updateCssById(id, cssArr){
    let style = document.getElementById(id+"_css");
    let cssText = this.arrToCss(cssArr);
    style.innerHTML = cssText;
  },
  cssDelete(id){
    let style = document.getElementsById(id+"_css");
    style.parentNode.removeChild(style);
  },
  addIdToSelector(css, id){
    css.forEach((element, index)=> {
      for(let selector in element){
        element = {['#' + id + ' ' + selector]: element[selector]}
      }
      css[index] = element;
    });
    return css
  },
  cssTextToObjRule(cssText) {
    let openBrace = cssText.indexOf('{');
    let css = cssText.slice(openBrace).replace(/({|})/g, '');
    let selector = cssText.slice(0, openBrace).trim();
    let rules = css.split(';');
    if (css.substr(-1) === ';') {
      rules.pop()
    }
    let properties = [];
    let values = [];
    rules.forEach(function (element) {
      let rule = element.split(':');
      properties.push(rule[0].trim());
      values.push(rule[1].trim());
    });
    let objCss = {};
    let objRule = {};
    for (let i = 0; i < properties.length; i++) {
      objCss[properties[i]] = values[i]
    }
    objRule[selector] = objCss;
    return objRule
  },
  cssTextToObj(cssText) {
    let self = this;
    let styles = cssText.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '').split('}');
    styles.pop();
    let obj = {};
    styles.forEach(function (element) {
      if (element.length) {
        obj = Object.assign(obj, self.cssTextToObjRule(element.trim()))
      }
    });
    return obj
  },
  objRuleToCss(obj) {
    let selector = Object.keys(obj);
    let css = obj[selector];
    let string = "";

    Object.keys(css).forEach(function (key) {
      string += key + ": " + css[key] + ";";
    });

    string = selector + " {" + string + "}";
    return string;
  },
  arrToCss(arr) {
    let self = this;
    let str = "";

    arr.forEach(function(element) {
      str += self.objRuleToCss(element);
    });

    return str
  }
};
export const store = new Vuex.Store({
  state:{
    templates:[],
    templatesData:[],
    editorMode: 'htmlEditor',
    // editorMode: 'cssInspector',
    activeElement: '',
    activeElementId: '',
    activeCss:{},
    changedElemrntsIds:[],
    rootElementId:'root'
  },
  getters:{
    getTemplates(state){
      return state.templates;
    },
    getEditorMode(state){
      return state.editorMode;
    },
    getActiveElementId(state){
      return state.activeElementId;
    }
  },
  mutations:{
    loadTemplates(state, data){
      state.templates = data;
    },
    addTemplate(state, data){
      let id = data.name;

      if(state.templatesData.find((el)=> el.id === id)){
        let i = 1;
        let temp = `${id}_${i}`;
        while(state.templatesData.find((el)=> el.id === temp)){
          ++i;
          temp = `${id}_${i}`;
        }
        id = temp;
      }
      state.templatesData.push({
        'id':id,
        'html': data.html,
        'css': css.addIdToSelector(data.css, id),
        'js': data.js
      });
      css.cssToHEAD(id, data.css);
    },
    setActiveElement(state, data){
      state.activeElement = data.el;
      state.activeElementId = data.blockId;
      if(state.activeElement){
        let arrObj = state.templatesData.filter((el)=> el.id === state.activeElementId);
        return arrObj[0].css.filter((el)=>{
          if(state.activeElement.matches(Object.keys(el)[0])){
            state.activeCss = el;
          }
        })
      }
    },
    updateCss(state){
      let selector = Object.keys(state.activeElement)[0];
      css.updateCssById(state.activeElementId, state.templatesData.find((el)=> el.id===state.activeElementId).css)
    },
    addProperty(state, data){
      Vue.set(state.activeCss[Object.keys(state.activeCss)[0]],data.prop, data.val);
      let selector = Object.keys(state.activeElement)[0];
      css.updateCssById(state.activeElementId, state.templatesData.find((el)=> el.id===state.activeElementId).css)
    },
    deleteProperty(state, key){
      Vue.delete(state.activeCss[Object.keys(state.activeCss)[0]],key);
      let selector = Object.keys(state.activeElement)[0];
      css.updateCssById(state.activeElementId, state.templatesData.find((el)=> el.id===state.activeElementId).css)
    },
    updateHTML(state){
      if(state.changedElemrntsIds.length>0){
        state.changedElemrntsIds.forEach((id)=>{
          state.templatesData.find((el)=> el.id===id).html = document.getElementById(id).outerHTML;
        });
        state.changedElemrntsIds = [];
      }
    },
    addChangedElementId(state, id){
      if(state.changedElemrntsIds.indexOf(id)=== -1){
        state.changedElemrntsIds.push(id);
      }
    }
  },
  actions:{
    addTemplate({commit}, link){
      axios.get(link)
        .then(function (response) {
          commit('addTemplate', response.data)
        })
        .catch(function (error) {

        });
    },
    loadTemplates({commit}){
      axios.get('lib/templates.json')
        .then(function (response) {
          commit('loadTemplates', response.data)
        })
        .catch(function (error) {

        });
    }
  }
});
