// Our main global objects get defined here
var keyboard = {};

/**
 * Listens for keyboard presses
 *
 * @since Canvas Pong 1.0
 */
keyboard.handler = function(e) {
	"use strict";
	
	var key_code;
	var key_char;

	if ( window.event ) {
		key_code = e.keyCode;
	} else if ( e.which ) {
		key_code = e.which;
	}
	
	key_char = String.fromCharCode( key_code );
	
	if ( key_code == 38 ) {
		if ( gameObjects.paddle2.controlMode == 'computer' ) {
			gameObjects.paddle1.moveUp = true;
		} else {
			gameObjects.paddle2.moveUp = true;
		}
	} else if ( key_code == 40 ) {
		if ( gameObjects.paddle2.controlMode == 'computer' ) {
			gameObjects.paddle1.moveDown = true;
		} else {
			gameObjects.paddle2.moveDown = true;
		}
	} else if ( key_code == 13 ) {
		if ( gameObjects.paddle2.controlMode == 'computer' ) {
			gameObjects.paddle2.controlMode = 'keyboard';
		} else {
			gameObjects.paddle2.controlMode = 'computer';
		}
	} else if ( key_char == 'p' || key_char == 'P' || key_char == ' ' ) {
		gameObjects.isPaused = ! gameObjects.isPaused;
	} else if ( key_char == 'r' || key_char == 'R' ) {
		
		// Reset the ball
		gameObjects.ball.speed   = 0;
		gameObjects.ball.x       = canvas.instance.width / 2;
		gameObjects.ball.y       = canvas.instance.height / 2;
		
		// Reset the scores
		gameObjects.player1Score = 0;
		gameObjects.player2Score = 0;
		gameObjects.isPaused     = true;
		
		// Reset the paddles
		gameObjects.paddle2.x    = canvas.instance.width - 14;
		gameObjects.paddle2.y    = ( canvas.instance.height / 2 ) - ( gameObjects.paddle2.height / 2 );
		
		gameObjects.paddle1.x    = 10;
		gameObjects.paddle1.y    = ( canvas.instance.height / 2 ) - ( gameObjects.paddle1.height / 2 );
	} else if ( key_char == 'w' || key_char == 'W' ) {
		gameObjects.paddle1.moveUp = true;
	} else if ( key_char == 's' || key_char == 'S' ) {
		gameObjects.paddle1.moveDown = true;
	} else if ( key_char == 'k' || key_char == 'K' ) {
		gameObjects.paddle1.controlMode = 'keyboard';
	} else if ( key_char == 'm' || key_char == 'M' ) {
		gameObjects.paddle1.controlMode = 'mouse';
	}
};

/**
 * Listens for keyup events so we can stop moving a paddle
 *
 * @since Canvas Pong 1.0
 */
keyboard.handlerRelease = function(e) {
	"use strict";
	
	var key_code;
	var key_char;

	if ( window.event ) {
		key_code = e.keyCode;
	} else if ( e.which ) {
		key_code = e.which;
	}
	
	key_char = String.fromCharCode( key_code );
	
	if ( key_code == 38 ) {
		if ( gameObjects.paddle2.controlMode == 'computer' ) {
			gameObjects.paddle1.moveUp = false;
		} else {
			gameObjects.paddle2.moveUp = false;
		}
	} else if ( key_code == 40 ) {
		if ( gameObjects.paddle2.controlMode == 'computer' ) {
			gameObjects.paddle1.moveDown = false;
		} else {
			gameObjects.paddle2.moveDown = false;
		}
	} else if ( key_char == 'w' || key_char == 'W' ) {
		gameObjects.paddle1.moveUp = false;
	} else if ( key_char == 's' || key_char == 'S' ) {
		gameObjects.paddle1.moveDown = false;
	}
};