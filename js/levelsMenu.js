Puzzle.LevelsMenu = function(){};

Puzzle.LevelsMenu.prototype.create = function () {
  var o = Puzzle.LevelsMenu.o =  this.game;

  o.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  o.scale.pageAlignHorizontally = true;

  o.selLevelText = o.add.bitmapText(0, 0, "white", "Select level", 50);
  o.selLevelText.anchor.set(0.5);
  o.selLevelText.text.align = 'center';

  o.lvls = []; 

  for (var i = 0; i < 15; i++) {
        var lvl = o.add.group(); 
        var image = lvl.create(0,0,'box_black');
        image.anchor.setTo(0.5, 0.5);
        var text = o.add.bitmapText(0, 0, "black", i+1, 36, lvl);
        text.anchor.setTo(0.5, 0.5);
        lvl.image = image;
        lvl.text = text;
        lvl.number = text.number = image.number = i+1;
        //i > Data.completedLevels && 
        if (i > 12 && i > Data.completedLevels) {
          lvl.alpha = 0.5;
        } else {
          lvl.setAll('inputEnabled', true);
          lvl.callAll('events.onInputDown.add', 'events.onInputDown', Puzzle.LevelsMenu.levelInputListener, this);
        }
        o.lvls.push(lvl);    
    }

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

  var BSIZE = Math.min(100*2, Math.min(o.width, o.height)/6);

  var indentY = o.height/2 - rows*(BSIZE+10)/2 + 100;
  var indentX = o.width/2 - Math.floor(cols/2)*(BSIZE+10);

  o.selLevelText.scale.setTo (BSIZE/100, BSIZE/100);
  o.selLevelText.x = o.width/2;
  o.selLevelText.y = indentY - o.selLevelText.height*3;

  o.lvls.forEach (function(lvl){
      lvl.image.x = indentX + ((lvl.number-1)%cols)*(BSIZE+10);
      lvl.image.y = indentY + Math.floor((lvl.number-1)/cols)*(BSIZE+10);
      lvl.image.scale.setTo (BSIZE/100, BSIZE/100);
      lvl.text.scale.setTo (BSIZE/100, BSIZE/100);
      lvl.text.x = lvl.image.x;
      lvl.text.y = lvl.image.y;
  });
};

Puzzle.LevelsMenu.levelInputListener = function (lvl) {
  Game.aimLVL = lvl.number-1;
  this.game.state.start('Game');
};