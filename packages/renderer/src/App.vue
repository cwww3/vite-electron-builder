<script lang="ts" setup>
import ReactiveCounter from '/@/components/ReactiveCounter.vue';
import ReactiveHash from '/@/components/ReactiveHash.vue';
import ElectronVersions from '/@/components/ElectronVersions.vue';
// import {test} from '#preload';
import {reactive, ref, toRefs} from 'vue';
import {ipcRenderer} from 'electron';

// test()
const vueFiles = ref([]);
window.api.getFiles((e: any, files: never[]) => {
  console.log(e);
  console.log(files);
  vueFiles.value = files;
});
window.api.openFiles();
const files = ref([]);
</script>

<template>
  <el-row class="mb-4">
    <el-button plain>Plain</el-button>
    <el-button
      type="primary"
      plain
      >Primary</el-button
    >
    <el-button
      type="success"
      plain
      >Success</el-button
    >
    <el-button
      type="info"
      plain
      >Info</el-button
    >
    <el-button
      type="warning"
      plain
      >Warning</el-button
    >
    <el-button
      type="danger"
      plain
      >Danger</el-button
    >
  </el-row>
  <img
    alt="Vue logo"
    src="../assets/logo.svg"
    width="150"
  />

  <p>
    For a guide and recipes on how to configure / customize this project,<br />
    check out the
    <a
      href="https://github.com/cawa-93/vite-electron-builder"
      target="_blank"
    >
      vite-electron-builder documentation
    </a>
    .
  </p>
  <p v-for="item in vueFiles">{{ item }}</p>

  <fieldset>
    <legend>Test Vue Reactivity</legend>
    <reactive-counter />
  </fieldset>

  <fieldset>
    <legend>Test Node.js API</legend>
    <reactive-hash />
  </fieldset>

  <fieldset>
    <legend>Environment</legend>
    <electron-versions />
  </fieldset>

  <p>
    Edit
    <code>packages/renderer/src/App.vue</code> to test hot module replacement.
  </p>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
