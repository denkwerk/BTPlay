document.addEventListener('keyup', function(e) {
	if( e.keyCode === 13 )
	{ 
		e.stopPropagation();
		e.preventDefault();
		
		gameObjects.isPaused = !gameObjects.isPaused;
	}
	else if( e.keyCode === 27 )
	{
		e.stopPropagation();
		e.preventDefault();
			
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
	}
},false);