<template>
  <g>
      <path :d="renderedPath" fill="#000000" />
      <circle v-for="(c, i) in circles" :key="'circle-'+i.toString()" r="3" :fill="c.color" :cx="c.x" :cy="c.y" />
  </g>
</template>

<script>
export default {
    props: {
        path: Array,
        sig: Number
    },
    data () {
        return{
            renderedPath: '',
            circles: []
        }
    },
    created: function () {
        console.log(this.path);
        this.renderPath();
    },
    methods:{
        renderPath: function () {
            this.circles = [];
            this.renderedPath = '';
            this.renderedPath += `M ${this.path[0][2].x} ${this.path[0][2].y}`;
            for(let i = 0; i < this.path.length; i++){
                let prefix = ' C ';
                let nextIndex = i == this.path.length - 1 ? 0 : i + 1;
                this.renderedPath += `${prefix} ${this.path[i][0].x} ${this.path[i][0].y} ${this.path[nextIndex][1].x} ${this.path[nextIndex][1].y} ${this.path[nextIndex][2].x} ${this.path[nextIndex][2].y}`;
            }
            this.renderedPath += ' Z';
        }
    },
    watch: {
        sig: function () {
            this.renderPath();
        }
    }
}
</script>

<style>

</style>