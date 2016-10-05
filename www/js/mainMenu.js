Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    this.game.add.sprite(0,0,'');
    console.log('Menu created');
    //this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    var o = this.game;
    o.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    o.scale.setResizeCallback(Puzzle.MainMenu.onResized);
    o.scale.refresh();

    var style = { font: "30px Arial", fill: "#FFFFFF", align: "center" };
    var play = this.game.play = this.game.add.text(o.width/2, o.height/2, "Play", style);
    play.anchor.set(0.5);

    var select = this.game.select = this.game.add.text(o.width/2, play.height+play.y, "Select level", style);
    select.anchor.set(0.5);

    var other_text = this.game.other_text = this.game.add.text(o.width/2, select.height+select.y, "other_text", style);
    other_text.anchor.set(0.5);

    play.inputEnabled = true;
    play.events.onInputDown.add(function () {
      Game.aimLVL = 1; //Data.completedLevels;
      o.state.start('Game');
      console.log('play clicked');
    });

    select.inputEnabled = true;
    select.events.onInputDown.add(function () {
      o.state.start('LevelsMenu');
      console.log('select levels clicked');
    });

    other_text.inputEnabled = true;
    other_text.events.onInputDown.add(function () {
      //o.state.start('LevelsMenu');g
      console.log('other_text');
    });
  }
};

Puzzle.MainMenu.onResized = function (obj) {
  obj.game.width = window.innerWidth * window.devicePixelRatio;
  obj.game.height = window.innerHeight * window.devicePixelRatio;
  obj.game.scale.setScreenSize(true);
  obj.game.scale.refresh();

  obj.game.play.x = obj.game.width/2;
  obj.game.play.y = obj.game.height/2;
  obj.game.select.x = obj.game.width/2;
  obj.game.select.y =  obj.game.play.height+obj.game.play.y;
}