<template>
  <baidu-map class="map" :center="{lng: 120.33761, lat: 30.30263}" :zoom="12" @ready="ready" >
  </baidu-map>
</template>

<script setup>
import samplePoints from '@/views/home/components/map/sample_points.json'
import baiduService from '@/views/home/service/baidu/baiduService.js' // 加上.js


// 地图加载完后请求远程数据
function afterMapLoaded(BMap, map) {
  baiduService.mapVService.displayMarkers(BMap, map, samplePoints)
}


const ready = ({BMap,map})=>{
  //  对地图进行自定义操作
  baiduService.initMap(BMap, map);
  afterMapLoaded(BMap, map);
};
</script>

<style>
/* 地图容器必须设置宽和高属性 */
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>