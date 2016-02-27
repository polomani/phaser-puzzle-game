Puzzle.LevelsMenu = function(){};

Puzzle.LevelsMenu.prototype.create = function () {
  this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  this.game.scale.setScreenSize(true);
  this.game.scale.refresh();

  var o = this.game;

  var sel = o.add.text(o.world.centerX, 40, 'Select level', { font: '40px Arial', fill: '#FFFFFF' });
  sel.anchor.set(0.5);
  sel.text.align = 'center';

  var rows = 5;
  var cols = 3;

  if (o.width>o.height) {
    rows = cols;
    cols = 5;
  }

  var indentY = o.world.centerY - rows*110/2;
  var indentX = o.world.centerX - Math.floor(cols/2)*110;


  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
          var lvl = o.add.group(); 
          var image = lvl.create(indentX + i*110, indentY + j*110, 'box_blue');
          image.anchor.setTo(0.5, 0.5);
          var text = o.add.text(0,0, (j*cols)+i+1, {}, lvl);
          text.font = 'Arial';
          text.fontSize = 50;
          text.fill = '#0';
          text.stroke = '#ff00ff';
          text.strokeThickness = 5;
          text.anchor.setTo(0.5, 0.5);
          text.x = image.x;
          text.y = image.y+3;
          text.number = (j*cols)+i+1;
          image.number = (j*cols)+i+1;
          lvl.setAll('inputEnabled', true);
          lvl.callAll('events.onInputDown.add', 'events.onInputDown', Puzzle.LevelsMenu.levelInputListener, this);
      }      
    }

    
}

Puzzle.LevelsMenu.levelInputListener = function (lvl) {
  Editor.aimLVL = lvl.number-1;
  this.game.state.start('Game');
};