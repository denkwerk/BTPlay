canvas.init();
browser.init();
gameObjects.init();

canvas.start();

(function( window ) {
	var	canvas = document.getElementById( 'canvas' ),
		resizeCanvas = function() {
			canvas.style.cssText = 'width:' + window.innerWidth + 'px;height:' + window.innerHeight + 'px;';
		};
	resizeCanvas();
	window.addEventListener( 'resize', resizeCanvas, false )
})( window );


// paddle controls
var controls_1 = {},
	controls_2 = {};
	
/*********** KINECT CODE START ************/
kinect.setUp({
		players  	: 2,								//2 player game
		relative 	: true,								//relative tracking
		meters	 	: false,
		sensitivity : 1.0,								//no sensitivity applied
		joints	 	: [ 'HAND_RIGHT', 'HAND_LEFT' ],	//joints tracked
		gestures 	: [ 'ESCAPE', 'JUMP' ]				//gestures tracked
})
.sessionPersist()						//sustain conectivity
.modal.make( 'css/knctModal.css' )	//kickstarting the modal
.notif.make();							//kickstarting the notifications

//adding notifications on connection status
kinect.addEventListener('openedSocket', function() {
	this.notif.push( "CONNECTED" );
	gameObjects.isPaused = !gameObjects.isPaused;
});
kinect.addEventListener('closedSocket', function() { this.notif.push( "DISCONNECTED" ) });

//adding notifications on player detection/loss
kinect.addEventListener('playerFound', function( count ) {
	this.notif.push( "PLAYER FOUND. Total : " + count[ 0 ] );
	gameObjects.isPaused = false;
	
	if( count[ 0 ] == 1 )
	{
		gameObjects.ball.speed   = 0;
		gameObjects.ball.x       = canvas.instance.width / 2;
		gameObjects.ball.y       = canvas.instance.height / 2;
	}
});
kinect.addEventListener('playerLost', function( count ) {
	this.notif.push( "PLAYER LOST. Total : " + count[ 0 ] )
	
	if( count[ 0 ] == 0 )
		gameObjects.isPaused = true;
});

//binding controls_1 to screen-browser height
var normalizeY = function( controls ) {
		controls.y = ( ( controls.y ) / 100 ) * window.innerHeight;
	},
	jump = {
		cooldown : 4000,
		0 : new Date().getTime(),
		1 : new Date().getTime()
	};

//listening for jump
kinect.addEventListener( 'gestureJump', function( index ) {
	index = index[ 0 ];		//player index - who jumped
	
	//if no jump has been performed for the last '.cooldown' mseconds
	if( (new Date() - jump[ index ]) > jump.cooldown )
	{
		gameObjects.ball.weapon = true;	//make the ball invisible
		jump[ index ] = new Date();		//arm the cooldown
	}
	return false;
});

//custom escape code (escaped after 2 seconds)
kinect.addEventListener( 'gestureEscape', function( count ) {
	if( count[ 0 ] !== 0 )
		return false;
		
	if( count[ 1 ] === true )
	{
		kinect.notif.push( "ESCAPE..." );	//push escape
		window.escape = setTimeout(function() {
			history.back();
		}, 2000);
	}
	else
	{
		clearTimeout( window.escape );
		window.escape = false;
	}
	
	return false;
});

gameObjects.paddle2.controlMode = "";		//set mode to player controllable ( prevent conflicts with existing code )

//GAME CODE - runs per joints socket message
kinect.onMessage( function() {
	if( this.sk_len > 1 )	//if we have more than one players
	{
		controls_2.y =  this.coords[ 1 ][ 0 ].y ;	//grab the player's joint y-value
		normalizeY( controls_2 );					//normalize it (based on screen height resolution)
	}
	else
	{
		if( this.coords[ 0 ][ 0 ] )					//else, let the first player control the second paddle as well
		{
			controls_2.y =  this.coords[ 0 ][ 0 ].y ;
			normalizeY( controls_2 );
		}

	}
	
	if( this.coords[ 0 ][ 1 ] )						//first player - paddle
	{
		controls_1.y =  this.coords[ 0 ][ 1 ].y;	//grab the player's joint y-value
		normalizeY( controls_1 );					//normalize it (based on screen height resolution)
	}
	
	return false;
});