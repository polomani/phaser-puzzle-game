Puzzle.LevelsMenu = function(){};

Puzzle.LevelsMenu.prototype.create = function () {
  var o = Puzzle.LevelsMenu.o =  this.game;

  o.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  o.scale.pageAlignHorizontally = true;

  o.selLevelText = o.add.bitmapText(0, 0, "blue", LOCALE.SELECT_LEVEL, Dimensions.getFontSize());
  o.selLevelText.anchor.set(0.5, 0.5);
  o.selLevelText.text.align = 'center';

  o.lvls = []; 
  o.pages = o.add.group(); 

  for (var i = 0; i < 30; i++) {
        var lvl = o.add.group();
        var image = lvl.create(0,0, Dimensions.getImageKey('box_black'));
        image.anchor.setTo(0.5, 0.5);
        var text = o.add.bitmapText(0, 0, "black", i+1, Dimensions.getFontSize()-10, lvl);
        text.anchor.setTo(0.5, 0.6);
        lvl.image = image;
        lvl.text = text;
        lvl.number = text.number = image.number = i+1;
        //i > Data.completedLevels && 
        if (false && i > Data.completedLevels) {
          lvl.alpha = 0.5;
        } else {
          lvl.setAll('inputEnabled', true);
          lvl.callAll('events.onInputDown.add', 'events.onInputDown', Puzzle.LevelsMenu.levelInputListener, this);
        }
        o.pages.add(lvl);
        o.lvls.push(lvl);    
    }

    var paginator = o.paginator = this.game.add.sprite (0,0, 'btn_next');
    paginator.inputEnabled = true;
    var page = paginator.page = 0;
    paginator.anchor.setTo(0.5, 0.5);
    paginator.events.onInputDown.add(function () {
        if (!o.pages.moving) {
          page = (++page)%2;
          var x = o.pages.x;
          o.pages.x -= o.width*page;
          o.pages.x += o.width*(1-page);
          o.pages.moving = true;
          var tween = o.add.tween(o.pages).to( { alpha: 0}, 200, "Linear", true);
          tween.onComplete.add(function() { 
              o.pages.alpha = 1;
              o.add.tween(o.paginator).to( { angle: -180*page }, 200, "Linear", true);
              tween = o.add.tween(o.pages).from( { alpha: 0, x:x}, 200, "Linear", true);
              tween.onComplete.add(function() { o.pages.moving=false;});
          });
        }
    });

    Puzzle.LevelsMenu.onResized();

}

Puzzle.LevelsMenu.onResized = function () {
  var o = Puzzle.LevelsMenu.o;

  var rows = 5;
  var cols = 3;

  if (o.width>o.height) {
    rows = cols;
    cols = 5;
  }

  var boxSize = Dimensions.getBoxSize();
  var BSIZE = Math.min(boxSize, Math.min(o.width, o.height)/7);

  var indentY = o.height/2 - (rows+1)*(BSIZE+10)/2 + 100;
  var indentX = o.width/2 - Math.floor(cols/2)*(BSIZE+10);

  o.selLevelText.x = o.width/2;
  o.selLevelText.y = indentY/2;

  o.lvls.forEach (function(lvl){
      var number = (lvl.number-1) % 15;
      var page = ((lvl.number-1) / 15) | 0;
      lvl.image.x = indentX + o.width*page + (number%cols)*(BSIZE+10);
      lvl.image.y = indentY + Math.floor(number/cols)*(BSIZE+10);
      var textScaleX = lvl.text.width / lvl.image.width;
      var textScaleY = lvl.text.height / lvl.image.height;
      lvl.image.scale.setTo (BSIZE/boxSize, BSIZE/boxSize);
      lvl.text.x = lvl.image.x;
      lvl.text.y = lvl.image.y;
  });

  o.paginator.width =  o.paginator.height = o.lvls[0].width*0.7;
  o.paginator.y = indentY + Math.floor(15/cols)*(BSIZE+10);
  o.paginator.x = o.width/2;
};

Puzzle.LevelsMenu.levelInputListener = function (lvl) {
  Game.aimLVL = lvl.number-1;
  this.game.state.start('Game');
};