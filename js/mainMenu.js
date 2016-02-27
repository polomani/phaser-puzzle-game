Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    //this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

    var text = "Tap to begin";
    var style = { font: "30px Arial", fill: "#000", align: "center" };
    var t = this.game.add.text(gWidth/2, gHeight/2, text, style);
    t.anchor.set(0.5);

    this.game.state.start('LevelsMenu');
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('Game');
    }
  }
};