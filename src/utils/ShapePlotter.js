import jt from 'jstrig';
import nj from 'numjs';
function ShapePlotter(_points) {
    let points = _points;
    let ratio = 0;
    let paths = [];
    // let totalPathDistance = 0;
    let distances = [];
    let position = {x: 0, y: 0};
    processRatios();
    function processRatios() {
        let distList = [];
        for (let i = 0; i < points.length; i++) {
            paths.push(pointPath(points[i]));
            distList.push(paths[i][paths[i].length - 1].dist);
        }

        const total = nj.array(distList).sum();
        let cumulation = 0;
        for (let i = 0; i < distList.length; i++) {
            let value = distList[i];
            let distEntry = { lastSum: cumulation, value: value, ratioLastSum: cumulation / total, ratioValue: value / total };
            cumulation += value;
            distEntry.sum = cumulation;
            distEntry.ratioSum = cumulation / total;
            distances.push(distEntry);
        }
        // totalPathDistance = total;
        console.log(distances);
    }
    function pointPath(_points) {
        let breaks = [];
        let totalDistance = 0;
        breaks.push({ x: _points[0].x, y: _points[0].y, dist: totalDistance });
        for (let i = 1; i < _points.length; i++) {
            let dist = jt.distance(_points[i], _points[i - 1]);
            totalDistance += Number(dist);
            breaks.push({ x: _points[i].x, y: _points[i].y, dist: totalDistance });
        }
        return breaks;
    }
    function plotToPath(_ratio, _points) {
        const _path = pointPath(_points);
        const totalDistance = _path[_path.length - 1].dist;
        const _fullRat = totalDistance * _ratio;
        let _section = -1;
        for (let i = 1; i < _path.length; i++) {
            if (_fullRat <= _path[i].dist && _fullRat > _path[i - 1].dist) {
                _section = i - 1;
            }
        }
        const cData = _path[Number(_section)];
        const nData = _path[Number(_section + 1)];
        const base = nData.dist - cData.dist;
        const diff = _fullRat - cData.dist;
        const _newRat = diff / base;
        const newPoint = { x: cData.x + ((nData.x - cData.x) * _newRat), y: cData.y + ((nData.y - cData.y) * _newRat) };
        //trace(newPoint.x);
        return newPoint;
    }
    function plotToPathGroup(_ratio, _pathGroup) {
        let targetGroupIndex = 0;
        let groupRatio = 0;
        for (let i = 0; i < distances.length; i++) {
            if (_ratio < distances[i].ratioSum) {
                targetGroupIndex = i;

                i = distances.length;
            }
        }
        groupRatio = (_ratio - distances[targetGroupIndex].ratioLastSum) / distances[targetGroupIndex].ratioValue;
        console.log(targetGroupIndex);
        console.log(groupRatio);
        return plotToPath(groupRatio, _pathGroup[targetGroupIndex]);
    }
    this.plot = function (_ratio) {
        ratio = _ratio;
        position = plotToPathGroup(ratio, points);
        return position;
    }
    this.setPoints = function (_points) {
        points = _points;
        paths = [];
        // let totalPathDistance = 0;
        distances = [];
        processRatios();
    }
    this.getPosition = function () {
        return position;
    }
}
export default ShapePlotter;