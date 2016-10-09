Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    var o = this.game;

    o.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    o.scale.pageAlignHorizontally = true;

    var logo = o.add.sprite (o.width/2, o.height/3, "logo");
    logo.scale.x = logo.scale.y = Math.min (o.width*1/3/logo.width, 2);
    logo.anchor.set(0.5);

    var play = this.game.play = o.add.sprite (o.width/2, o.height/4*3, "btn_play"); 
    play.scale.x = play.scale.y = Math.min (o.width*1/2/play.width, 2);
    play.anchor.set(0.5);

    play.inputEnabled = true;
    play.events.onInputDown.add(function () {
      Game.aimLVL = Data.completedLevels;
      o.state.start('LevelsMenu');
    });

    play.events.onInputOver.add(function () {
      Game.aimLVL = Data.completedLevels;
      play.scale.x = play.scale.y = play.scale.x*1.1;
    });

    play.events.onInputOut.add(function () {
      Game.aimLVL = Data.completedLevels;
      play.scale.x = play.scale.y = play.scale.x*0.9;
    });

  }
};
