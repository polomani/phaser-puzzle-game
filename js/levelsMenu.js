Puzzle.LevelsMenu = function(){};

Puzzle.LevelsMenu.prototype.create = function () {
  var o = Puzzle.LevelsMenu.o =  this.game;

  o.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
  o.scale.pageAlignHorizontally = true;

  o.selLevelText = o.add.bitmapText(0, 0, "blue", LOCALE.SELECT_LEVEL, Dimensions.getFontSize()-5);
  o.selLevelText.anchor.set(0.5, 0.5);
  o.selLevelText.text.align = 'center';

  var googlePlay = o.add.sprite (o.width/2, o.height,"google_play_badge");
  googlePlay.frame = getLocales().indexOf(getLocale());
  googlePlay.scale.x = googlePlay.scale.y = 0.34;
  googlePlay.anchor.set(0.5, 1);
  googlePlay.inputEnabled = true;
  googlePlay.input.useHandCursor = true;
  googlePlay.events.onInputDown.add(function () { window.open('https://play.google.com/store/apps/details?id=cc.dreamlike.quady'); });

  o.lvls = []; 
  o.pages = o.add.group(); 

  for (var i = 0; i < 30; i++) {
        var lvl = o.add.group();
        var image = lvl.create(0,0, Dimensions.getImageKey('box_black'));
        image.anchor.setTo(0.5, 0.5);
        var text = o.add.bitmapText(0, 0, "black", i+1, Dimensions.getLvlsFontSize(), lvl);
        text.anchor.setTo(0.5, 0.6);
        lvl.image = image;
        lvl.text = text;
        lvl.number = text.number = image.number = i+1;
        //i > Data.completedLevels && 
        if (i > Data.completedLevels) {
          lvl.alpha = 0.5;
        } else {
          lvl.setAll('inputEnabled', true);
          lvl.setAll('input.useHandCursor', true);
          text.image = image;
          text.events.onInputDown.add (function (text) { text.alpha = 0.7; });
          image.events.onInputDown.add (function (image) { image.alpha = 0.7;});
          lvl.callAll('events.onInputUp.add', 'events.onInputUp', Puzzle.LevelsMenu.levelInputListener, this);     
        }
        o.pages.add(lvl);
        o.lvls.push(lvl);    
    }

    var google = o.google = o.add.sprite (0, 0, "google_play_badge");
    google.scale.x = google.scale.y = 0.34;
    google.anchor.set(0.5, 0);
    google.inputEnabled = true;
    google.input.useHandCursor = true;
    google.frame = getLocales().indexOf(getLocale());
    google.events.onInputDown.add(function () { window.open('https://play.google.com/store/apps/details?id=cc.dreamlike.quady'); });
    o.pages.add(google);

    var googleText = o.googleText = o.add.bitmapText(0, 0, "white", LOCALE.TRY_MOBILE, Dimensions.getFontSize()-17);
    googleText.align = "center";
    googleText.anchor.set(0.5, 1);
    o.pages.add(googleText);

    var left = o.left = this.game.add.sprite (0,0, Dimensions.getImageKey('btn_next'));
    var right = o.right = this.game.add.sprite (0,0, Dimensions.getImageKey('btn_next'));
    right.inputEnabled = true;
    left.inputEnabled = true;
    right.input.useHandCursor = true;
    left.input.useHandCursor = true;

    var page = right.page = 0;
    left.angle = -180;
    right.anchor.setTo(0, 0.5);
    left.anchor.setTo(0, 0.5);
    left.alpha = 0.5;
    
    right.events.onInputDown.add(function () {
      if (right.alpha == 1)
        right.x += right.width*0.1;
    });

    left.events.onInputDown.add(function () {
      if (left.alpha == 1)
        left.x -= left.width*0.1;
    });

    right.events.onInputUp.add(function () {
        if (right.alpha == 1)
          right.x -= right.width*0.1;
        if (!o.pages.moving) {
          if (page<o.lvls.length/15) {
            ++page;
            o.pages.moving = true;
            var tween = o.add.tween(o.pages).to( { alpha: 0}, 200, "Linear", true);
            tween.onComplete.add(function() {
                o.pages.x = -o.width*page;
                tween = o.add.tween(o.pages).to( {alpha: 1}, 200, "Linear", true);
                tween.onComplete.add(function() { o.pages.moving=false;});
                left.alpha = 1;
                if (page==o.lvls.length/15) {
                  right.alpha = 0.5;
                }
            });
          }
        }
    });

    left.events.onInputUp.add(function () {
        if (left.alpha == 1)
          left.x += left.width*0.1;
        if (!o.pages.moving) {
          if (page>0) {
            --page;
            o.pages.moving = true;
            var tween = o.add.tween(o.pages).to( { alpha: 0}, 200, "Linear", true);
            tween.onComplete.add(function() { 
                o.pages.x = -o.width*page;
                tween = o.add.tween(o.pages).to( {alpha: 1}, 200, "Linear", true);
                tween.onComplete.add(function() { o.pages.moving=false;});
                right.alpha = 1;
                if (page==0) {
                  left.alpha = 0.5;
                }
            });
          }
        }
    });

    var props = this.game.add.sprite (this.game.width,0, Dimensions.getImageKey("btn_props"));
    props.anchor.setTo(1, 0);
    props.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/props.width));
    props.inputEnabled = true;
    props.events.onInputDown.add(function () {
      if (!(Popup.anyWinOpened())) {
          Popup.openPropsMenu(o);
        }
    });

    o.changeLocale = function () {
      o.selLevelText.setText(LOCALE.SELECT_LEVEL);
    }

    Puzzle.LevelsMenu.onResized();
}

Puzzle.LevelsMenu.onResized = function () {
  var o = Puzzle.LevelsMenu.o;

  var rows = 5;
  var cols = 3;

  var gap = Math.round (o.width/100*2);

  if (o.width>o.height) {
    rows = cols;
    cols = 5;
  }

  var boxSize = Dimensions.getBoxSize();
  var BSIZE = Math.min(boxSize, Math.min(o.width, o.height)/6);

  var indentY = 0;//o.height/2 - (rows+1)*(BSIZE+10)/2 + 100;
  var indentX = o.width/2 - Math.floor(cols/2)*(BSIZE+gap);

  o.lvls.forEach (function(lvl){
      var number = (lvl.number-1) % 15;
      var page = ((lvl.number-1) / 15) | 0;
      lvl.image.x = indentX + o.width*page + (number%cols)*(BSIZE+gap);
      lvl.image.y = indentY + Math.floor(number/cols)*(BSIZE+gap);
      var textScaleX = lvl.text.width / lvl.image.width;
      var textScaleY = lvl.text.height / lvl.image.height;
      lvl.image.scale.setTo (BSIZE/boxSize, BSIZE/boxSize);
      lvl.text.x = lvl.image.x;
      lvl.text.y = lvl.image.y;
  });

  o.pages.y = (o.height - o.pages.height)/2 + BSIZE/2;

  o.selLevelText.x = o.width/2;
  o.selLevelText.y = (o.pages.y-o.selLevelText.height)/2;

  o.right.width =  o.right.height = o.left.width =  o.left.height = o.lvls[0].image.width;
  o.right.y = o.left.y = o.pages.y + o.lvls[5].image.y;
  o.left.x = o.lvls[5].image.x - o.lvls[5].image.width;
  o.right.x = o.lvls[9].image.x + o.lvls[5].image.width;


  o.googleText.x = o.width * 2 + o.width/2;
  o.googleText.y = o.pages.height/2 - o.googleText.height*1.5;

  o.google.x = o.googleText.x;
  o.google.y = o.googleText.y;


};

Puzzle.LevelsMenu.levelInputListener = function (lvl) {
  Game.aimLVL = lvl.number-1;
  this.game.state.start('Game');
};