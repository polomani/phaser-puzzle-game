Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    var o = this.game;

    o.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    o.scale.pageAlignHorizontally = true;

    var logo = o.add.sprite (o.width/2, o.height/3, Dimensions.getImageKey("logo"));
    logo.scale.x = logo.scale.y = Math.min (o.width*1/3/logo.width, 1);
    logo.anchor.set(0.5);

    var play = this.game.play = o.add.sprite (o.width/2, o.height/4*3, "btn_play"); 
    play.scale.x = play.scale.y = Math.min (o.width*1/2/play.width, 1);
    play.anchor.set(0.5);

    this.game.changeLocale = function () {
      switch (getLocale()) {
        case "en":
          play.frame=1;
        break;
        case "uk":
          play.frame=2;
        break; 
        case "ru":
          play.frame=0;
        break; 
      }
    }
    o.changeLocale();

    play.inputEnabled = true;
    play.events.onInputDown.add(function () {
      if (!Popup.anyWinOpened()) {
        Game.aimLVL = Data.completedLevels;
        o.state.start('LevelsMenu');
      }
    });

    if (Data.newbie==1) {
        Popup.openPropsMenu(this.game, 1);
    }

    Promotion.init();
  }
};
