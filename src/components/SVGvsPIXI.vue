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
export default {
  components: {
    PathRenderer
  },
  data(){
    return {
      path:[[{x:295.587678950811,y:629.069454390257},{x:327.870347361186,y:630.762433990105},{x:311.305797287048,y:629.893749747534}],[{x:232.871602528824,y:409.499654001423},{x:262.016460609567,y:574.527642712423},{x:247.444031569195,y:492.013648356926}],[{x:294.354647947861,y:283.065054247281},{x:264.405047377189,y:360.000221572368},{x:279.576444408201,y:321.027616031874}],[{x:304.377208619902,y:210.237566009896},{x:304.377208619902,y:210.237566009896},{x:304.377208619902,y:210.237566009896}],[{x:343.061019033863,y:367.972512635222},{x:311.816931752051,y:278.217098743652},{x:327.488390247589,y:323.236760571646}],[{x:349.319818937376,y:570.807922332206},{x:363.128397471177,y:432.722136994187},{x:356.596961833971,y:498.036493366246}]],
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
