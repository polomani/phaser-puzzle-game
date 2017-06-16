function addGameMenu (game) {

	var pause = game.add.sprite (0,0, Dimensions.getImageKey("btn_pause"));
    pause.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/pause.width));
    makeThisButton(pause, Popup.openOptMenu);

    var props = game.add.sprite (game.width,0, Dimensions.getImageKey("btn_props"));
    props.anchor.setTo(1, 0);
    props.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/props.width));
    makeThisButton(props, Popup.openPropsMenu);
    
    var menu = game.add.group();
    
    var lvls = addButton (0, 0, "lvls_icon", function () {
        game.state.start("LevelsMenu"); 
    });
    
    var hints = addButton (lvls.width, 0, "hints_icon", function () {
        var solution = AI.findSolution(game.matrix, true);
        autopilot(solution, game.matrix);
    });
    
    var undo = game.undoButton = addButton (hints.x+hints.width, 0, "undo_icon", function () {
        if (Puzzle.story && Puzzle.story.length>0) {
            Puzzle.undo = true;
            game.state.start("Game");
        }
    });

    if (!Puzzle.story || Puzzle.story.length==0) 
        deactivateButton (undo);
    
    var replay = addButton (undo.x+undo.width, 0, "replay_icon", function () {
        game.state.start("Game");
    });
    
    function addButton (x, y, name, callback) {
        var btn = game.add.sprite (x, y, name);
        btn.scale.setTo(Math.min(1, Dimensions.getMinDimension()/8/btn.width));
        menu.add(btn);
        makeThisButton(btn, callback);
        return btn;
    }
    
    function makeThisButton (btn, callback) {
        btn.active = true;
        btn.inputEnabled = true;
	    btn.events.onInputUp.add(function () {
            if (btn.active)
            {
                btn.alpha = 1;
                if (!Popup.anyWinOpened()) callback();
            }
	    });
	    btn.events.onInputDown.add(function () {
      		btn.alpha = 0.6;
    	});
        return btn;
    }
    
    menu.x = (game.width - menu.width)/2;
    menu.y = game.height - menu.height;
}