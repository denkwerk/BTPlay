// Our main global objects get defined here
var canvas = {};

/**
 * Initial function to setup the canvas
 *
 * @since Canvas Pong 1.0
 */
canvas.init = function() {
	"use strict";
	
	this.instance = document.getElementById( 'canvas' );
	this.context = canvas.instance.getContext( '2d' );
};

/**
 * Initial canvas draw and set an interval so the canvas can redraw itself every
 * 20 milliseconds.
 *
 * @since Canvas Pong 1.0
 */
canvas.start = function() {
	"use strict";
	
	canvas.redraw( canvas.context, canvas.instance );
	
	setInterval( canvas.redraw, 20 );
};

/**
 * Draws a single frame for the canvas
 *
 * @since Canvas Pong 1.0
 */
canvas.redraw = function() {
	"use strict";
	
	var context = canvas.context;
	var instance = canvas.instance;
	
	// Clear the canvas so we can redraw it
	context.fillStyle = "#000";
	context.clearRect( 0, 0, instance.clientWidth, instance.clientHeight ) ;
	
	// Make the background black
	context.fillStyle = "#000";
	context.fillRect( 0, 0, instance.clientWidth, instance.clientHeight );
	
	gameObjects.middleLine.redraw( context, instance );
	gameObjects.paddle1.redraw( context, instance );
	gameObjects.paddle2.redraw( context, instance );
	gameObjects.ball.redraw( context, instance );
};