import * as PIXI from 'pixi.js';
const PixiInstance = function (canvas, width, height, transparent) {
    const app = new PIXI.Application({
        view: canvas,
        width: width,
        height: height,
        transparent: transparent,
    });
    this.getApp = function () {
        return app;
    }
}
function PixiDraw () {

    const defaultProperties = {
        fill: 0x000000,
        stroke: 0x000000,
        fillOpacity: 1,
        strokeOpacity: 0,
        strokeWidth: 0,
        radius: 12,
        x: 0,
        y: 0
    };

    function mapProperites(properties){
        let props = {};
        for(let p in defaultProperties){
            props[p] = properties[p] != undefined && properties[p] != null ? properties[p] : defaultProperties[p];
        }
        return props;
    }

    this.bezierShape = function (path, properties, graphic) {
        let props = mapProperites(properties);
        let g = graphic ? graphic : new PIXI.Graphics();
        g.clear();
        g.beginFill(props.fill,props.fillOpacity);
        g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
        g.moveTo(path[0][2].x, path[0][2].y);
        for(let i = 0; i < path.length; i++){
            const nextIndex = i == path.length - 1 ? 0 : i + 1;
            g.bezierCurveTo(path[i][0].x, path[i][0].y, path[nextIndex][1].x, path[nextIndex][1].y, path[nextIndex][2].x, path[nextIndex][2].y);
        }
        g.endFill();
        return g;
    }

    this.circle = function (properties, graphic) {
        let props = mapProperites(properties);
        console.log(props);
        let g = graphic ? graphic : new PIXI.Graphics();
        g.clear();
        g.beginFill(props.fill,props.fillOpacity);
        g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
        g.drawCircle(props.x, props.y, props.radius);
        g.endFill();
        return g;
    }
    
}
function PixiImage(){
    this.image = function(src){
        return new PIXI.Sprite(PIXI.Texture.from(src));
    }
}
export {PixiInstance, PixiDraw, PixiImage};