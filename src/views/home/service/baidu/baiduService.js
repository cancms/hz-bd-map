import _ from 'lodash'
import midnightStyle from '@/views/home/components/map/baidu_map_midnight.json'
// import mapv from "mapv";

// mapv.js在index.html中引用，mapv报错this.show is not a function
// 原因： mapv.js加载先于地图，导致BMap$1为undefined，如下：
// https://blog.csdn.net/Liyan_Yanna/article/details/114640595
// import * as mapv from 'mapv'
// import * as mapvgl from 'mapvgl'
// import { initMap, purpleStyle } from '@/utils/mapvCommon'
/***
 *
 *    function CanvasLayer(options) {
 *         ... ...
 *         this.show();
 *     }
 *    var global$3 = typeof window === 'undefined' ? {} : window;
 *     var BMap$1 = global$3.BMap || global$3.BMapGL || global$3.BaiduMap;**
 *     if (BMap$1) {
 * 		CanvasLayer.prototype = new BMap$1.Overlay();
 * 		... ...
 * 		CanvasLayer.prototype.show = function () {
 *             if (!this.canvas) {
 *                 this._map.addOverlay(this);
 *             }
 *             this.canvas.style.display = "block";
 *         };
 *     }
 *
 */



// https://gitee.com/baidu/mapv
// https://gitee.com/heifahaizei/vue-baidu-map-3x
// https://mapv.baidu.com/
// https://mapv.baidu.com/examples/#baidu-map-point-cluster.html
function createMapVService() {
  const service = {
    displayBikes,
  }

  const localData = {
    // 支持同一坐标有多个点
    pointsMap: {}, // lngLat => [item1, item2, ...]
  };


  function lngLatKey(jsonPointItem) {
    // const lngLat = `${jsonPointItem.location.longitude}_${jsonPointItem.location.latitude}`;
    const lngLat = `${jsonPointItem.lng}_${jsonPointItem.lat}`;
    return lngLat
  }

  // mapv 支持同一坐标有多个点， 当有2个点在同一坐标上面事，展示聚合数字
  // minPoints: 2, // 最少聚合点数，点数多于此值才会被聚合
  // mapv 支持同一坐标有多个点， 怎样解决弹窗问题？
  //   方案一：聚合弹窗（推荐）
  // 适用场景：同一坐标有大量重复点，需汇总展示所有信息。
  // 实现步骤：
  // 预处理数据：将相同坐标的点合并为一条聚合数据，记录点数及子点信息。
  // 点击聚合点：弹窗显示该位置的所有点列表（可滚动或分页）。
  function groupByLngLat(samplePoints) {
    localData.pointsMap = {}
    const data = [];
    const bikePointsData = samplePoints.bikes || []
    bikePointsData.map(item => {
      const lngLat = lngLatKey(item);
      if (localData.pointsMap[lngLat]) {
        localData.pointsMap[lngLat].push(item);
      } else {
        localData.pointsMap[lngLat] = [item];
      }
    })
  }



  function markerClickFn(point) {

    if (!point) {
      return false;
    }
      if (point.itemData) {
        const lngLat = lngLatKey(point.itemData);
        console.log(localData.pointsMap[lngLat]);
      }
      // 通过children可以拿到被聚合的所有点
      // console.log(point.children);

  }


  /***
   *
   * samplePoints: 结构
   * {
   *   "bikes": [
   *     {
   *       "id": 1,
   *       "location": {
   *         "latitude": 30.30263,
   *         "longitude": 120.33761
   *       },
   *       "status": "maintenance",
   *       "bike_type": "normal_bike",
   *       "company": "company_A"
   *     },
   *     ...
   *    ]
   *  }
   *
   *
   *  新结构
   *
   *  {
   *   "count": 5623,
   *   "data": [
   *     {
   *       "bikeid": 221325,
   *       "company": "mobike",
   *       "lat": 39.9049,
   *       "lng": 117.0659,
   *       "state": "in use"
   *     },
   *     ...
   *   ]
   *  }
   *
   *
   *   mapv.js在index.html中引用，mapv报错this.show is not a function
   *   原因： mapv.js加载先于地图，导致BMap$1为undefined，如下：
   *   https://blog.csdn.net/Liyan_Yanna/article/details/114640595
   *
   *
   * @param BMap
   * @param map
   * @param samplePoints
   * @return {boolean}
   */

  function displayMarkers(BMap, map, samplePoints) {
    groupByLngLat(samplePoints);
    const data = [];
    const bikePointsData = samplePoints.bikes || []
    bikePointsData.map(item => {
      data.push({
        geometry: {
          type: 'Point',
          coordinates: [item.location.longitude, item.location.latitude]
        },
        itemData: item,
        count: 2
        // fillStyle: 'rgba(18, 166, 242, 0.5)',
        // size: 60
      })
    })



    const options = {
      // shadowColor: 'rgba(255, 250, 50, 1)',
      // shadowBlur: 10,
      // 非聚合点的颜色和大小，未设置icon或icon获取失败时使用
      fillStyle: 'rgba(18, 166, 242, 1)',
      size: 50 / 3 / 2, // 非聚合点的半径
      // 非聚合时点的icon设置，会被具体点的设置覆盖，可设置为空
      // iconOptions: {
      //     url: 'images/marker.png',
      //     width: 50 / 3,
      //     height: 77 / 3,
      //     offset: {
      //         x: 0,
      //         y: 0
      //     }
      // },
      minSize: 8, // 聚合点最小半径
      maxSize: 31, // 聚合点最大半径
      globalAlpha: 0.8, // 透明度
      clusterRadius: 150, // 聚合像素半径
      maxClusterZoom: 18, // 最大聚合的级别
      maxZoom: 19, // 最大显示级别
      minPoints: 2, // 最少聚合点数，点数多于此值才会被聚合
      extent: 400, // 聚合的细腻程度，越高聚合后点越密集
      label: { // 聚合文本样式
        show: true, // 是否显示
        fillStyle: 'white',
        // shadowColor: 'yellow',
        // font: '20px Arial',
        // shadowBlur: 10,
      },
      gradient: { 0: "blue", 0.5: 'yellow', 1.0: "rgb(120,32,198)"}, // 聚合图标渐变色
      draw: 'cluster',
      methods: {
        click: markerClickFn,
      }
    }



    // 动态导入组件, mapv.js加载先于地图，导致BMap$1为undefined,  ->  this.show is not a function
    import('mapv').then(mapv => {
      const dataSet = new mapv.DataSet(data);
      const mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
      // mapvLayer.show(); // 显示图层
    });

    return true;
  }



  function markerOptions() {

    const options = {
      // shadowColor: 'rgba(255, 250, 50, 1)',
      // shadowBlur: 10,
      // 非聚合点的颜色和大小，未设置icon或icon获取失败时使用
      fillStyle: 'rgba(18, 166, 242, 1)',
      size: 50 / 3 / 2, // 非聚合点的半径
      // 非聚合时点的icon设置，会被具体点的设置覆盖，可设置为空
      // iconOptions: {
      //     url: 'images/marker.png',
      //     width: 50 / 3,
      //     height: 77 / 3,
      //     offset: {
      //         x: 0,
      //         y: 0
      //     }
      // },
      minSize: 8, // 聚合点最小半径
      maxSize: 31, // 聚合点最大半径
      globalAlpha: 0.8, // 透明度
      clusterRadius: 150, // 聚合像素半径
      maxClusterZoom: 18, // 最大聚合的级别
      maxZoom: 19, // 最大显示级别
      minPoints: 2, // 最少聚合点数，点数多于此值才会被聚合
      extent: 400, // 聚合的细腻程度，越高聚合后点越密集
      label: { // 聚合文本样式
        show: true, // 是否显示
        fillStyle: 'white',
        // shadowColor: 'yellow',
        // font: '20px Arial',
        // shadowBlur: 10,
      },
      gradient: { 0: "blue", 0.5: 'yellow', 1.0: "rgb(120,32,198)"}, // 聚合图标渐变色
      draw: 'cluster',
      methods: {
        click: markerClickFn,
      }
    }

    return options;
  }

  function createMarkerDataset(bikePointsRs) {
    const data = [];
    const bikePointsData = bikePointsRs.data || []
    groupByLngLat({bikes: bikePointsData});
    bikePointsData.map(item => {
      data.push({
        geometry: {
          type: 'Point',
          coordinates: [item.lng, item.lat]
        },
        properties: { text: `${item.lng}, ${item.lat}`},
        itemData: item,
        count: localData.pointsMap[lngLatKey(item)].length || 1
        // fillStyle: 'rgba(18, 166, 242, 0.5)',
        // size: 60
      })
    })
    return data;
  }
  /***
   *
   * 后端返回数据：
   * {
   *   "count": 5623,
   *   "data": [
   *     {
   *       "bikeid": 221325,
   *       "company": "mobike",
   *       "lat": 39.9049,
   *       "lng": 117.0659,
   *       "state": "in use"
   *     },
   *     ...
   *   ]
   *  }
   *
   * @param bikePointsRs
   */
  function displayBikes(BMap, map, bikePointsRs) {

    const data = createMarkerDataset(bikePointsRs);
    const options = markerOptions()

    // 动态导入组件, mapv.js加载先于地图，导致BMap$1为undefined,  ->  this.show is not a function
    import('mapv').then(mapv => {
      const dataSet = new mapv.DataSet(data);
      const mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
      // mapvLayer.show(); // 显示图层
    });

    return true;
  }



  return service;
}

function createBaiduService() {
  const service = {
    initMap,
    mapVService: createMapVService(),
  }

  function initMap(BMap,map) {

    // 杭州市钱塘区的中心经纬度坐标为东经120°22′00″，北纬30°18′00″‌‌
    // map.centerAndZoom(new BMap.Point(120.498791,30.326176), 11);  // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件

    // map.addControl(new BMap.MapTypeControl({
    //   mapTypes:[
    //     BMAP_NORMAL_MAP,
    //     BMAP_HYBRID_MAP
    //   ]}))         // 设置地图显示的城市 此项是必须设置的

    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    // map.centerAndZoom(new BMap.Point(120.498791, 30.326176),12);  // 钱塘区的中心


    map.setMapStyleV2({styleJson: midnightStyle});

  }



  return service
}
export default createBaiduService()
