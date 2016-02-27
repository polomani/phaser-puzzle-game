Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    //this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

    var o = this.game;

    var style = { font: "30px Arial", fill: "#FFFFFF", align: "center" };
    var play = this.game.add.text(o.width/2, o.height/2, "Play", style);
    play.anchor.set(0.5);
    var select = this.game.add.text(o.width/2, play.height+play.y, "Select level", style);
    select.anchor.set(0.5);

    play.inputEnabled = true;
    play.events.onInputDown.add(function () {
      o.state.start('Game');
    });

    select.inputEnabled = true;
    select.events.onInputDown.add(function () {
      o.state.start('LevelsMenu');
    });

  }
};