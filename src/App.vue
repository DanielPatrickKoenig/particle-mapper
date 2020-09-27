<template>
  <div id="app">
    <select v-model="viewIndex">
      <option v-for="(v, i) in views" :key="'view-'+i.toString()" :value="i">{{v}}</option>
    </select>
    <SVGvsPIXI v-show="viewIndex == 0" />
    <ParticleMapper v-show="viewIndex == 1" />
  </div>
</template>

<script>
import SVGvsPIXI from './components/SVGvsPIXI.vue';
import ParticleMapper from './components/ParticleMapper.vue';
export default {
  name: 'App',
  data () {
    return{
      views: [
        'SVG vs PIXI',
        'Patricle Mappter'
      ],
      viewIndex: 0
    }
  },
  components: {
    SVGvsPIXI,
    ParticleMapper
  }
}
</script>
