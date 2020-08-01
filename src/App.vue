<template>
  <div class="oarword" @keydown.ctrl.83="handleSave">
    <Editor :doc="doc" />
  </div>
</template>

<script>
import Editor from "./Editor";

import state from './state'
import { defaultTextStyle, defaultParaStyle } from "./convert";
import api from './api'

export default {
  components: {
    Editor,
  },
  data() {
    return {
      name: 'doc2',
      doc: undefined,
    };
  },
  created(){
    this.loadDoc()
  },
  methods: {
    loadDoc(){
      api.loadDoc(this.name, (resp)=>{
        this.doc = JSON.parse(resp.data)
      }, (resp)=>{

      }, (err)=>{

      })
    },
    saveDoc(){
      api.saveDoc(this.name, JSON.stringify(state.document.body.doc), (resp)=>{
        
      }, (resp)=>{

      }, (err)=>{

      })
    },
    handleSave(e){
      this.saveDoc()
    },
  },
};
</script>

<style>
.oarword {
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-top: 0;
}
</style>