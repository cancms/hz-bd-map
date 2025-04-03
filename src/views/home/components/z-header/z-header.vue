<template>
    <div class="z-header relative">
        <div class=" text-primary 
         absolute left-1/2 top-1/2 -translate-x-1/2
         -translate-y-1/2 text-2xl">市中区共享单车监管数据大屏</div>
        <div class="text-primary absolute top-8 right-4  text-xs">
            <span>数据统计于</span>
            <span class="ml-2">{{ lastUpdateTime }}</span>
        </div>
    </div>
</template>
<script setup name='z-header' lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/store/index'
const store = useGlobalStore()
const { lastUpdateTime } = storeToRefs(store)
</script>
<style scoped lang='scss'>
.z-header {
    width: 100%;
    height: 60px;
    background-image: url("@/assets/images/home/title.png");
    background-size: 100% 100%;
}
</style>