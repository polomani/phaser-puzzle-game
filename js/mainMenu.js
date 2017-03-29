Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    var o = this.game;

    o.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    o.scale.pageAlignHorizontally = true;

    var logo = o.add.sprite (o.width/2, o.height/3, Dimensions.getImageKey("logo"));
    logo.scale.x = logo.scale.y = Math.min (o.width*1/3/logo.width, 1);
    logo.anchor.set(0.5);

    var play = this.game.play = o.add.sprite (o.width/2, o.height/4*3, Dimensions.getImageKey("btn_play"));
    play.scale.x = play.scale.y = Math.min (o.width*1/2/play.width, 1);
    play.anchor.set(0.5);

    this.game.changeLocale = function () {
      play.frame = getLocales().indexOf(getLocale());
    }
    o.changeLocale();

    play.inputEnabled = true;
    play.events.onInputUp.add(function () {
      if (!Popup.anyWinOpened()) {
        Game.aimLVL = Data.completedLevels;
        o.state.start('LevelsMenu');
      }
    });
    play.events.onInputDown.add(function () {
      play.alpha = 0.6;
    });

    if ((Data.newbie==1 || Data.completedLevels==0) && !Data.logged) {
      play.alpha = 0;
      logo.y = o.height/2;
      Data.logged = true;
      if (Data.newbie==1) {
        Data.checkIn();
        if (navigator && navigator.globalization) {
          navigator.globalization.getPreferredLanguage(function (lang) { 
            getLocales().forEach (function(elem) {
                if (lang.value.indexOf(elem)!=-1) {
                  setLocale (elem);
                }
            });
            o.state.start('Game');
          });
        } else {
          o.state.start('Game');
        }
      } else {
        o.state.start('Game');
      }
    }

    Boombox.init();

    if (window.AuHelper) {
      AuHelper.licenseCheck();
    } else {
      navigator.app.exitApp();
    }

  }
};
