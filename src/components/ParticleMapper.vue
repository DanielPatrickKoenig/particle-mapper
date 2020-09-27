<template>
    <div class="particle-mapper-container">
        <div>
            <button v-for="(s,i) in shapes" :key="'shape-button-'+i.toString()" v-on:click="mapToShape(i)">{{s.name}}</button>
        </div>
        <svg>
            <circle v-for="(p, i) in particles" :key="'particles-'+i.toString()" :cx="particles[i].x" :cy="particles[i].y" r="2" fill="rgba(255,255,255,.7)" />
        </svg>
    </div>
    
</template>

<script>
import Points from '../utils/Points.js';
import ShapePlotter from '../utils/ShapePlotter.js';
import {tweenSteps} from '../utils/AnimationUtils.js';
import {Sine} from 'gsap';
export default {
    data () {
        return {
            particleCount: 300,
            particles: [],
            shapes: Points,
            plotter: {}
        }
    },
    mounted: function () {
        for(let i = 0; i < this.particleCount; i++){
            this.particles.push(this.getRandomPointPosition());
        }
        console.log(this.shapes);
        this.plotter = new ShapePlotter(this.shapes[0].data);
        
        this.mapToShape(0);
        
    },
    methods: {
        mapToShape: function (index) {
            console.log(this.plotter);
            this.plotter.setPoints(this.shapes[index].data, .5);
            for(let i = 1; i < this.particles.length; i++){
                const targetPos = this.plotter.plot(i/this.particles.length);
                // let easeToggle = Math.random();
                const durationTotal = 2;
                let xInDuration = (durationTotal / 4) + (Math.random() * (durationTotal / 2));
                let xOutDuration = durationTotal - xInDuration;
                let yInDuration = (durationTotal / 4) + (Math.random() * (durationTotal / 2));
                let yOutDuration = durationTotal - yInDuration;
                tweenSteps(this.particles[i], [{duration: xInDuration, ease: Math.random() > .5 ? Sine.easeIn : Sine.easeOut, values: {x: this.getRandomPointPosition().x}}, {duration: xOutDuration, ease: Math.random() > .5 ? Sine.easeOut : Sine.easeIn, values: {x: targetPos.x}}], this.$forceUpdate);
                tweenSteps(this.particles[i], [{duration: yInDuration, ease: Math.random() > .5 ? Sine.easeOut : Sine.easeIn, values: {y: this.getRandomPointPosition().y}}, {duration: yOutDuration, ease: Math.random() > .5 ? Sine.easeIn : Sine.easeOut, values: {y: targetPos.y}}], this.$forceUpdate);
                // TweenLite.to(this.particles[i], .5, {x: targetPos.x, y: targetPos.y, onUpdate: this.$forceUpdate})
                // this.particles[i] = this.plotter.plot(i/this.particles.length);
            }
            // this.$forceUpdate();
        },
        getRandomPointPosition: function () {
            return {x: Math.random() * 1000, y: Math.random() * 800};
        }
    }
}
</script>

<style>
.particle-mapper-container{
    width:100vw;
    height:100vh;
}

.particle-mapper-container > svg,
.particle-mapper-container > div
{
    width:1000px;
    margin:0 auto;
}
.particle-mapper-container > svg{
    height:800px;
    background-color:#333333;
}
</style>