<template>
  <div id="app">
    <select v-model="viewIndex">
      <option v-for="(v, i) in views" :key="'view-'+i.toString()" :value="i">{{v}}</option>
    </select>
    <SVGvsPIXI v-show="viewIndex == 0" />
    <ParticleMapper v-show="viewIndex == 1" />
    <FollowTouch v-show="viewIndex == 2" />
  </div>
</template>

<script>
import SVGvsPIXI from './components/SVGvsPIXI.vue';
import ParticleMapper from './components/ParticleMapper.vue';
import FollowTouch from './components/FollowTouch.vue';
export default {
  name: 'App',
  data () {
    return{
      views: [
        'SVG vs PIXI',
        'Patricle Mappter',
        'Follow Touch'
      ],
      viewIndex: 0
    }
  },
  components: {
    SVGvsPIXI,
    ParticleMapper,
    FollowTouch
  }
}
</script>
