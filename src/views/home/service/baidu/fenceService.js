import _ from 'lodash'
import fencePoints from '@/views/home/components/map/fence.json'


function createFenceService() {
  const service = {
      drawFencePolygons,
  };

  function processFenceData() {

    const points = []
      fencePoints.data.map(item => {
      // fencePoints.data.slice(0, 1).map(item => {
          // points.push({
          //     p1: [item[3], item[1]], // [116.4408, 40.3509]
          //     p2: [item[3], item[2]],
          //     p3: [item[4], item[1]],
          //     p4: [item[4], item[2]],
          // })

          points.push({
              p1: [item[3], item[2]], // [116.4408, 40.3509]
              p2: [item[4], item[2]],
              p3: [item[4], item[1]],
              p4: [item[3], item[1]],
          })

      });

    return points;

  }


    // 添加地理围栏
  function drawFencePolygons(BMap, map) {

      function drawOnePolygon(sharpPolyPoints) {
          const polyPoints = [
              new BMap.Point(sharpPolyPoints.p1[0], sharpPolyPoints.p1[1]),
              new BMap.Point(sharpPolyPoints.p2[0], sharpPolyPoints.p2[1]),
              new BMap.Point(sharpPolyPoints.p3[0], sharpPolyPoints.p3[1]),
              new BMap.Point(sharpPolyPoints.p4[0], sharpPolyPoints.p4[1]),
          ];
          const polygon = new BMap.Polygon(polyPoints, {
              strokeColor: "blue",
              strokeWeight: 2,
              strokeOpacity: 0.5,
              fillColor: "red",
              fillOpacity: 0.2
          });
          map.addOverlay(polygon);
      }

      const points = processFenceData()
      points.map(item => {
          drawOnePolygon(item);
      })
  }


  return service;
}

export default createFenceService()