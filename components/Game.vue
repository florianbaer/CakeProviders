<template>
  <div class="list-group col-md-4 margin-bottom-list">
    <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
      <div class="row">
      <div class="d-flex col-md-9 justify-content-between">
        <h5 class="mb-1">{{game.game.opponent}}</h5>
      </div>
      <div class="col-md-3">
        <small>{{game.game.date}}</small>
      </div>
      </div><div class="row">
      <p class="col-md-12 mb-1">{{game.game.location}}</p>
      </div>
      <a :href="encodedText">Mitteilen</a>
    </a>
    <player :key="item"  v-for="item of this.game.Players" :player="item"></player>



</div>


</template>

<script>
import Player from "./Player";
export default {
  name: "Game",
  props: {
    game: Object
  },
  computed: {
    encodedText: function() {
      return (
        "https://wa.me/?text=" +
        encodeURI(
          `Kuchen für das Spiel am  ${this.game.game.date} in ${
            this.game.game.location
          } müssen bringen:\n${this.game.Players.join("\n")}`
        )
      );
    }
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  components: {
    Player
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

a {
  color: white;
}

.margin-bottom-list {
  margin-bottom: 20px;
}
</style>
