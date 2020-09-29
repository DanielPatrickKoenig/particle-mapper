<template>
  <div id="app">
    <ul>
        <li v-for="(position, i) in circlePositions" :key="'position-'+i.toString()">
            <div>
                <label>X <input type="number" v-model="circlePositions[i].values.x" /></label>
            </div>
            <div>
                <label>Y <input type="number" v-model="circlePositions[i].values.y" /></label>
            </div>
            <div>
                <label>Duration <input type="number" v-model="circlePositions[i].duration" /></label>
            </div>
        </li>
    </ul>
    <div class="views">
        <svg>
            <PathRenderer :sig="sig" :path="path" />
            <circle :cx="pos.x" :cy="pos.y" r="5" />
        </svg>
        <div id="pixi-container">
            <canvas />
        </div>
    </div>
  </div>
</template>

<script>
import PathRenderer from './PathRenderer.vue';
import {PixiInstance, PixiDraw} from '../utils/PixiManager.js';
import {tweenSteps, perpetuate} from '../utils/AnimationUtils.js';
import BezierPaths from '../utils/BezierPaths.js';
export default {
  components: {
    PathRenderer
  },
  data(){
    return {
      path: BezierPaths.candleFlame,
      originalPath: [],
      sig: 0,
      offsets: [],
      maxRange: 50,
      pos: {
        x: 0,
        y: 0
      },
      circlePositions: [
        {duration: .5, values: {x: 10, y: 30}},
        {duration: .5, values: {x: 120, y: 90}},
        {duration: .5, values: {x: 66, y: 200}},
        {duration: .5, values: {x: 41, y: 78}}
      ]

    }
  },
  methods: {
    updatePaths: function () {
      for(let i = 0; i < this.path.length; i++){
        this.path[i][0].x = this.path[i][2].x + this.offsets[i][0].x;
        this.path[i][0].y = this.path[i][2].y + this.offsets[i][0].y;
        this.path[i][1].x = this.path[i][2].x + this.offsets[i][1].x;
        this.path[i][1].y = this.path[i][2].y + this.offsets[i][1].y;
      }
    },
    movePoint: function (scope, i, update) {
      tweenSteps(scope.path[i][2],[
        {duration:.25+(Math.random()*2),values:{x: scope.originalPath[i][2].x + (Math.random() * scope.maxRange) - (scope.maxRange / 2), y: scope.originalPath[i][2].y + (Math.random() * scope.maxRange) - (scope.maxRange / 2)}},
        {duration:.25+(Math.random()*2),values:{x: scope.originalPath[i][2].x + (Math.random() * scope.maxRange) - (scope.maxRange / 2), y: scope.originalPath[i][2].y + (Math.random() * scope.maxRange) - (scope.maxRange / 2)}},
        {duration:.25+(Math.random()*2),values:{x: scope.originalPath[i][2].x + (Math.random() * scope.maxRange) - (scope.maxRange / 2), y: scope.originalPath[i][2].y + (Math.random() * scope.maxRange) - (scope.maxRange / 2)}},
        {duration:.25+(Math.random()*2),values:{x: scope.originalPath[i][2].x + (Math.random() * scope.maxRange) - (scope.maxRange / 2), y: scope.originalPath[i][2].y + (Math.random() * scope.maxRange) - (scope.maxRange / 2)}},
        {duration:.25+(Math.random()*2),values:{x: scope.originalPath[i][2].x + (Math.random() * scope.maxRange) - (scope.maxRange / 2), y: scope.originalPath[i][2].y + (Math.random() * scope.maxRange) - (scope.maxRange / 2)}},
        {duration:.25+(Math.random()*2),values:{x: scope.originalPath[i][2].x + (Math.random() * scope.maxRange) - (scope.maxRange / 2), y: scope.originalPath[i][2].y + (Math.random() * scope.maxRange) - (scope.maxRange / 2)}}
      ],update, () => {scope.movePoint(scope,i,update)});
    }
  },
  mounted: function(){
    this.originalPath = JSON.parse(JSON.stringify(this.path));
    for(let i = 0; i < this.path.length; i++){
      this.offsets.push([
          {
            x: this.path[i][0].x - this.path[i][2].x,
            y: this.path[i][0].y - this.path[i][2].y
          },
          {
            x: this.path[i][1].x - this.path[i][2].x,
            y: this.path[i][1].y - this.path[i][2].y
          }
        ]
      );
    }
    const pi = new PixiInstance(document.querySelector('#pixi-container > canvas'), 500, 800, false);
    const app = pi.getApp();
    const pd = new PixiDraw();
    let bez = pd.bezierShape(this.path, {fill:0xff0000});
    app.stage.addChild(bez);
    let circle = pd.circle({fill:0xff0000, radius:5});
    app.stage.addChild(circle);
    for(let i = 0; i < this.path.length; i++){
      let onUpdate = i == this.path.length - 1 ? () => {
        this.updatePaths();
        this.sig = Math.random();
        pd.bezierShape(this.path, {fill:0xff0000}, bez);
      } : () => {};
      this.movePoint(this,i,onUpdate);
    }

    perpetuate(this.pos, this.circlePositions,() => {
        // console.log(circle);
        circle.position.x = this.pos.x;
        circle.position.y = this.pos.y
    });
  }
}
</script>

<style>
.views{
  width:1000px;
  margin:0 auto;
  display:flex;
  flex-direction: row;
}
svg, .pixi-container{
  width:500px;
  height:800px;
}
ul{
    width:100%;
    display:flex;
    flex-direction: row;
    padding:0;
    margin:0;

}
ul > li{
    display:inline-flex;
    width:25%;
    padding:0;
    margin:0;
    flex-direction: column;
}
ul > li > div{
    padding:10px;
    height:20px;
    display:block;
}
ul > li > div input{
    width:50px;
}
</style>
