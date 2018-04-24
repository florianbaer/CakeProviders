<template>
  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex col-md-8 justify-content-between">
      <h5 class="mb-1">{{this.player}}</h5>
    </div>
  </a>
</template>

<script>
export default {
  name: 'player',
  props: {
      player: Object
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
