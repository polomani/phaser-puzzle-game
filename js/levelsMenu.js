Puzzle.LevelsMenu = function(){};

Puzzle.LevelsMenu.prototype.create = function () {
  var o = Puzzle.LevelsMenu.o =  this.game;
  o.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  o.scale.setResizeCallback(Puzzle.LevelsMenu.onResized);
  o.scale.refresh();

  o.selLevelText = o.add.text(0,0,'Select level', { font: '40px Arial', fill: '#FFFFFF' });
  o.selLevelText.anchor.set(0.5);
  o.selLevelText.text.align = 'center';

  o.lvls = []; 

  for (var i = 0; i < 15; i++) {
        var lvl = o.add.group(); 
        var image = lvl.create(0,0,'box_blue');
        image.anchor.setTo(0.5, 0.5);
        var text = o.add.text(0,0, i+1, {}, lvl);
        text.font = 'Arial';
        text.fontSize = 50;
        text.stroke = '#ff00ff';
        text.strokeThickness = 5;
        text.anchor.setTo(0.5, 0.5);
        lvl.image = image;
        lvl.text = text;
        lvl.number = text.number = image.number = i+1;
        lvl.setAll('inputEnabled', true);
        lvl.callAll('events.onInputDown.add', 'events.onInputDown', Puzzle.LevelsMenu.levelInputListener, this);
        o.lvls.push(lvl);    
    }

    Puzzle.LevelsMenu.onResized();

}

Puzzle.LevelsMenu.onResized = function () {
  var o = Puzzle.LevelsMenu.o;
  o.width = window.innerWidth * window.devicePixelRatio;
  o.height = window.innerHeight * window.devicePixelRatio;

  var rows = 5;
  var cols = 3;

  if (o.width>o.height) {
    rows = cols;
    cols = 5;
  }

  var indentY = o.height/2 - rows*110/2 + 100;
  var indentX = o.width/2 - Math.floor(cols/2)*110;

  o.selLevelText.x = o.width/2;
  o.selLevelText.y = indentY - 90;

  o.lvls.forEach (function(lvl){
      lvl.image.x = indentX + ((lvl.number-1)%cols)*110;
      lvl.image.y = indentY + Math.floor((lvl.number-1)/cols)*100;
      lvl.text.x = lvl.image.x;
      lvl.text.y = lvl.image.y;
  });
};

Puzzle.LevelsMenu.levelInputListener = function (lvl) {
  Editor.aimLVL = lvl.number-1;
  this.game.state.start('Game');
};