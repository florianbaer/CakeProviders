<template><div>
  <div id="app" class="container" v-if="this.$route.params.teamId">
    <div class="row">
      <game :key="item.game.opponent" v-for="item of this.games" :game="item"></game>
    </div>
    
  </div>
  <div class="container">
    <div class="list-group col-md-4 margin-bottom-list" v-if="!this.$route.params.teamId">
      <a href="/429603">Herren</a>
      </div>
      <div class="list-group col-md-4 margin-bottom-list" v-if="!this.$route.params.teamId">
        <a href="/429578">Damen</a>
      </div> 
    </div>
  </div>
  
</template>

<script>
import Game from "../components/Game";
var axios = require("axios");
var moment = require("moment");

export default {
  name: "app",
  data: function() {
    return {
      games: []
    };
  },
  mounted() {
    if(this.$route.params.teamId){
      this.GetApiData(this.$route.params.teamId);
    }
  },
  methods: {
    GetApiData: function(teamId) {
      axios
        .get(`/api/cakelist/${teamId}`)
        .then(response => {
          this.games = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    Game
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
