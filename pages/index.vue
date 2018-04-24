<template>
  <div id="app" class="container">
    <div class="row">
      <game :key="item.game.opponent" v-for="item of this.games" :game="item"></game>
    </div>
  </div>
</template>

<script>
  import Game from '../components/Game'
  var axios = require('axios');
  var moment = require('moment')

  export default {
    name: 'app',
    data: function() {
      return {
        games: []
      }
    },
    mounted() {
      this.GetApiData()
    },
    methods: {
      GetApiData: function() {
        axios.get('/api')
          .then((response) => {
            this.games = response.data;
          }).catch((error) => {
          console.log(error);
        })
      },
    },
    components: {
      Game
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
