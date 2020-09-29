<template>
    <div>
        <svg style="margin:0 auto;display:flex;" v-on:mousemove="mouseMove">
            <PathRenderer :sig="sig" :path="path" :offsets="reactionOffset" />
        </svg>
    </div>
</template>

<script>
import BezierPaths from '../utils/BezierPaths.js';
import {tweenSteps} from '../utils/AnimationUtils.js';
import PathRenderer from './PathRenderer.vue';
export default {
    components:{
        PathRenderer
    },
    data(){
        return {
            path: JSON.parse(JSON.stringify(BezierPaths.candleFlame)),
            originalPath: [],
            sig: 0,
            offsets: [],
            maxRange: 50,
            reactionOffset: [],
            maxReaction: 500
        }
    },
    methods: {
        mouseMove: function (e) {
            this.reactionOffset = [];
            for(let i = 0; i < this.path.length; i++){
                let shiftValue = this.path[i][2].y > this.maxReaction ? 0 : (this.maxReaction-this.path[i][2].y) * -.001;
                this.reactionOffset.push({x:((window.innerWidth/2) - e.pageX) * shiftValue, y: 0});
            }
            console.log(this.reactionOffset);
            
        },
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
    mounted: function () {
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
        for(let i = 0; i < this.path.length; i++){
            let onUpdate = i == this.path.length - 1 ? () => {
                this.updatePaths();
                this.sig = Math.random();
            } : () => {};
            this.movePoint(this,i,onUpdate);
        }
    }
}
</script>

<style>
svg{
    
}
</style>