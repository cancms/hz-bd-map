<template>
    <div class="z-center">
        <z-center-top></z-center-top>
<!--        <z-center-bottom></z-center-bottom>-->

    </div>
</template>
<script setup name='z-center' lang="ts">
import zCenterTop from './z-center-top.vue'
import zCenterBottom from './z-center-bottom.vue'

import { ref } from 'vue'
</script>
<style scoped lang='scss'>
.z-center {
    color: #fff;
 
    .z-center-top {
        height: 100%;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .z-center-bottom {
        height: calc(45% - 30px);
    }

    .z-center-bottom {
        margin-bottom: 10px;
    }
}
</style>