Puzzle.MainMenu = function(){};

Puzzle.MainMenu.prototype = {
  create: function() {
    var o = this.game;

    o.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    o.scale.pageAlignHorizontally = true;

    var logo = o.add.sprite (o.width/2, o.height/3, "logo");
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
        Data.checkIn();
        Popup.openPropsMenu(this.game, 1);
    }

    if (window.Cocoon && window.Cocoon.Ad) {
        console.log("loading interstitial");
        Cocoon.Ad.AdMob.configure({
            android: {
              interstitial:"ca-app-pub-9147936306521137/8577493605"
            }
        });
        var interstitial = Cocoon.Ad.AdMob.createInterstitial();
        interstitial.on("load", function(){
          interstitial.show();
          console.log("interstitial loaded");
        });
        interstitial.on("fail", function(){
           console.log("interstitial failed");
        });
        interstitial.on("show", function(){
          console.log("Interstitial shown");
        });
        interstitial.load();
    }

    if (window.Cocoon && window.Cocoon.Notification && Data.completedLevels < 25 && Data.notification <= Date.now()) {
      Cocoon.Notification.Local.cancelAllNotifications();
      Cocoon.Notification.Local.initialize({}, function(registered) {
          var notification = {
          message : LOCALE.NOTIFICATION,
          date : (Date.now() + 1000*60*60*24*5).toFixed()
         };
        Data.notificate(notification.date);
        Cocoon.Notification.Local.send(notification);
      });
    }

    if (false && window.AppRate) {
      AppRate.preferences = {
        displayAppName: 'Quady', 
        useLanguage:getLocale(),
        storeAppURL: {
          android: 'market://details?id=cc.dreamlike.quady'
        }
      };

      AppRate.promptForRating();
    }
  }
};
