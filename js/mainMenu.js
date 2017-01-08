Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    var o = this.game;

    o.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    o.scale.pageAlignHorizontally = true;

    var logo = o.add.sprite (o.width/2, o.height/3, Dimensions.getImageKey("logo"));
    logo.scale.x = logo.scale.y = Math.min (Dimensions.getMinDimension()*1/3/logo.width, 1);
    logo.anchor.set(0.5);

    var googlePlay = o.add.sprite (o.width/2, o.height,"google_play_badge");
    googlePlay.scale.x = googlePlay.scale.y = 0.34;
    googlePlay.anchor.set(0.5, 1);
    googlePlay.inputEnabled = true;
    googlePlay.input.useHandCursor = true;
    googlePlay.events.onInputDown.add(function () { window.open('https://play.google.com/store/apps/details?id=cc.dreamlike.quady'); });

    var play = this.game.play = o.add.sprite (o.width/2, 330, "btn_play"); 
    play.scale.x = play.scale.y = Math.min (o.width*1/2/play.width, 0.6);
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
      googlePlay.frame = getLocales().indexOf(getLocale());
    }
    o.changeLocale();

    play.inputEnabled = true;
    play.input.useHandCursor = true;
    play.events.onInputDown.add(function () {
      if (!Popup.anyWinOpened()) {
        Game.aimLVL = Data.completedLevels;
        o.state.start('LevelsMenu');
      }
    });

    play.events.onInputOver.add(function () {
      play.scale.x=play.scale.y=play.scale.x+0.1;
    });
    play.events.onInputOut.add(function () {
      play.scale.x=play.scale.y=play.scale.x-0.1;
    });

    Promotion.init();
  }
};
