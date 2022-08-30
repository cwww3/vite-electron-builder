<template>
  <el-container>
    <el-aside width="200px">
      <router-link to="/">Home</router-link>
      <mTree :root="rootState"></mTree>
    </el-aside>
    <el-main>
      <router-view :key="router.currentRoute.value.fullPath" />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue';
import {Tree} from '/@/t';
import {useRouter, useRoute, RouteRecordName} from 'vue-router';
import {getRouterTree, getTree} from '/@/utils/index';
import bus from 'vue3-eventbus';
import {it} from 'node:test';
const router = useRouter();

let rootState = ref({} as Tree);
window.api.getTreeFiles((e: any, root: Tree) => {
  router.getRoutes().forEach(route => {
    if (route.name !== 'Home') {
      router.removeRoute(route.name as RouteRecordName);
    }
  });
  let rs = getRouterTree(root, true);
  rs.forEach(r => {
    router.addRoute(r);
  });
  router.push(router.getRoutes()[0]);
  getTree(root, false);
  rootState.value = root;
  // await router.replace(router.currentRoute.value.fullPath);
  console.log(rootState.value);
});

// listen to an event
bus.on('changeShow', (name: string) => {
  console.log('changeShow', name);
  changeShow(rootState.value, name);
});
const changeShow = function (root: Tree, name: string) {
  if (root.name && root.name === name) {
    root.isShow = !root.isShow;
    return;
  }
  root.children.forEach(item => {
    changeShow(item, name);
  });
};
</script>

<style>
.router-link-active {
  text-decoration: none;
}
</style>
