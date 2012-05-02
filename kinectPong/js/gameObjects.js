// Our main global objects get defined here
var gameObjects = {};
gameObjects.middleLine = {};
gameObjects.paddle1    = {};
gameObjects.paddle2    = {};
gameObjects.ball       = {};

/**
 * Initialization function for our gameObjects class, setup the various game
 * objects like paddles and such.
 *
 * @since Canvas Pong 1.0
 */
gameObjects.init = function() {
	"use strict";
	
	this.isPaused     = true;	
	this.player1Score = 0;	
	this.player2Score = 0;	
	
	this.paddle1.width       = 4;
	this.paddle1.height      = 142;
	this.paddle1.x           = 10;
	this.paddle1.y           = ( canvas.instance.height / 2 ) - ( this.paddle1.height / 2 );
	this.paddle1.controlMode = 'controls_1';
	
	this.paddle2.width       = 4;
	this.paddle2.height      = 142;
	this.paddle2.x           = canvas.instance.width - 14;
	this.paddle2.y           = ( canvas.instance.height / 2 ) - ( this.paddle2.height / 2 );
	this.paddle2.controlMode = 'computer';
	
	this.ball.x        = canvas.instance.width / 2;
	this.ball.y        = canvas.instance.height / 2;
	this.ball.width    = 7;
	this.ball.speed    = 0;
	this.ball.speedX   = 0;
	this.ball.speedY   = 0;
	this.ball.minSpeed = 8;
	this.ball.maxSpeed = 15;
	this.ball.moveToX  = 0;
	this.ball.moveToY  = 0;
	
	this.ball.weaponTimeout = false;
	
	this.ball.weapon = false;
};

/**
 * Draws the dotted line in the middle of the canvas that signifies which
 * player's side the ball is on.
 *
 * @since Canvas Pong 1.0
 */
gameObjects.middleLine.redraw = function( context, canvas ) {
	"use strict";
	
	// Draw the dotted line in the middle
	var currentPoint = 0;
	
	context.beginPath();
	context.strokeStyle = '#aaa';
	context.lineWidth   = 2;
	context.moveTo( canvas.width / 2, 0 );
	
	while ( currentPoint < canvas.height ) {
		currentPoint += 6;
		context.lineTo( canvas.width / 2, currentPoint );
		
		currentPoint += 10;
		context.moveTo( canvas.width / 2, currentPoint );
	}
	
	context.stroke();
};

/**
 * Draw player 1's paddle (Left)
 *
 * @since Canvas Pong 1.0
 */
gameObjects.paddle1.redraw = function( context, canvas ) {
	"use strict";
	
	if ( ! gameObjects.isPaused ) {

		// // Calculate the actual position of the paddle
		if ( this.controlMode == 'controls_1' ) {
			
			// controls_1 control
			if ( Math.floor( this.y + ( this.height / 2 ) ) !== controls_1.y ) {
				var playerPaddleHalf = Math.floor( this.y + ( this.height / 2 ) );
				
				// Move the paddle up towards the controls_1
				if ( playerPaddleHalf > ( controls_1.y + 9 ) ) {
					this.y -= 9;
				} else if ( playerPaddleHalf >= ( controls_1.y + 7 ) ) {
					this.y -= 7;
				} else {
					this.y = controls_1.y;
				}
				/*if ( playerPaddleHalf >= ( controls_1.y + 3 ) ) {
					this.y -= 3;
				} else if ( playerPaddleHalf >= ( controls_1.y + 1 ) ) {
					this.y -= 1;
				}*/
				
				// Move the paddle down towards the controls_1
				if ( playerPaddleHalf < ( controls_1.y - 9 ) ) {
					this.y += 9;
				} else if ( playerPaddleHalf <= ( controls_1.y - 7 ) ) {
					this.y += 7;
				} else {
					this.y = controls_1.y;
				}
				
				/*if ( playerPaddleHalf <= ( controls_1.y - 3 ) ) {
					this.y += 3;
				} else if ( playerPaddleHalf <= ( controls_1.y - 1 ) ) {
					this.y += 1;
				}*/
				
				// Don't let the paddle go above or below the screen 
				if ( this.y < 0 ) {
					this.y = 0;
				} else if ( ( this.y + this.height ) > canvas.height ) {
					this.y = canvas.height - this.height;
				}
			}
		} else if ( this.controlMode == 'keyboard' ) {
			
			if ( this.moveUp ) {
				
				if ( ( this.y - 10 ) >= 0 ) {
					this.y -= 10;
				} else {
					this.y = 0;
				}
			} else if ( this.moveDown ) {
				
				if ( ( this.y + 10 + this.height ) <= canvas.height ) {
					this.y += 10;
				} else {
					this.y = canvas.height - this.height;
				}
			}
		}
	}
  
	// Draws the paddle
	context.fillStyle = "#fff";
	context.fillRect( this.x, this.y, this.width, this.height );
};

/**
 * Draw player 2's paddle (Right)
 *
 * @since Canvas Pong 1.0
 */
gameObjects.paddle2.redraw = function( context, canvas ) {
	"use strict";
	
	if ( ! gameObjects.isPaused ) {
		
		if ( this.controlMode == 'computer' ) {
			
			// Calculate the actual position of the paddle
			var playerPaddleHalf = Math.floor( this.y + ( this.height / 2 ) );
			
			// Move the paddle up towards the controls_1
			if ( playerPaddleHalf >= ( ( gameObjects.ball.y + ( gameObjects.ball.width / 2 ) ) + 7 ) ) {
				this.y -= 7;
			} else if ( playerPaddleHalf >= ( ( gameObjects.ball.y + ( gameObjects.ball.width / 2 ) ) + 3 ) ) {
				this.y -= 3;
			} else if ( playerPaddleHalf >= ( ( gameObjects.ball.y + ( gameObjects.ball.width / 2 ) ) + 1 ) ) {
				this.y -= 1;
			}
			
			// Move the paddle down towards the controls_1
			if ( playerPaddleHalf <= ( ( gameObjects.ball.y + ( gameObjects.ball.width / 2 ) ) - 7 ) ) {
				this.y += 7;
			} else if ( playerPaddleHalf <= ( ( gameObjects.ball.y + ( gameObjects.ball.width / 2 ) ) - 3 ) ) {
				this.y += 3;
			} else if ( playerPaddleHalf <= ( ( gameObjects.ball.y + ( gameObjects.ball.width / 2 ) ) - 1 ) ) {
				this.y += 1;
			}
			
			// Don't let the paddle go above or below the screen 
			if ( this.y < 0 ) {
				this.y = 0;
			} else if ( ( this.y + this.height ) > canvas.clientHeight ) {
				this.y = canvas.clientHeight - this.height;
			}
		} else /* if ( this.controlMode == 'keyboard' )*/ {
			// controls_1 control
			if ( Math.floor( this.y + ( this.height / 2 ) ) !== controls_2.y ) {
				var playerPaddleHalf = Math.floor( this.y + ( this.height / 2 ) );
				
				//this.y = controls_2.y;
				if ( playerPaddleHalf > ( controls_2.y + 9 ) ) {
					this.y -= 9;
				} else if ( playerPaddleHalf >= ( controls_2.y + 7 ) ) {
					this.y -= 7;
				} else {
					this.y = controls_2.y;
				}
				
				// Move the paddle down towards the controls_1
				if ( playerPaddleHalf < ( controls_2.y - 9 ) ) {
					this.y += 9;
				} else if ( playerPaddleHalf <= ( controls_2.y - 7 ) ) {
					this.y += 7;
				} else {
					this.y = controls_2.y;
				}
				
				// Don't let the paddle go above or below the screen 
				if ( this.y < 0 ) {
					this.y = 0;
				} else if ( ( this.y + this.height ) > canvas.height ) {
					this.y = canvas.height - this.height;
				}
			}
			/*if ( this.moveUp ) {
				
				if ( ( this.y - 10 ) >= 0 ) {
					this.y -= 10;
				} else {
					this.y = 0;
				}
			} else if ( this.moveDown ) {
				
				if ( ( this.y + 10 + this.height ) <= canvas.height ) {
					this.y += 10;
				} else {
					this.y = canvas.height - this.height;
				}
			} */
		}
	}
  
	// Draws the paddle
	context.fillStyle = "#fff";
	context.fillRect( this.x, this.y, this.width, this.height );
};

/**
 * Draw the game ball
 *
 * @since Canvas Pong 1.0
 */
gameObjects.ball.redraw = function( context, canvas ) {
	"use strict";
	
	if ( ! gameObjects.isPaused ) { 
		
		// For when the ball first spawns/respawns, we need to calculate the initial direction
		if ( this.speed === 0 ) {
			
			// Set the initial speed
			this.speed = this.minSpeed;
		
			// Randomly decide whether to start the ball on player 1 or 2's side
			this.moveToX = Math.floor( Math.random() * 2 ) * canvas.width;
			
			// Randomly determine a point on the Y axis to move the ball towards
			this.moveToY = Math.floor( Math.random() * canvas.height );
			
			// Calculate the speed to move in the X and Y axis
			var distanceX = Math.abs( this.moveToX - this.x );
			var distanceY = Math.abs( this.y - this.moveToY );
			
			var speedX = distanceX / this.speed;
			var speedY = distanceY / this.speed;
			
			if ( speedX > speedY ) {
				speedY = distanceY / speedX;
				speedX = ( distanceX / speedX );
			} else if ( speedY > speedX ) {
				speedX = distanceX / speedY;
				speedY = ( distanceY / speedY );
			}
			
			if ( ( this.y - this.moveToY ) > 0 ) {
				speedY *= -1;
			}
			
			if ( ( this.moveToX - this.x ) < 0 ) {
				speedX *= -1;
			}
			
			this.speedX = speedX;
			this.speedY = speedY;
		}
	
		// Only move the ball along the x axis if it isn't going past a player's paddle
		if ( ( this.x > ( gameObjects.paddle1.x + gameObjects.paddle1.width + this.width ) && this.x < ( gameObjects.paddle2.x - this.width ) ) ) {
			this.x += this.speedX;
		} else {
			
			// Did the ball hit the edge or did it hit a player's paddle?
			if ( ( ( this.y + this.width ) < gameObjects.paddle1.y || this.y > ( gameObjects.paddle1.y + gameObjects.paddle1.height ) ) && this.x < ( canvas.width / 2 ) ) {
				
				// The ball hit the edge on player 1's side
				gameObjects.player2Score += 1;
				
				// Reset the ball
				this.speed = 0;
				this.x = canvas.width / 2;
				this.y = canvas.height / 2;
				return false;
			} else if ( ( ( this.y + this.width ) < gameObjects.paddle2.y || this.y > ( gameObjects.paddle2.y + gameObjects.paddle2.height ) ) && this.x > ( canvas.width / 2 ) ) {
				
				// The ball hit the edge on player 2's side
				gameObjects.player1Score += 1;
				
				// Reset the ball
				this.speed = 0;
				this.x = canvas.width / 2;
				this.y = canvas.height / 2;
				return false;
			} else {
				
				// The ball hit a paddle, so let's increment the speed (Only if the new speed is under the maximum speed for the ball)
				if ( Math.abs( this.speedX * 1.1 ) < this.maxSpeed && Math.abs( this.speedY * 1.1 ) < this.maxSpeed ) {
					this.speedX *= 1.1;
					this.speedY *= 1.1;
				}
				
				if ( this.x < ( canvas.width / 2 ) ) {
					
					// Calculate where the ball hit on player 1's paddle
					var percent = Math.abs( Math.floor( gameObjects.paddle1.y - this.y ) ) / gameObjects.paddle1.height;
				} else {
					
					// Calculate where the ball hit on player 2's paddle
					var percent = Math.abs( Math.floor( gameObjects.paddle2.y - this.y ) ) / gameObjects.paddle2.height;
				}
				
				// Based on where the ball hit the paddle, change the deflection angle accordingly
				if ( this.speedY < -0.2 ) {
					
					percent = 1 - percent;
					percent -= 0.5;
					
					// The ball is moving in the upwards direction 
					this.speedY = this.speedY + ( this.speedY * percent * 2 );
				} else if ( this.speedY > 0.2 ) {
					
					percent -= 0.5;
					
					// The ball is moving in the downwards direction 
					this.speedY = this.speedY + ( this.speedY * percent * 2 );
				} else {
					
					this.speedY = Math.floor( Math.random() * 2 );
					
					if ( this.speedY == 0 ) {
						this.speedY = -2;
					} else {
						this.speedY = 2;
					}
				}
					
				// Reverse the horizontal direction of the ball
				this.speedX *= -1;
				
				// Move the ball a bit to prevent an infinite loop
				this.x += this.speedX;
			}
		}
	
		if ( this.y > this.width && this.y < ( canvas.height - this.width ) ) {
			this.y += this.speedY;
		} else {
			if ( Math.abs( this.speedX * 1.1 ) < this.maxSpeed && Math.abs( this.speedY * 1.1 ) < this.maxSpeed ) {
				this.speedX *= 1.1;
				this.speedY *= 1.1;
			}
				
			this.speedY *= -1;
			this.y += this.speedY;
			//return gameObjects.ball.redraw( context, canvas, false );
		}
	}
	var q = this;
	if( this.weapon )
	{
		if( !this.weaponTimeout )
			this.weaponTimeout = setTimeout(function(){
				q.weapon = false;
				q.weaponTimeout = false;
			}, 350);
			 
		context.fillStyle = '#000000';
	}
	else
		context.fillStyle = '#00ff00';
		
	context.beginPath();
	context.arc( this.x, this.y, this.width, 0, Math.PI * 2, true );
	context.closePath();
	context.fill();
	
	context.fillStyle = '#fff';
	context.font      = '44px Verdana';
	context.textAlign = 'end';
	context.fillText( gameObjects.player1Score, ( canvas.width / 2 ) - 20 , 50 );
	
	context.textAlign = 'start';
	context.fillText( gameObjects.player2Score, ( canvas.width / 2 ) + 20 , 50 );  
};