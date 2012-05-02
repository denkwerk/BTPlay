// Our main global objects get defined here
var browser = {};

/*
 * Browser initialization function that sets up a few initial variables
 *
 * @since Canvas Pong 1.0
 */
browser.init = function() {
	"use strict";
	
	this.isInternetExplorer = document.all ? true : false;
};

